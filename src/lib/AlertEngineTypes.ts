enum AlertType {
    info='info',
    warning='warning',
    error='error'
}
interface _Alert {
    type?:AlertType
    message:string
    description?:string
    duration?:number
}
interface AlertCard extends _Alert {
    id:number
}
class Alert implements _Alert {
    message
    type
    description
    duration

    constructor(message:string, type:AlertType=AlertType.info, duration:number|null = null, description:string|null = null) {
        this.message = message
        this.type = type
        if (description) this.description = description
        if (duration === null) {
            this.duration = Math.min((3 + this.message.length / 100), 5)
        } else {
            this.duration = duration
        }
    }
}
interface AlertEngineControl {
    alert:(m:Alert) => void
}
export type { AlertCard, AlertEngineControl }
export { Alert, AlertType }