<script>
	import { score, top5, top2, bot5, bot2 } from './store/warStore';
	import { gs } from './store/gameState';

	$: warTotal = $gs.p1.war - $gs.p2.war
	$: markerPos = 9 - warTotal;

	$: {
		// Check for a war win
		if (warTotal === 9 || warTotal === -9) {
			// ...
		}

		if (warTotal === 6 && !$top5) { 
			top5.set(true); // Flag checkpoint
			const p2 = {...$gs.p2}; // Copy player data
			p2.food -= p2.food >= 5 ? 5 : p2.food; // Adjust food
			gs.set({...$gs, p2 }); // Set player data back
		}
		if (warTotal === 3 && !$top2) { 
			top2.set(true);
			const p2 = {...$gs.p2};
			p2.food -= p2.food >= 2 ? 2 : p2.food;
			gs.set({...$gs, p2 });
		}
		if (warTotal === -6 && !$bot5) { 
			bot5.set(true);
			const p1 = {...$gs.p1};
			p1.food -= p1.food >= 5 ? 5 : p1.food;
			gs.set({...$gs, p1 });
		}
		if (warTotal === -3 && !$bot2) { 
			bot2.set(true);
			const p1 = {...$gs.p1};
			p1.food -= p1.food >= 2 ? 2 : p1.food;
			gs.set({...$gs, p1 });
		}
	}
</script>

<aside class="war-bar">
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

	<aside class="penalty bot-2"></aside>
	<aside class="penalty bot-5"></aside>
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
	background: red;
	border-radius: 8px;
	height: calc(100% / 19);
	position: absolute;
	left: 50px;
	top: var(--top);
	transform: scale(0.5);
	width: 50%;
	z-index: 1;
}

.penalty {
	background: darkred;
	border-radius: 5px;
	height: calc((100% / 19) * 3);
	position: absolute;
	left: 25px;
	top: calc(100% / 19);
	transform: scale(0.9);
	width: 50%;
}
	.penalty.top-2 { top: calc((100% / 19) * 4); }
	.penalty.bot-2 { top: calc((100% / 19) * 12); }
	.penalty.bot-5 { top: calc((100% / 19) * 15); }

.step {
	border: 1px dashed black;
	flex: 1;
	width: 100%;
}
	.step:nth-of-type(10) { background: rgba(255, 255, 255, 0.2); }
	.step:nth-of-type(1),
	.step:nth-of-type(19) { background: rgba(255, 50, 50, 0.2); }
</style>