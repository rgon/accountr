<script>
	import { page } from '$app/stores'
	import logo from '$lib/assets/logo.svg'
	import profile from '$lib/assets/profile.svg'
	import login from '$lib/assets/login.svg'

    import { ConnectionStatus } from '$lib/types'
	import { connectionStatus, username } from '../routes/stores'
</script>

<header>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/new' ? 'page' : undefined}>
				<a href="/new">New Record</a>
			</li>
			<li aria-current={$page.url.pathname.startsWith('/list') ? 'page' : undefined}>
				<a href="/list">History</a>
			</li>
			<!-- <li aria-current={$page.url.pathname.startsWith('/bankLink') ? 'page' : undefined}>
				<a href="/bankLink">Bank Link</a>
			</li> -->
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner" class:error={$connectionStatus == ConnectionStatus.ERROR}>
		{#if $connectionStatus == ConnectionStatus.CONNECTED}
			<a href="/login">
				<img src={profile} alt="Profile" />
			</a>
			<!-- Connected as {$username} -->
		{:else}
			<a href="/login">
				<img src={login} alt="Profile" />
			</a>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;

		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
		background-image: linear-gradient(
			to bottom,
			var(--color-bg-0) 70%,
			transparent
		);
	}

	.corner {
		width: 3em;
		height: 3em;
		overflow-x: clip;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
		flex-shrink: 0;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		line-height: .8;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
		text-align: center;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 min(0.5rem, 1vw);
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	.error {
		background-color: red;
		border-radius: 50%;
	}
</style>
