<script>
	import { score, top5, top2, bot5, bot2 } from './store/warStore';
	import { gs } from './store/gameState';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let warTotal = 0;

	$: {
		warTotal = $gs.p1.warprogress - $gs.p2.warprogress
		score.set(warTotal);
	}

	$: markerPos = 9 - warTotal;

	$: {
		if (warTotal >= 6 && !$top5) { 
			top5.set(true); // Flag checkpoint
			const p2 = {...$gs.p2}; // Copy player data
			p2.ingoo -= p2.ingoo >= 5 ? 5 : p2.ingoo; // Adjust ingoo
			gs.set({...$gs, p2 }); // Set player data back
		}
		if (warTotal >= 3 && !$top2) { 
			top2.set(true);
			const p2 = {...$gs.p2};
			p2.ingoo -= p2.ingoo >= 2 ? 2 : p2.ingoo;
			gs.set({...$gs, p2 });
		}
		if (warTotal <= -6 && !$bot5) { 
			bot5.set(true);
			const p1 = {...$gs.p1};
			p1.ingoo -= p1.ingoo >= 5 ? 5 : p1.ingoo;
			gs.set({...$gs, p1 });
		}
		if (warTotal <= -3 && !$bot2) { 
			bot2.set(true);
			const p1 = {...$gs.p1};
			p1.ingoo -= p1.ingoo >= 2 ? 2 : p1.ingoo;
			gs.set({...$gs, p1 });
		}
	}
</script>

<aside 
	class="war-bar" 
	in:fly="{{ x: -200, duration: 300, easing: quintOut }}"
>
	<aside class="marker" style="top: calc((100% / 19) * {markerPos})"></aside>
	{#if !$top5}<aside class="penalty top-5"></aside>{/if}
	{#if !$top2}<aside class="penalty top-2"></aside>{/if}

	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>
	<div class="step"></div>

	{#if !$bot2}<aside class="penalty bot-2"></aside>{/if}
	{#if !$bot5}<aside class="penalty bot-5"></aside>{/if}
</aside>

<style>
.war-bar { 
	background: url('/assets/board.png');
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	height: 100%;
	grid-area: ws;
	padding: 0 8px;
	position: relative;
	/* width: 200px; - Defined by grid */
}

.marker {
	background: url('/assets/star.png') no-repeat center;
	background-size: contain;
	border-radius: 8px;
	height: calc(100% / 19);
	position: absolute;
	left: 0;
	top: var(--top);
	width: 100%;
	z-index: 1;
}

.penalty {
	background: linear-gradient(to bottom, darkred, rgb(71, 2, 5));
	border: 1px solid black;
	border-radius: 5px;
	color: white;
	display: grid;
	font-weight: bold;
	height: calc((100% / 19) * 3);
	place-items: center;
	position: absolute;
	left: 25px;
	top: calc(100% / 19);
	transform: scale(0.9);
	width: 50%;
}
	.penalty.top-2 { top: calc((100% / 19) * 4); }
	.penalty.bot-2 { top: calc((100% / 19) * 12); }
	.penalty.bot-5 { top: calc((100% / 19) * 15); }

	.penalty:not(.top-2):not(.bot-2):after,
	.penalty.bot-5:after { content: '-5'; font-size: 1.2em; }

	.penalty.top-2:after,
	.penalty.bot-2:after { content: '-2'; }

	.penalty:after {
		background: url('/assets/res.png') no-repeat -119px 0;
		display: grid;
		height: 40px;
		place-items: center;
		width: 40px;
	}

.step {
	border: 1px dashed black;
	flex: 1;
	width: 100%;
}
	.step:nth-of-type(10) { background: rgba(255, 255, 255, 0.2); }
	.step:nth-of-type(1),
	.step:nth-of-type(19) { background: rgba(255, 50, 50, 0.2); }
</style>