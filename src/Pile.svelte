<script>
	let cards = [
		false, false, true, true, false, false,
		false, true, true, true, false, false,
		false, true, true, true, true, false,
		true, true, true, true, true, false,
		true, true, true, true, true, true
	]
</script>

<div class="pile">
	{#each cards as card}
		<div class="card" data-hidden="{!card}"></div>
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
	.card[data-hidden="true"] { opacity: 0.1; }

	.card:nth-child(n+7) { top: -40%; left: 50%; }
	.card:nth-child(n+13) { top: -80%; left: 0; }
	.card:nth-child(n+19) { top: -120%; left: 50%; }
	.card:nth-child(n+25) { top: -160%; left: 0; }
</style>