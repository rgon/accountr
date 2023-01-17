<script lang="ts">
    import { onMount } from 'svelte'
    let preStyle = $$props.style
    let mClass = $$props.class

    import iconClose from '$lib/assets/mdi_close.black.svg'

    export let open:boolean = false
    export let noBackdrop:boolean = false
    export let animated:boolean = false
    export let backdropClickExit:boolean = false

    export let showExitButton:boolean = true

    export let animationDuration:number = .7
    // {'--animation-duration': animationDuration + 's' }

    let isOpen:boolean = false
    let mounted:boolean = false

    $: if (open) {
        if (mounted) {
            window.addEventListener('keydown', onEscKey)
        }
        isOpen = true
    } else {
        if (animated) {
            setTimeout(() => {
                isOpen = false
            }, animationDuration * 1000)
        } else {
            isOpen = false
        }
        try {
            window.removeEventListener('keydown', onEscKey)
        } catch (e) {}
    }

    function onEscKey (event:KeyboardEvent) {
        if (event.key === 'Escape') {
            open = false
        }
    }

    onMount(async () => {
        mounted = true

        return () => {
            try {
                window.removeEventListener('keydown', onEscKey)
            } catch (e) {}
        }
	});
    // window.bind
</script>

<dialog class={mClass || ''}
    class:noBackdrop={noBackdrop}
    class:animated={animated}
    class:open={open}
    open={isOpen}
    style={preStyle || ''}>

    {#if !noBackdrop}
    <div class="backdrop"
        on:click={() => {if (backdropClickExit) open = false}} 
        on:keypress={() => {}}>
    </div>
    {/if}

    <div class="content">
        <slot></slot>
    </div>

    {#if !noBackdrop && showExitButton}
    <img src={(mClass && mClass.includes('dark')) ? iconClose : iconClose} class="close" alt="close"
    on:click={() => {open = false}}
    on:keydown={() => {open = false}}>
    {/if}

    <slot name="customExitButton"></slot>
</dialog>
    
<style>
/**
*** Dialog Box
*/
dialog {
    z-index: 200;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    padding: 0;
    box-sizing: border-box;
    margin: 0;
    /* overflow: hidden; */
    border: none;
    background: none;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;

    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    --animation-duration: 1s;
}
dialog .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-color: var(--color-bg);
    opacity: .8;
}
dialog[open] {
    display: flex;
}
dialog .content {
    height: 100vh;
    height: -webkit-fill-available;
    height: fill-available;
    max-height: 100vh;

    width: 100vw;
    /* width: -webkit-fill-available;
    width: fill-available; */

    position: relative;
}
dialog .content {
    padding-top: 4.5em;
    /* max-height: 100%; */
    overflow: auto;
    overflow: auto;
}
@media screen and (max-width: 700px) {
    dialog {
        justify-content: flex-start;
    }
}
dialog .close {
    z-index: 100;
    position: absolute;
    height: clamp(50px, 10vw, 2.25em);
    right: 50px;
    top: 50px;
    cursor: pointer;
}
dialog .close:hover, dialog.close:focus, dialog.close:active {
    transform: scale(1.3);
}
@media screen and (max-width: 1000px) {
    dialog .close {
        right: 10px;
        top: 10px;
    }
}


:global(.customExitButton) {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1em;
}

@keyframes show {
    from {
        transform: translateY(-110%);
    }
    to {
        transform: translateY(0%);
    }
}
@keyframes hide {
    to {
        transform: translateY(-110%);
    }
}
.noBackdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: auto;
    height: auto;
    text-align: center;
    pointer-events: none;
    /* transform: translateY(-100%); */
    transition: transform .4s;
    /* display: none; */
}
.animated[open] {
    /* display: flex; */
    animation: show 1s ease normal;
    /* transform: translateY(0); */
}
.animated:not(.open) {
    animation: hide 1s ease normal;
}
</style>