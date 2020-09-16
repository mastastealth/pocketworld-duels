<script>
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let card = {};
	export let selectCard = () => {};
	export let index = 0;

	$: fullCost = card.cost.length 
		? card.cost.filter(c => c !== "coin") 
		: card.cost;

	$: coinCost = card.cost.length 
		? card.cost.filter(c => c === "coin").length 
		: false;

	function warLen(n) {
		const x = [];
		x.length = n;
		return x;
	}

	function noFn () {}
</script>

<div
	class="card"
	in:fly="{{ y: -200, duration: 300, delay: index * 50, easing: quintOut }}"
	data-blocked={card.blocked ? true : null}
	data-hidden={card.flipped ? true : null}
	data-taken={card.taken ? true : null}
	data-index={card.index}
	data-type={card.type}
	data-res={card.res}
	data-trade={card.trade}
	data-sci={card.sci}
	on:click={!card.taken ? selectCard(card) : noFn}
>
	<header>
		{#if card.cost}
			<div class="ingoo">
				{#if typeof card.cost === 'number' || coinCost}
					<strong>{coinCost || card.cost}</strong>
				{/if}
				{#if card.cost.length}
					<ul class="res-list">
						<li>
							{#each fullCost as cost}
								<div class="pog" data-res={cost}></div>
							{/each}
						</li>
						{#if card.linkcost}
							<li>
								<i class="icon icon-{card.linkcost}"></i>
							</li>
						{/if}
					</ul>
				{/if}
			</div>
		{/if}

		{#if card.res || card.trade}
			<div class="pog"></div>
			{#if card.rescount === 2}<div class="pog"></div>{/if}
			{#if card.rescount === 3}<div class="pog"></div>{/if}
		{:else if card.provides}
			<div class="provided">
				<span class="pog" data-res={card.provides[0]}></span>
				<span class="pog" data-res={card.provides[1]}></span>
				{#if card.provides.length === 3}
					<span class="pog" data-res={card.provides[2]}></span>
				{/if}
			</div>
		{:else if card.vp}
			<div class="vp">{card.vp}</div>
		{:else if card.instant}
			<div class="instant">{card.instant}</div>
		{:else if card.war}
			{#each warLen(card.war) as star}
				<img src="/assets/star.png" alt="⭐" class="star">
			{/each}
		{/if}

		{#if card.link}
			<div class="link-icon">
					<i class="icon icon-{card.link}"></i>
			</div>
		{/if}
		{#if card.sci}
			<div class="sci-icon" data-sci="card.sci">
				<i class="icon icon-{card.sci}"></i>
			</div>
		{/if}
	</header>

	<main></main>
</div>

<style>
.card {
	background: url('/assets/card.png');
	background-size: 100% 200%;
	background-blend-mode: hard-light;
	border-radius: 5px;
	box-shadow: 0 2px 7px rgba(0, 0, 0, 0.5);
	color: white;
	cursor: pointer;
	height: calc((100vh - 200px) / 5);
	min-height: 144px;
	min-width: calc((100vh - 200px) / 5);
	position: relative;
	transform: translateZ(1px);
	width: 80%;
	will-change: contents;
	z-index: 1;
}
	.card[data-type="war"],
	.card[data-type="war"] .ingoo li:before { background-color: var(--war); }
	.card[data-type="sci"],
	.card[data-type="sci"] .ingoo li:before { background-color: var(--sci); }
	.card[data-type="civ"] { 
		background-image: linear-gradient(var(--civ), var(--civ)), url('/assets/card.png'); 
		background-blend-mode: color;
	}
		.card[data-type="civ"] .ingoo li:before {
			background-image: linear-gradient(var(--civ), var(--civ)), url('/assets/bar.png'); 
			background-blend-mode: color;
		}
	.card[data-type="eco"],
	.card[data-type="eco"] .ingoo li:before { background-color: var(--eco); }
	.card[data-type="res"],
	.card[data-type="res"] .ingoo li:before { background-color: var(--res); }
	.card[data-type="man"],
	.card[data-type="man"] .ingoo li:before { 
		background-position: left bottom; 
		background-blend-mode: none;
	}
	.card[data-type="guild"] { background-color: var(--guild); }

	.card[data-blocked] { 
		filter: grayscale(0.5) saturate(60%);
		pointer-events: none;
	}
	.card[data-blocked] .pog { 
		filter: grayscale(0.1) brightness(75%);
	}

	.card[data-hidden] { 
		background: url('/assets/card_bg.png') no-repeat right bottom;
		background-size: auto 200%;
		filter: none;
	}
	.card[data-hidden] * { display: none !important; }

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

	.card[data-res="stone"] .pog:before,
	.card[data-trade="stone"] .pog:before { background-position: -30px 0; }
	.card[data-res="wood"] .pog:before,
	.card[data-trade="wood"] .pog:before { background-position: -60px 0; }
	.card[data-res="paper"] .pog:before,
	.card[data-trade="paper"] .pog:before { background-position: 0 -30px; }
	.card[data-res="glass"] .pog:before,
	.card[data-trade="glass"] .pog:before { background-position: -30px -30px; }

.card[data-trade] .pog:after {
	background: rgba(0, 0, 0, 0.5);
	border-radius: 3px;
	content: "1";
	display: block;
	font-size: 0.7em;
	padding: 0 8px;
	position: absolute;
	bottom: 1px; left: 20%;
	text-align: center;
	z-index: 1;
}


.provided { text-align: right; }
	.provided .pog { display: inline-grid; }
	.provided .pog:nth-of-type(1) { transform: translateX(50%); }
	.provided .pog:nth-of-type(3) { transform: translateX(-50%); }
	.provided .pog:nth-of-type(1):nth-last-child(2) { transform: translateX(25%); }
	.provided .pog:nth-of-type(2):last-child { transform: translateX(-25%); }

header {
	align-items: center;
	display: flex;
	font-weight: bold;
	height: 32%;
	justify-content: center;
	margin-bottom: 0.5vh;
	position: relative;
	top: 0; left: 0;
	width: 100%;
}
	header > .pog { top: 3px; }

.star {
	width: 40px;
}

.vp, .instant { 
	font-size: 1.5em;
}
	.instant {
		background: url('/assets/res.png') no-repeat -120px 0;
		background-size: 160px 80px;
		height: 40px;
		text-align: center;
		width: 40px;
	}
	.vp {
		background: url('/assets/food.png') no-repeat 6px 3px;
		background-size: auto 93%;
		min-width: 60px;
		text-align: center;
	}

.sci-icon,
.link-icon {
	height: 100%;
	line-height: 5.5vh;
	position: absolute;
	top: 0; right: 0;
	text-align: center;
	text-transform: uppercase;
	width: 40px;
}
	.sci-icon { 
		font-size: 1.5em; 
		mix-blend-mode: overlay;
	}

	.link-icon + .sci-icon { right: 30px; }

	.link-icon {
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		height: 30px;
		line-height: 30px;
		margin: 5px;
		width: 30px;
	}

.ingoo {
	min-height: 100%;
	position: absolute;
	top: 0; left: 8px;
}
	.ingoo strong {
		background: url('/assets/res.png') no-repeat -90px 1px;
		background-size: 120px 60px;
		display: block;
		line-height: 30px;
		margin-top: 40%;
		text-align: center;
		width: 30px;
	}

	.ingoo li { position: relative; }
		.ingoo li:before {
			background: url('/assets/bar.png') no-repeat;
			background-blend-mode: hard-light;
			background-size: 100% 100%;
			content: '';
			height: 20px;
			position: absolute;
			left: -5px; top: 4px;
			width: 90%;
			z-index: -1 !important;
		}

	.ingoo .pog {
		display: inline-grid;
		height: 30px;
		left: 2px;
		width: 30px;
	}
		.ingoo .pog:before {
			background-size: 80px 40px;
			height: 20px;
			margin: auto;
			width: 20px;
			z-index: 1;
		}
			.ingoo .pog[data-res="stone"]:before { background-position: -20px 0; }
			.ingoo .pog[data-res="wood"]:before { background-position: -40px 0; }
			.ingoo .pog[data-res="paper"]:before { background-position: 0 -20px; }
			.ingoo .pog[data-res="glass"]:before { background-position: -20px -20px; }

.res-list {
	margin: 0;
	padding: 6vh 0 0 0;
	list-style: none;
}
	.ingoo strong + .res-list { padding-top: 0; }

main {
	height: 5vh;
	position: relative;
}
</style>