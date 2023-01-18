<script lang="ts">
	import dayjs from 'dayjs'
	import { apiController as globalAc } from "../stores"
	import type { Writable } from "svelte/store"

	import type { ApiController } from '$lib/apiController'
	import Modal from '$lib/Modal.svelte'
	import MCard from '$lib/Card.svelte';
	import type { Record } from '$lib/types'
	import { parseFilename } from '$lib/utils'
    import { onMount } from "svelte";
    import RecordEdit from "$lib/RecordEdit.svelte";
    import DocPreview from '$lib/DocPreview.svelte'

	let apiController:ApiController
	let savedFileList:Writable<string[]>

	async function reload() {
		await apiController.getItems()
	}

	let showModal = false
	let currentlyEditedFile:string|undefined = undefined
	let currentlyEditedFileValues:Record|undefined = undefined
	let currentlyEditedIndex:number = -1

	function edit(filename:string|undefined, idx:number) {
		if (!filename) return
		currentlyEditedIndex = idx
		showModal = true
		currentlyEditedFile = filename

		currentlyEditedFileValues = parseFilename(filename)
	}

	async function saveChange() {
		if (!currentlyEditedFile) return
		if (currentlyEditedFileValues) {
			let fileName = await apiController.editFile(currentlyEditedFile, currentlyEditedFileValues)
			showModal = false
			currentlyEditedFileValues.filename = fileName
			records[currentlyEditedIndex] = currentlyEditedFileValues
		}
	}
	
	onMount(async () => {
		globalAc.subscribe(ac => {
			if (!ac) return
			apiController = ac
			savedFileList = ac.savedFileList
			apiController.getItems()
		})

		await reload()
	})
	
	let records:Record[] = []

	$: if ($savedFileList) records = $savedFileList.map(e => parseFilename(e))	
</script>

<svelte:head>
	<title>Record History</title>
	<meta name="description" content="History of records" />
</svelte:head>

<div class="text-column">
	<h1>Record History <button on:click={reload}>reload</button></h1>

	<table>
		<tr>
			<th>Date</th>
			<th>Company</th>
			<!-- <th>Ammount</th> -->
			<!-- <th>Invoice Number</th> -->
			<th>Notes</th>
			<th></th>
			<th>Filename</th>
		</tr>

		{#each records as record, idx}
			<tr>
				<td>{dayjs(record.date).format('YYYY-MM-DD') || '-bad format-'}</td>
				<td>{record.company || ''}</td>
				<!-- <td>{record.ammount}</td> -->
				<!-- <td>{record.invoiceNumber}</td> -->
				<td>{record.notes || ''}</td>
				<td><button on:click={() => edit(record.filename, idx)}>edit</button></td>
				<td><small>{record.filename}</small></td>
			</tr>
		{/each}
	</table>
</div>

<Modal bind:open={showModal}>
	<MCard title="Edit Records">
		{#if currentlyEditedFileValues}
		<RecordEdit on:submit={saveChange} bind:value={currentlyEditedFileValues} />

		{#if currentlyEditedFile}
		<h2>Preview</h2>
		<DocPreview filePath={currentlyEditedFile} />
		{/if}
		{/if}
	</MCard>
</Modal>

<style>
	.text-column {
		max-width: min(48rem, 95vw);
		overflow: auto;
	}
</style>