import { writable, get, type Writable } from "svelte/store"
import { ConnectionStatus, type Record } from "$lib/types"
import { createClient, type WebDAVClient } from "webdav/web"
import { connectionStatus, username as usernee, password as passee, serverUrl } from "../routes/stores"
import { makeFilename, stripExtension } from "./utils"

export const STORAGE_PATH = '/webAccounter'

export class ApiController {
    client: WebDAVClient
    savedFileList:Writable<string[]>

    constructor (url: string, username: string, password: string) {
        this.client = createClient(
            `${url}/remote.php/dav/files/${username}/`,
            {
                username,
                password,
                withCredentials: false
            }
        )
        usernee.set(username)
        console.log('logging in ', username)

        this.savedFileList = writable([])
    }

    async init () {
        this.client = createClient(
            `${get(serverUrl)}/remote.php/dav/files/${get(usernee)}/`,
            {
                username: get(usernee),
                password: get(passee)
            }
        )
        connectionStatus.set(ConnectionStatus.DISCONNECTED)

        try {
            if (await this.client.exists(STORAGE_PATH) === false) {
                console.info('creating directory ' + STORAGE_PATH)
                await this.client.createDirectory(STORAGE_PATH)
            }
            console.info('connected')
            connectionStatus.set(ConnectionStatus.CONNECTED)
        } catch (e:any) {
            console.error(String(e.toString()))
            connectionStatus.set(ConnectionStatus.ERROR)
        }
    }

    async getItems () {
        var directoryItems = (await this.client.getDirectoryContents(STORAGE_PATH))
    
        if (!(directoryItems instanceof Array)) {
            directoryItems = directoryItems.data
        }
        // update svelte store
        this.savedFileList.set(directoryItems.map(item => item.filename.replace(STORAGE_PATH + '/', '')))
    
        return directoryItems
    }

    async editFile (filename: string, content: Record) {
        console.log('moving', filename, 'to', makeFilename(content) + '.' + stripExtension(filename).extension)
        let newFileName = makeFilename(content)
        await this.client.moveFile(
            STORAGE_PATH + '/' + filename, 
            STORAGE_PATH + '/' + newFileName + '.' + stripExtension(filename).extension
        )
        return newFileName
    }

    async uploadFile (filename: string, content:ArrayBuffer) {
        console.log('uploading', filename)

        // await client.putFileContents("/my/file.jpg", imageBuffer, { overwrite: false });

        await this.client.putFileContents(
            STORAGE_PATH + '/' + filename, 
            content,
            { overwrite: false }
        )
    }
    
    async getFile (filename: string) {
        console.log('getting', filename)
        return await this.client.getFileContents(STORAGE_PATH + '/' + filename)
    }
}
