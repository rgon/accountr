<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    let preStyle = $$props.style
    let mClass = $$props.class

    export let label:string|undefined = undefined
    export let href:string = '#/'

    // -- Event dispatcher
    const dispatch = createEventDispatcher()

    function onClick() {
        dispatch('click', {})
    }
</script>
<a {href} class="card {mClass || ''}"
    style="{preStyle || ''}"
    on:click={() => onClick()}
    on:keydown={() => onClick()}>
    <slot>
        <span class="material-icons">analytics</span>
    </slot> 
    {#if label}
    <span>{label}</span>
    {/if}
</a>

<style>
    .card {
        --card-width: 135px;
        width: min(45%, var(--card-width));
        line-height: 1;
        aspect-ratio: 1 / 1;
        box-sizing: border-box;
        white-space: normal;
        text-align: center;
        position: relative;

        padding: .8em;
        border-radius: 0.5em;
        box-shadow: 2px 2px 5px var(--color-shadow);
        text-align: center;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: box-shadow .1s;
        background-color: var(--color-bg-2);
    }
    a.card:hover, a.card:focus {
        box-shadow: 10px 10px 1px var(--color-shadow);
        /* border: 1px solid var(--color-shadow); */
        text-decoration: none !important;
    }
    .card span {
        font-size: clamp(1rem, 1.2em, 4.7vw);
        margin: 0;
        line-height: .8;
        padding-top: .7em;
        display: inline-block;
        font-weight: 300;
    }
    .card :global(img), .card :global(svg) {
        text-align: center;
        /* font-size: 50px; */
        height: min(50px, 100%);
        flex-shrink: 0;
        font-size: 3em;
    }
</style>