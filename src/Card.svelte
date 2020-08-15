<script>
	export let card = {};
	export let unblock;

	function takeCard() {
		if (!card.blocked) card.taken = true;
		unblock(card); // Unblock a bit
	}
</script>

<div
	class="card"
	data-blocked={card.blocked ? true : null}
	data-hidden={card.flipped ? true : null}
	data-taken={card.taken ? true : null}
	data-index={card.index}
	data-type={card.type}
	on:click={takeCard}
></div>

<style>
.card {
	background: #EEE;
	border: 1px solid blue;
	border-radius: 5px;
	cursor: pointer;
	height: calc((100vh - 200px) / 5);
	max-width: calc(10vw);
	position: relative;
	width: calc((100vh - 200px) / 5);
}
	.card[data-type="war"] { background: green; }
	.card[data-type="sci"] { background: goldenrod; }
	.card[data-type="civ"] { background: red; }
	.card[data-type="eco"] { background: blue; }
	.card[data-type="res"] { background: tan; }
	.card[data-type="man"] { background: #666; }
	.card[data-type="guild"] { background: purple; }

	.card[data-hidden] { 
		background: #ABC;
		border-color: teal;
	}
	
	.card[data-taken] { 
		opacity: 0; 
		pointer-events: none; 
	}
	
	.card[data-blocked] { 
		border: 2px solid black; 
		pointer-events: none;
	}

	.card:nth-child(n+7) { top: -40%; left: 50%; }
	.card:nth-child(n+13) { top: -80%; left: 0; }
	.card:nth-child(n+19) { top: -120%; left: 50%; }
	.card:nth-child(n+25) { top: -160%; left: 0; }

	.card:before { content: attr(data-index); }
</style>