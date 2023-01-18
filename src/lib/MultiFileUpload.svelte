<script lang="ts">
    import type { UploadedFile } from '$lib/types'

    import Modal from '$lib/Modal.svelte'
    import Card from '$lib/Card.svelte'

    let fileinput:HTMLInputElement
	let uploadImage:boolean = true

    let previewOpen:boolean = false
    let previewIdx:number = 0

    export let fileList:UploadedFile[] = []

    export const control = {
        openUploadDialog(image:boolean=true) {
            fileinput.click()
        }
    }

    function preview (idx:number) {
        previewIdx = idx
        previewOpen = true
    }
    function remove(idx:number) {
        fileList = [...fileList.slice(0, idx), ...fileList.slice(idx+1)]
    }

    function getImagePreviewFromArrayBuffer (buffer:ArrayBuffer) {
        let blob = new Blob([buffer], {type: 'image/jpeg'})
        let urlCreator = window.URL || window.webkitURL
        let imageUrl = urlCreator.createObjectURL(blob)
        return imageUrl
    }

    function onFileSelected (e:any) {
        [...e.target.files].forEach((file:any) => {
            let reader = new FileReader()
            reader.readAsArrayBuffer(file)
            
            reader.onload = (ev) => {
                fileList = [...fileList, {
                    filename: file.name,
                    type: file.type,
                    content: ev.target?.result as ArrayBuffer,
                    previewSrc: getImagePreviewFromArrayBuffer(ev.target?.result as ArrayBuffer),
                    isImage: file.type.startsWith('image')
                }]
            }
        })
	}
</script>
<fieldset class="fileUpload">
    <legend>Upload Images</legend>

    <input style="display:none" type="file" accept={uploadImage ? 'image/*' : '*'}
		on:change={(e)=>onFileSelected(e)} bind:this={fileinput}>
    
    <div class="fileStrip">
        {#each fileList as file, idx}
        <div class="file" data-name={file.filename} on:click={e => preview(idx)} on:keypress={e => preview(idx)}>
            {#if file.isImage}
            <img src={file.previewSrc} alt="" draggable="false">
            {:else}
            <b>{file.type}</b>
            {/if}
            <button class="remove" on:click={() => remove(idx)}>x</button>
        </div>
        {/each}

        <button class="uploadButton" on:click={
            () => {uploadImage = true; requestAnimationFrame(() => fileinput.click())}
        }>+PH</button>
        <button class="uploadButton" on:click={
            () => {uploadImage = false; requestAnimationFrame(() => fileinput.click())}
        }>+PDF</button>
<!--         
        <label class="uploadButton" for="upload" on:click={
            () => {uploadImage = false; fileinput.click()}
        }>+</label> -->
    </div>
</fieldset>

<Modal open={previewOpen}>
	<Card title="File preview">
        {#if previewOpen}
        <object title="preview" data={fileList[previewIdx].previewSrc} type={fileList[previewIdx].type} width="100%" height="100%" style="aspect-ratio: 1/1; object-fit:contain;"></object>
        {/if}
        <pre>{fileList[previewIdx]?.filename}</pre>
        <button on:click={() => {
            previewOpen = false;
            setTimeout(() => {
                remove(previewIdx)
            }, 100)
        }}>Remove</button>
	</Card>
</Modal>

<style>    
    /* File Upload */
    fieldset.fileUpload {
        padding: .2em 1em .5em 1em;
        height: calc(100px + 1.7em);
        border-color: var(--color-shadow);
    }
    .fileUpload .fileStrip {
        width: 100%;
        max-width: 300px;
        overflow-x: auto;
        white-space: nowrap;
        overflow-y: hidden;
        display: block;
        width: auto;
        white-space: nowrap;
        height: 100%;
    }
    .fileUpload input {
        display: none;
        visibility: hidden;
    }
    .fileUpload .file, .fileUpload .uploadButton {
        height: 100px;
        /* min-width: 100px; */
        width: 100px;
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        border: 1px solid var(--color-shadow);
        position: relative;
    }
    .fileUpload .file .remove {
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
    }
    .fileUpload .file:hover::after, .fileUpload .file:hover::before {
        height: 50%;
    }
    .fileUpload .file:hover::before, .fileUpload .file:hover .remove {
        opacity: .8;
    }

    .fileUpload .file::after, .fileUpload .file::before {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2px;
        height: 30%;
    }
    .fileUpload .file::before {
        content: "";
        background-color: #909090;
        opacity: .5;
        backdrop-filter: blur(5px);
    }
    .fileUpload .file::after {
        overflow: hidden;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;

        content: attr(data-name);
        color: var(--color-text-2);
        font-size: .8em;
        line-height: .8;
        height: 1.6em;
        
        box-sizing: border-box;
        padding: 0 0.4em;
        margin-bottom: 0.2em;
    }
    .fileUpload .file b {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
    }
    .fileUpload .file img {
        height: 100%;

        object-fit: cover;
        width: 100%;
    }
    .fileUpload .uploadButton {
        /* width: 100px; */
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-family: 'Source Sans 3', sans-serif;
        font-weight: bold;
        font-size: 25px;
    }
</style>