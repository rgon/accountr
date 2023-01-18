<script>
	import welcome from '$lib/assets/banner.svg'
	import ButtonCard from '$lib/ButtonCard.svelte'
	import AddNew from "svelte-material-icons/PlusThick.svelte"
	import GasStation from "svelte-material-icons/GasStation.svelte"
	import SilverwareForkKnife from "svelte-material-icons/GasStation.svelte"
	import Cart from "svelte-material-icons/Cart.svelte"

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<img class="welcome" src={welcome} alt="banner" />
	</h1>

	
	<br>
	<h3>Quick creation:</h3>
	
	<div style="max-width: 100%; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 1em;">
		<ButtonCard  href="/new?notes=Supermercado&openUpload=true" label="Supermercado">
			<Cart />
		</ButtonCard>
		<ButtonCard  href="/new?notes=Gasolina&openUpload=true" label="Gasolina">
			<GasStation />
		</ButtonCard>
		<ButtonCard  href="/new?notes=Restaurante&openUpload=true" label="Restaurante">
			<SilverwareForkKnife />
		</ButtonCard>
		<ButtonCard href="/new" label="Other">
			<AddNew />
		</ButtonCard>
	</div>
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
