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
	border-radius: 5px;
	box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	height: calc((100vh - 200px) / 5);
	max-width: calc(10vw);
	position: relative;
	width: calc((100vh - 200px) / 5);
}
	.card[data-type="war"] { background: var(--war); }
	.card[data-type="sci"] { background: var(--sci); }
	.card[data-type="civ"] { background: var(--civ); }
	.card[data-type="eco"] { background: var(--eco); }
	.card[data-type="res"] { background: var(--res); }
	.card[data-type="man"] { background: var(--man); }
	.card[data-type="guild"] { background: var(--guild); }

	.card[data-hidden] { 
		background: #ABC;
	}
	
	.card[data-taken] { 
		opacity: 0; 
		pointer-events: none; 
	}
	
	.card[data-blocked] { 
		filter: grayscale(0.1) brightness(75%);
		pointer-events: none;
	}

	.card:nth-child(n+7) { top: -40%; left: 50%; }
	.card:nth-child(n+13) { top: -80%; left: 0; }
	.card:nth-child(n+19) { top: -120%; left: 50%; }
	.card:nth-child(n+25) { top: -160%; left: 0; }
	.card:nth-child(n+31) { top: -200%; left: 50%; }
	.card:nth-child(n+37) { top: -240%; left: 0; }

	.card:before { content: attr(data-index); }
</style>