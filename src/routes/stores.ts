import { ApiController, STORAGE_PATH } from "$lib/apiController"
import { writable, type Writable, get } from "svelte/store"
import { storable } from "$lib/permanentStore"
import { ConnectionStatus } from "$lib/types"

export const apiController:Writable<ApiController> = writable()

export const connectionStatus:Writable<ConnectionStatus> = writable(ConnectionStatus.DISCONNECTED)
export const serverUrl:Writable<string> = storable('serverUrl')
export const storagePath:Writable<string> = storable('storagePath')
export const username:Writable<string> = storable('username')
export const password:Writable<string> = storable('password')

export async function getApiController () : Promise<ApiController> {
    // Promise that returns apiController
    return new Promise((resolve, reject) => {
        if (get(apiController)) resolve(get(apiController))
        
        // apiController.subscribe((apiController) => {
        //     console.log('apiController', apiController)
        //     resolve(apiController)
        // })
    })
}

export function init (username:string, password:string) {
    console.log('initializing apiController')
    storagePath.set(STORAGE_PATH)
    serverUrl.set('https://cloud.rgon.es')

    let controller = new ApiController(get(serverUrl) + '/remote.php/dav/files/rgon/', username, password)
    apiController.set(controller)
    controller.init()
}