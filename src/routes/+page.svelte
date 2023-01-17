<script>
	import welcome from '$lib/assets/banner.svg';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<img class="welcome" src={welcome} alt="banner" />
	</h1>

	<a href="/new">New Record</a>

	<br>
	<h3>Quick creation:</h3>
	<p>	<a href="/new?notes=Supermercado&openUpload=true">Supermercado</a></p>
	<p>	<a href="/new?notes=Gasolina&openUpload=true">Gasolina</a></p>
	<p>	<a href="/new?notes=Restaurante&openUpload=true">Restaurante</a></p>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: inline-block;
		position: relative;
		width: 100%;
		max-width: 80vw;
		object-fit: contain;
	}
</style>
