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
	data-res={card.res}
	data-sci={card.sci}
	on:click={takeCard}
>
	<main>
		{#if card.cost}
			<div class="food">
				{#if typeof card.cost === 'number'}<strong>{card.cost}</strong>{/if}
			</div>
		{/if}
	</main>
</div>

<style>
.card {
	background: url('/assets/card.png');
	background-size: 100% 200% !important;
	background-blend-mode: hard-light;
	border-radius: 5px;
	box-shadow: 0 2px 7px rgba(0, 0, 0, 0.5);
	color: white;
	cursor: pointer;
	height: calc((100vh - 200px) / 5);
	max-width: calc(10vw);
	position: relative;
	width: calc((100vh - 200px) / 5);
	z-index: 1;
}
	.card[data-type="war"] { background-color: var(--war); }
	.card[data-type="sci"] { background-color: var(--sci); }
	.card[data-type="civ"] { 
		background: linear-gradient(var(--civ), var(--civ)), url('/assets/card.png'); 
		background-blend-mode: color;
	}
	.card[data-type="eco"] { background-color: var(--eco); }
	.card[data-type="res"] { background-color: var(--res); }
	.card[data-type="man"] { 
		background-position: left bottom; 
		background-blend-mode: none;
	}
	.card[data-type="guild"] { background-color: var(--guild); }

	.card[data-blocked] { 
		filter: grayscale(0.1) brightness(75%);
		pointer-events: none;
	}
	.card[data-blocked]:before,
	.card[data-blocked]:after { 
		filter: grayscale(0.1) brightness(75%);
	}

	.card[data-hidden] { 
		background: url('/assets/card_bg.png') no-repeat right bottom;
		background-size: auto 200%;
		filter: none;
	}
	.card[data-hidden]:before,
	.card[data-hidden]:after,
	.card[data-hidden] main { display: none !important; }

	.card[data-taken] { 
		opacity: 0; 
		pointer-events: none; 
	}

	.card:nth-child(n+7) { top: -40%; left: 50%; }
	.card:nth-child(n+13) { top: -80%; left: 0; }
	.card:nth-child(n+19) { top: -120%; left: 50%; }
	.card:nth-child(n+25) { top: -160%; left: 0; }
	.card:nth-child(n+31) { top: -200%; left: 50%; }
	.card:nth-child(n+37) { top: -240%; left: 0; }

	.card[data-type="man"]:before,
	.card[data-type="man"]:after,
	.card[data-type="res"]:before,
	.card[data-type="res"]:after { 
		background: url('/assets/pog.png');
		background-size: 100% auto;
		content: '';
		display: block;
		height: 40px;
		left: calc(50% - 20px);
		position: absolute;
		top: 6px;
		width: 40px;
	}

	.card[data-type="man"]:before,
	.card[data-type="res"]:before {
		background: url('/assets/res.png') no-repeat;
		background-size: 120px 30px;
		height: 30px;
		top: 10px; left: calc(50% - 16px);
		width: 30px;
		z-index: 1;
	}
		.card[data-res="stone"]:before { background-position: -30px 0; }
		.card[data-res="wood"]:before { background-position: -60px 0; }

/* footer {
	position: absolute;
	bottom: 0; left: 0;
	width: 100%;
} */
main {
	height: 100%;
	padding-top: 10px;
	position: relative;
	width: 100%;
}

.food {
	background: url('/assets/res.png') no-repeat -90px 0;
	background-size: 120px 30px;
	height: 30px;
	padding-left: 10px;
	position: relative;
	bottom: 3px; left: 7px;
	width: 30px;
}
	.food strong {
		line-height: 26px;
		padding-left: 3px; 
	}
</style>