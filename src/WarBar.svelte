<script>
	import { score, top5, top2, bot5, bot2 } from './store/warStore';

	$: markerPos = 9 - $score;
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
	left: 50px;
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