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
			<div class="card"></div>
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
	background: tan;
	display: flex;
	height: 100%;
	padding: 10px;
	position: relative;
	width: 100%;
}
	.player.me .missions { top: auto; bottom: 100%; }

.score {
	font-size: 4em;
	font-weight: bold;
	line-height: 80px;
	text-align: center;
	width: 190px;
}

.cards {
	display: grid;
	grid-auto-flow: column;
	grid-template-rows: 1fr 1fr 1fr;
	gap: 1px;
	padding-right: 20px;
}
	.cards div {
		background: green;
		border: 1px solid black;
		width: 32px;
	}

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