<script lang="ts">
    import { onMount } from 'svelte';
    import { getApiController } from '../routes/stores';
    import type { ApiController } from '$lib/apiController';

    export let filePath:string

    let apiController:ApiController
    let loading:boolean = true

    let previewSrc:string
    let fileType:string = 'image/*'

    function getImagePreviewFromArrayBuffer (buffer:ArrayBuffer) {
        let blob = new Blob([buffer], {type: 'image/jpeg'})
        let urlCreator = window.URL || window.webkitURL
        let imageUrl = urlCreator.createObjectURL(blob)
        return imageUrl
    }

    let mounted:boolean = false
    $: if (mounted && apiController) apiController.getFile(filePath).then(res => {previewSrc = getImagePreviewFromArrayBuffer(res as ArrayBuffer) })

	onMount(async () => {
        mounted = true
		apiController = await getApiController()
        loading = true
        previewSrc = getImagePreviewFromArrayBuffer(await apiController.getFile(filePath) as ArrayBuffer)
        loading = false
	})
</script>

<div class="text-column">
    {#if loading || !mounted}
        <p>Loading...</p>
    {:else}
        <p>Preview of {filePath}</p>
        <iframe title="preview" src={previewSrc} width="100%" height="100%" style="aspect-ratio: 1/1; object-fit:contain;"></iframe>
    {/if}
</div>