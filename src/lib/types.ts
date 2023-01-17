
export interface Record {
    valid:boolean
    date?: Date // undefined if error parsing
    part:number
    company: string
    notes?: string
    ammount?: number
    invoiceNumber?: string
    filename?: string
}

export interface UploadedFile {
    filename:string
    previewSrc:any
    content:ArrayBuffer
    isImage:boolean
    type:string
}

export enum ConnectionStatus {
    DISCONNECTED,
    CONNECTED,
    ERROR,
}


export const DATEFORMAT =  'YYYYMMDD'
export const PARTSEPARATOR = '.'