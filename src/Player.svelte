<script>
	export let className = "";
	export let player = {};
	export let ws = 0;
	export let turn = null;

	$: realScore = player.primary ?
		player.score + ws
		: player.score - ws;

	function prov(c) {
		if (!c.provides) return null;

		return c.provides.includes('wood')
			? 'res'
			: 'man';
	}
</script>


<section class="player {className}" data-myturn={turn ? '' : null}>
	<aside class="score">
		{realScore}
		<span class="food">
			{player.food}
		</span>
	</aside>

	<div class="cards">
		{#each player.cards as card}
			<div 
				class="card" 
				data-type={card.type}
				data-vp={card.vp}
				data-res={card.res}
				data-war={card.war}
				data-trade={card.trade}
				data-provides={prov(card)}
			>
				<span class="emblems">
					{#if card.sci}
						<span>{card.sci?.[0]}</span>
					{/if}
					{#if card.rescount}
						<span class="extra">{card.rescount}</span>
					{:else if card.link}
						<span class="extra">{card.link[0]}</span>
					{/if}
				</span>
			</div>
		{/each}
	</div>

	<div class="tokens">
		{#each player.tokens as token}
			<div class="token" data-id={token.id}></div>
		{/each}
	</div>

	<div class="missions">
		<!-- <span>Wood: {player.wood}</span>
		<span>Bones: {player.clay}</span>
		<span>Stone: {player.stone}</span>
		<span>Orn: {player.paper}</span>
		<span>Ammo: {player.glass}</span>
		<span>Eco: {player.eco}</span>
		<span>Civ: {player.civ}</span>
		<span>Sci: {player.sci.length}</span> -->
		{#each player.missions as mission}
			<div class="mission">
				<div class="cost">
					{#each mission.cost as cost}
						<div class="pog" data-res={cost}></div>
					{/each}
				</div>
			</div>
		{/each}
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
	transition: filter 0.2s;
	user-select: none;
	width: 100%;
	z-index: 1;
}
	.player:after {
		background: url('/assets/player_panel.png') no-repeat center top;
		background-size: 100% 100%;
		content: '';
		display: block;
		position: absolute;
		height: 100%;
		top: 0; left: 0;
		width: 100%;
		z-index: -1;
	}

	.player.me { padding-top: 20px; }
		.player.me .missions { top: auto; bottom: 88%; }
		.player.me .mission { border-radius: 5px 5px 0 0; }
	.player.you { padding-bottom: 20px; }
		.player.you .mission { border-radius: 0 0 5px 5px; }
		.player.you:after { transform: rotateX(180deg); }

	.player:not([data-myturn]):not(:hover) {
		filter: brightness(50%) saturate(0.5);
		transition-delay: 1s;
	}

.score {
	font-size: 4em;
	font-weight: bold;
	line-height: 75px;
	position: relative;
	text-align: center;
	width: 190px;
}

.food {
	background: url('/assets/res.png') no-repeat -120px 0;
	background-size: 160px 80px;
	display: block;
	font-size: 1rem;
	height: 40px;
	line-height: 36px;
	position: absolute;
	text-align: center;
	text-indent: 5px;
	top: 30%; left: 5px;
	width: 40px;
}

.cards {
	display: grid;
	grid-auto-flow: column;
	grid-template-rows: 1fr 1fr;
	gap: 1px;
}
	.player.you .cards { padding: 5px 20px 10px 0; }
	.player.me .cards { padding: 10px 20px 5px 0; }

.card {
	border: 1px solid black;
	border-radius: 3px;
	display: grid;
	line-height: calc(59px / 2);
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
		.card[data-res]:before,
		.card[data-res]:after,
		.card[data-trade]:before,
		.card[data-trade]:after,
		.card[data-provides]:after { 
			background: url('/assets/pog.png');
			background-size: 100% auto;
			content: '';
			display: inline-block;
			height: 24px;
			margin: auto;
			width: 24px;
		}

		.card[data-res]:before,
		.card[data-trade]:before,
		.mission .pog:before {
			background: url('/assets/res.png') no-repeat;
			background-size: 80px 40px;
			height: 20px;
			position: absolute;
			top: 5px; left: 5px;
			width: 20px;
		}
			.card[data-res="stone"]:before,
			.card[data-trade="stone"]:before,
			.mission .pog[data-res="stone"]:before { background-position: -20px 0; }
			.card[data-res="wood"]:before,
			.card[data-trade="wood"]:before,
			.mission .pog[data-res="wood"]:before { background-position: -40px 0; }
			.card[data-res="paper"]:before,
			.card[data-trade="paper"]:before,
			.mission .pog[data-res="paper"]:before { background-position: 0 -20px; }
			.card[data-res="glass"]:before,
			.card[data-trade="glass"]:before,
			.mission .pog[data-res="glass"]:before { background-position: -20px -20px; }

	.card[data-type="man"] { background: var(--man); }
	.card[data-type="guild"] { background: var(--guild); }

	.card[data-type="civ"]:after,
	.card[data-type="sci"]:after { 
		content: attr(data-vp);
	}

	.card[data-war]:after { content: attr(data-war); }
	.card[data-provides="res"]:after { filter: sepia(1); }

.emblems {
	font-size: 10px;
	font-weight: bold;
	position: absolute;
	top: -1px; right: 0;
	text-transform: uppercase;
	width: 100%;
}
	.emblems span {
		border-radius: 3px;
		float: left;
		line-height: 14px;
		padding: 0 3px;
	}
		.emblems span.extra { 
			background: rgba(0, 0, 0, 0.5);
			float: right; 
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
	display: flex;
	height: 48px;
	position: absolute;
	top: 88%;
	right: 0;
	width: calc(100% - 200px);
	z-index: -1;
}

.mission {
	align-items: center;
	background: black;
	display: inline-flex;
	flex: 1;
	margin: 0 5px;
	max-width: 25%;
	padding: 5px;
}
	.mission .pog {
		display: inline-grid;
		height: 24px;
		width: 24px;
	}
		.mission .pog:before {
			top: 2px; left: 2px;
		}

</style>