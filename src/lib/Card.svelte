<script lang="ts">
    let preStyle = $$props.style
    let mClass = $$props.class
    
    export let title:string|undefined = undefined
</script>
<div class="card {mClass || ''}" style={preStyle}>
    {#if title}
    <h2 class="title">{title}</h2>
    {/if}

    <slot></slot>
</div>
<style>
.card {
    padding: 2em;
    border-radius: 0.5em;
    box-shadow: 2px 2px 5px var(--color-shadow);
    text-align: left;
    display: inline-block;
    transition: box-shadow .1s;
    background-color: var(--color-bg-2);
}
/* Title */
.title {
    font-weight: 300;
    font-size: 2em;
    margin: 0;
    margin-bottom: .5em;
}
</style>