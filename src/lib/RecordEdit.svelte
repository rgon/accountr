<script lang="ts">
    import type { Record } from "$lib/types"
    import { createEventDispatcher } from "svelte"

    import DateInput from '$lib/DateInput.svelte'

    export let value:Record

    export let enabled:boolean = true

    // create svelte event dispatcher
    const dispatch = createEventDispatcher()

    function submit (ev:Event) {
        dispatch('submit', ev)
    }
</script>

<form on:submit|preventDefault={submit}>
    <table>
        <tr>
            <th>Title</th>
            <th>Data</th>
        </tr>

        <tr>
            <td>Date</td>
            <td><DateInput bind:date={value.date} /></td>
        </tr>

        <tr>
            <td>Company</td>
            <td><input type="text" bind:value={value.company}></td>
        </tr>

        <tr>
            <td>Num Factura</td>
            <td><input type="text" bind:value={value.invoiceNumber}></td>
        </tr>

        <tr>
            <td>Comentario</td>
            <td><input type="text" bind:value={value.notes}></td>
        </tr>

        <tr>
            <td>Valid:</td>
            <td><input type=checkbox bind:checked={value.valid}></td>
        </tr>
        
        <tr>
            <td colspan="3" style="text-align: center;">
                <input type="submit" value="Save" disabled={!enabled}>
        </tr>
    </table>
</form>
