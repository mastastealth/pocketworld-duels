<script>
	export let className = "";
	export let player = {};
	export let ws = 0;

	$: realScore = player.primary ?
		player.score + ws
		: player.score - ws;
</script>


<section class="player {className}">
	<aside class="score">
		{realScore}
	</aside>

	<div class="cards">
		{#each player.cards as card}
			<div 
				class="card" 
				data-type={card.type}
				data-vp={card.vp}
				data-res={card.res}
			></div>
		{/each}
	</div>

	<div class="tokens">
		{#each player.tokens as token}
			<div class="token"></div>
		{/each}
	</div>

	<div class="missions">
	
	</div>
</section>

<style>
.me { grid-area: p1; }
.you { grid-area: p2; }

.player {
	color: white;
	display: flex;
	height: 100%;
	padding: 0 10px;
	position: relative;
	width: 100%;
	z-index: 1;
}
	.player:after {
		background: url('/assets/player_panel.png') no-repeat center top;
		background-size: 100% auto;
		content: '';
		display: block;
		position: absolute;
		height: 100%;
		top: 0; left: 0;
		width: 100%;
		z-index: -1;
	}

	.player.me { padding-top: 20px; }
		.player.me .missions { top: auto; bottom: 100%; }
	.player.you { padding-bottom: 20px; }
		.player.you:after { transform: rotateX(180deg); }

.score {
	font-size: 4em;
	font-weight: bold;
	line-height: 75px;
	text-align: center;
	width: 190px;
}

.cards {
	display: grid;
	grid-auto-flow: column;
	grid-template-rows: 1fr 1fr;
	gap: 1px;
}
	.player.you .cards { padding: 5px 20px 15px 0; }
	.player.me .cards { padding: 15px 20px 5px 0; }
.card {
	border: 1px solid black;
	border-radius: 3px;
	position: relative;
	text-align: center;
	width: 32px;
}
	.card:after { font-weight: bold; }
	.card[data-type="war"] { background: var(--war); }
	.card[data-type="sci"] { background: var(--sci); }
	.card[data-type="civ"] { background: var(--civ); }
	.card[data-type="eco"] { background: var(--eco); }
	.card[data-type="res"] { background: var(--res); }
		.card[data-type="res"]:before,
		.card[data-type="res"]:after { 
			background: url('/assets/pog.png');
			background-size: 100% auto;
			content: '';
			display: inline-block;
			height: 24px;
			width: 24px;
			vertical-align: middle;
		}

		.card[data-type="res"]:before {
			background: url('/assets/res.png') no-repeat;
			background-size: 80px 20px;
			height: 20px;
			position: absolute;
			top: 4px; left: 6px;
			width: 20px;
		}
			.card[data-res="stone"]:before { background-position: -20px 0; }
			.card[data-res="wood"]:before { background-position: -40px 0; }

	.card[data-type="man"] { background: var(--man); }
	.card[data-type="guild"] { background: var(--guild); }

	.card[data-type="civ"]:after,
	.card[data-type="sci"]:after { content: attr(data-vp); }

.tokens {
	align-items: center;
	display: flex;
	flex: 1;
	padding: 0 20px;
}
	.token {
		background: green;
		border-radius: 100%;
		height: 60px;
		width: 60px;
	}

.missions {
	height: 48px;
	position: absolute;
	top: 100%;
	right: 0;
	width: calc(100% - 200px);
}

</style>