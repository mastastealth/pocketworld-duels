<script>
	export let cards = [];
	export let gs = {};

	function adjustCards() {
		const c = [...cards];
		
		switch(gs.age) {
			case 1:
				c.unshift(false);
				c.unshift(false);
				c.splice(4, 0, false, false, false);
				c.splice(10, 0, false, false, false);
				c.splice(17, 0, false);
				c.splice(23, 0, false);
				return c;
			default:
				return c;
		}
	}

	$: finalCards = adjustCards();

	// Age 1 Structure looks like:
	// 	false, false, true, true, false, false,
	// 	false, true, true, true, false, false,
	// 	false, true, true, true, true, false,
	// 	true, true, true, true, true, false,
	// 	true, true, true, true, true, true
</script>

<div class="pile">
	{#each finalCards as card}
		{#if !card}<div class="card" data-hidden></div>{/if}
		{#if card}
			<div class="card"></div>
		{/if}
	{/each}
</div>

<style>
.pile {
	column-gap: 5px;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	transform: translateY(15%);
	width: 80%;
}

.card {
	background: #CCC;
	border: 1px solid blue;
	border-radius: 5px;
	height: calc((100vh - 200px) / 5);
	max-width: calc(10vw);
	position: relative;
	width: calc((100vh - 200px) / 5);
}
	.card[data-hidden] { opacity: 0.1; }

	.card:nth-child(n+7) { top: -40%; left: 50%; }
	.card:nth-child(n+13) { top: -80%; left: 0; }
	.card:nth-child(n+19) { top: -120%; left: 50%; }
	.card:nth-child(n+25) { top: -160%; left: 0; }
</style>