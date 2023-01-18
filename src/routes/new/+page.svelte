<script lang="ts">
	import { page } from '$app/stores'

	import RecordEdit from '$lib/RecordEdit.svelte'

	import type { Record, UploadedFile } from "$lib/types"
    import { makeFilename } from "$lib/utils"
    import MultiFileUpload from '$lib/MultiFileUpload.svelte'
    import { onMount } from 'svelte';
    import { getApiController } from '../stores';
    import type { ApiController } from '$lib/apiController';

	let currentDate = new Date()
	let value:Record

    let fileList:UploadedFile[] = []

	$: value = {
		valid: true,
		date: currentDate,
		part: 0,
		company: '',
		ammount: 0,
		notes: '',
	}
	$: filename = makeFilename(value)
	let enabled:boolean = false
	$: if (fileList.length > 0) {
		if (value.company.length > 0 || (value.invoiceNumber && value.invoiceNumber.length > 0) || (value.notes && value.notes.length > 0)) {
			enabled = true
		} else {
			enabled = false
		}
	}
	let uploadControl:any
	let openUpload = $page.url.searchParams.get('openUpload')

	let mounted:boolean = false
	let apiController:ApiController
	
	$: if (mounted && openUpload) uploadControl.openUploadDialog()
	onMount(async () => {
		apiController = await getApiController()

		const urlCompanyParams = $page.url.searchParams.get('company')
		if (urlCompanyParams !== null) {
			value.company = urlCompanyParams
		}
		const urlNotesParams = $page.url.searchParams.get('notes')
		if (urlNotesParams !== null) {
			value.notes = urlNotesParams
		}

		mounted = true
	})

	async function submit () {
		fileList.forEach(async (file, idx) => {
			const extension = file.filename.split('.').pop()
			const thisRecord:Record = {...value}
			thisRecord.part = idx
			const thisFilename = makeFilename(thisRecord)

			console.log('submit', `${thisFilename}.${extension}`, 'ArrayBufferLength', file.content.byteLength)
			await apiController.uploadFile(`${filename}.${extension}`, file.previewSrc)
			console.log('ok')
			window.location.href = '/'
		})
	}
</script>

<svelte:head>
	<title>Add record</title>
	<meta name="description" content="Add new record" />
</svelte:head>

<div class="text-column">
	<h1>Add new record</h1>

	<RecordEdit on:submit={submit} enabled={enabled} bind:value />

	<MultiFileUpload bind:fileList={fileList} bind:control={uploadControl} />

	<p>
        We will create a file with the following name: 
	</p>

	<pre>{filename}</pre>
</div>