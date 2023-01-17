import dayjs from 'dayjs'
import { DATEFORMAT, PARTSEPARATOR, type Record } from './types'

export function makeFilename (record: Record) {
    return (record.valid ? '' : 'x')
        + `${(record.date!=undefined) ? dayjs(record.date).format(DATEFORMAT) : ''}${(record.part > 0) ? PARTSEPARATOR + String(record.part) : ''} ${record.company||''}` + (record.invoiceNumber ? ` Fra. ${record.invoiceNumber.replace('/', '_')}` : '')
        + (record.notes ? ` # ${record.notes.replace('/', '_').replace('#', '_').replace('~', '_').replace('Fra.', 'Fra ')}` : '')
}

export function stripExtension (filename:string) {
    return {
        filename: filename.split('.').slice(0, -1).join('.'),
        extension: filename.split('.').slice(-1)[0]
    }
}
export function parseFilename (fileUri:string) : Record {
    let filename = stripExtension(fileUri).filename

    const valid = filename.startsWith('x') === false
    if (!valid) filename = filename.slice(1)

    const notesPre = filename.replace('~', '#').split('#')
    const notes = notesPre.length > 1 ? notesPre.slice(-1)[0].trim() : undefined
    const restPre = (notesPre.length > 1) ? notesPre.slice(0, -1).join('#') : notesPre[0]

    const pre = restPre.split('Fra.')
    const dateText = pre[0].split(' ')[0]
    const company = pre[0].split(' ').slice(1).join(' ').trim()
    
    const invoiceNumber = pre.length > 1 ? pre[1].trim() : undefined
    
    let date:Date|undefined = undefined
    let preDateAndPart = dateText.split(PARTSEPARATOR)
    try {
        let preDate = dayjs(preDateAndPart[0], DATEFORMAT)
        if (preDate.isValid()) date = preDate.toDate()
        else console.log('invalid date', notesPre)
    } catch {}

    const part = preDateAndPart.length > 1 ? parseInt(preDateAndPart[1]) : 0

    return {
        valid,
        part,
        date,
        company,
        notes,
        invoiceNumber,
        filename: fileUri
    }
}
