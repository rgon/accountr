<script lang="ts">
    import { onMount } from 'svelte'
    import type { AlertCard, AlertEngineControl } from './AlertEngineTypes'
    import { AlertType, Alert } from './AlertEngineTypes'
    
    import iconClose from '$lib/assets/mdi_close.black.svg'

    let preStyle = $$props.style
    let mClass = $$props.class

    export let maxMessages:number = 3
    export let bindConsole:boolean = true
    
    let mounted:boolean = false
    let messageIdx:number = 0
    
    let visibleAlerts = new Map<number, AlertCard>()
    let alertTimeOuts = new Map<number, any>()
    
    alertTimeOuts.set(0, () => {})
    
    function removeAlert(id:number) {
        try {
            clearTimeout(alertTimeOuts.get(id))
        } catch (e) {}
        
        alertTimeOuts.delete(id)
        visibleAlerts.delete(id)
        
        visibleAlerts = visibleAlerts
    }
    function showAlert(m:Alert) : void {
        const thisAlert:AlertCard = {
            id: messageIdx,
            type: m.type,
            message: m.message,
            description: m.description,
            duration: m.duration
        }
        visibleAlerts.set(thisAlert.id, thisAlert)
        
        if (thisAlert.duration) {
            alertTimeOuts.set(thisAlert.id, setTimeout(() => {
                removeAlert(thisAlert.id)
            }, thisAlert.duration * 1000))
        }
        visibleAlerts = visibleAlerts
        
        messageIdx += 1
    } 
    export const control:AlertEngineControl = {
        alert: showAlert
    }
    
    interface ConsoleInterface extends Object {
        warn:Function
        log:Function
        error:Function
        info:Function
    }
    
    let originalConsoles = new Map<string, Function>()
    function consoleHookFactory (id:string, consoleFn:Function, type=AlertType.error) {
        originalConsoles.set(id, consoleFn)
        const hookFn = (...args:any) => {
            const messages = args.filter((e:any) => typeof e == 'string')
            showAlert(new Alert(
            messages.join(' '),
            type
            ))
            
            return consoleFn(...args)
        }
        return hookFn
    }
    function hookConsoles(mConsole:ConsoleInterface) {
        mConsole.warn = consoleHookFactory('warn', console.warn, AlertType.warning)
        mConsole.error = consoleHookFactory('error', console.error, AlertType.error)
        mConsole.info = consoleHookFactory('info', console.info, AlertType.info)
    }
    function restoreConsoles(mConsole:ConsoleInterface) {
        mConsole.warn = originalConsoles.get('warn') || (() => {})
        mConsole.error = originalConsoles.get('error') || (() => {})
        mConsole.info = originalConsoles.get('info') || (() => {})
    }
        
    $: if (mounted && bindConsole) {
        hookConsoles(console)
    }
    onMount(async () => {
        mounted = true
        
        return () => {
            if (bindConsole) restoreConsoles(console)
            
            for (let [key, timeout] of alertTimeOuts) {
                try {
                    clearTimeout(timeout)
                } catch (e) {}
            }
        }
    })
    
    /* USAGE:
    
    import AlertEngine from '$lib/AlertEngine.svelte'
    import type { AlertEngineControl } from '$lib/AlertEngineTypes'
    import { Alert, AlertType } from '$lib/AlertEngineTypes'
    let alertEngine:AlertEngineControl
    
    alertEngine.alert(new Message('hello'), AlertType.warning)
    */
</script>

<div class="alertDialogContainer">
    {#each [...visibleAlerts].reverse().slice(0, maxMessages) as [id, card] (id)}
    <dialog 
    class="{mClass || ''} alert {String(card.type)}"
    style="{preStyle || ''} --dialog-duration: {parseInt(String(card.duration))}s;"
    on:keydown={(e) => {if (e.key == 'Escape') removeAlert(card.id)}}
    open>
        <i class="type">Type: {String(card.type).toUpperCase()}</i>
        <span>{card.message.slice(0, 150)}</span>
        <img class="close grow" alt="cerrar diálogo" src={iconClose}
        on:click={() => {removeAlert(card.id)}}
        on:keydown={() => {removeAlert(card.id)}}
        >
    </dialog>
    {/each}
</div>

<style>
    /* ---- Alerts ----- */
    .alertDialogContainer {
        position: fixed;
        top: 0;
        right: 0;
        left: auto;
        bottom: auto;
        margin: 50px;
        z-index: 500;
        text-align: left;    
    }
    dialog.alert {
        position: relative;
        min-width: 165px;
        margin-bottom: 18px;
        margin-right: 0;
        margin-left: auto;

        --close-button-size: 2.5em;

        display: grid;
        justify-content: stretch;
        align-items: stretch;
        grid-template-rows: min-content min-content;
        grid-template-columns: 1fr min-content;
        
        padding: 1em;

        box-shadow: 15px 15px 40px var(--color-shadow);
        border: none;
        
        /* --dialog-duration: 3s; */
        --alert-color: red;
        
        background: var(--alert-color);
    }
    dialog.alert[open=false] {
        display: none;
    }
    .alert::before {
        content: "";
        position: absolute;
        background-color: black;
        bottom: 0;
        left: 0;
        height: 4px;
        width: 0%;
        animation-name: alertTimeoutAnimation;
        animation-timing-function: linear;
        animation-duration: var(--dialog-duration);
        animation-fill-mode: forwards;
    }
    .alert i.type {
        color: #2f2f2f;
        grid-row: 1;
        grid-column: 1;
        font-size: small;
        font-style: normal;
    }
    .alert > span {
        grid-row: 2;
        grid-column: 1 / span 2;
        margin-right: .5em;
    }
    .alert .close {
        color: black;
        grid-row: 1;
        grid-column: 2;

        height: 1em;
        width: 1em;
        font-family: monospace;
        font-size: var(--close-button-size);
        user-select: none;
        cursor: pointer;
    }
    .alert .close:hover, .alert.close:focus {
        transform: scale(1.2);
    }
    @keyframes alertTimeoutAnimation {
        from {width: 0%;}
        to {width: 100%;}
    }
    .alert.info {
        --alert-color: var(--color-bg);
        border: 1px dashed var(--feature-color);
    }
    .alert.warning {
        --alert-color: rgb(255, 165, 46);
    }
</style>