<script>
	import { score, top5, top2, bot5, bot2 } from './store/warStore';
	import { gs } from './store/gameState';
	import { aStore } from './store/alertStore';
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
	<aside 
		class="marker" 
		style="transform: translateY({(9 - markerPos) * -100}%)"
		on:mouseenter={() => { aStore.setTip('warbar-marker') }}
		on:mouseleave={() => { aStore.setTip() }}
	></aside>
	<aside class="penalty top-5 {$top5 ? 'got' : ''}"></aside>
	<aside class="penalty top-2 {$top2 ? 'got' : ''}"></aside>

	<div 
		class="step"
		on:mouseenter={() => { aStore.setTip('warbar-end') }}
		on:mouseleave={() => { aStore.setTip() }}
	>👑</div>
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
	<div class="step">👑</div>

	<aside class="penalty got top"></aside>
	<aside class="penalty got bot"></aside>

	<aside class="penalty bot-2 {$bot2 ? 'got' : ''}"></aside>
	<aside class="penalty bot-5 {$bot5 ? 'got' : ''}"></aside>
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
	top: calc((100% / 19) * 9);
	transition: transform 0.3s;
	width: 100%;
	z-index: 1;
}

.penalty {
	background: linear-gradient(to bottom, green, rgb(2, 71, 19));
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
	.penalty.top { top: calc((100% / 19) * 7); }
	.penalty.bot { top: calc((100% / 19) * 10); }
	.penalty.bot-2 { top: calc((100% / 19) * 12); }
	.penalty.bot-5 { top: calc((100% / 19) * 15); }

	.penalty.top,
	.penalty.bot {
		height: calc((100% / 19) * 2);
	}

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

	.got {
		background: transparent;
		border: 1px dashed green;
	}

	.got:not(.top-2):not(.bot-2):after,
	.got.bot-5:after { content: '10'; }

	.got.top-2:after,
	.got.bot-2:after { content: '5'; }

	.penalty.got.top:after,
	.penalty.got.bot:after {
		content: '2';
		text-indent: 3px;
	}

	.got:after {
		background: url('/assets/food.png') no-repeat center;
		background-size: 100% auto;
	}

.step {
	border: 1px dashed black;
	display: grid;
	flex: 1;
	place-content: center;
	width: 100%;
}
	.step:nth-of-type(10) { background: rgba(255, 255, 255, 0.2); }

	.step:nth-of-type(1),
	.step:nth-of-type(19) { background: rgba(50, 255, 67, 0.2); }

	.step:nth-child(odd) { background: rgba(0, 0, 0, 0.35); }
</style>