<script lang="ts">
	import type { Record } from "$lib/types"
    import { init, storagePath, serverUrl, username, password } from "../stores"

	async function submit () {
		console.log('submit')
		await init($username, $password)
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
				<td><input type="text" bind:value={$serverUrl}></td>
			</tr>
			<tr>
				<td>Webdav dir</td>
				<td><input type="text" bind:value={$storagePath}></td>
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
