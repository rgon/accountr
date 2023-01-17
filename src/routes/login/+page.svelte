<script lang="ts">
	import DateInput from '$lib/DateInput.svelte'

	import type { Record } from "$lib/types"
    import { storagePath, serverUrl, username, password } from "../stores"

	function submit () {
		console.log('submit')
	}
</script>

<svelte:head>
	<title>Log In</title>
	<meta name="description" content="Log In" />
</svelte:head>

<div class="text-column">
	<h1>Log In</h1>

	<form on:submit|preventDefault={submit}>
		<table>
			<tr>
				<td>Server</td>
				<td><input type="text" bind:value={$serverUrl} disabled></td>
			</tr>
			<tr>
				<td>Webdav dir</td>
				<td><input type="text" bind:value={$storagePath} disabled></td>
			</tr>

			<tr>
				<td>Username</td>
				<td><input type="text" bind:value={$username}></td>
			</tr>

			<tr>
				<td>Password</td>
				<td><input type="password" bind:value={$password}></td>
			</tr>

			<tr>
				<td colspan="3" style="text-align: center;">
					<input type="submit" value="Save">
			</tr>
		</table>
	</form>

	<p>
        We will create a directory in:
	</p>

	<pre>{$storagePath}</pre>
</div>
