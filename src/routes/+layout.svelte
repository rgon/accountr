<script lang="ts">
	import { init, serverUrl, storagePath, username, password } from "./stores"
    import { onMount } from 'svelte'
	import Header from './Header.svelte'

	import AlertEngine from '$lib/AlertEngine.svelte'
    import type { AlertEngineControl } from '$lib/AlertEngineTypes'
    // import { Alert, AlertType } from '$lib/AlertEngineTypes'
    let alertEngine:AlertEngineControl

	import './styles.css'

	onMount(async () => {
		init($username, $password)
	})
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>open containing folder <a target="_blank" href={$serverUrl + "/apps/files/?dir=" + $storagePath} rel="external noreferrer">in nextcloud</a></p>
	</footer>

	<AlertEngine bind:control={alertEngine} bindConsole={true}></AlertEngine>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
