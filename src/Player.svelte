<script>
	import Mission from './Mission.svelte';
	import { aStore } from './store/alertStore';
	import { gs } from './store/gameState';

	export let className = "";
	export let player = { score: 0 };
	export let turn = null;

	$: war = className === "me" 
		? $gs.p1.warprogress - $gs.p2.warprogress
		: $gs.p2.warprogress - $gs.p1.warprogress;
	
	$: warFood = war > 0 && war < 3
		? 2
		: war > 0 && war < 6
			? 5
			: war > 5
				? 10
				: 0;

	$: score = player.score + warFood;

	function prov(c) {
		if (!c.provides) return null;

		return c.provides.includes('wood')
			? 'res'
			: 'man';
	}
</script>


<section class="player {className}" data-myturn={turn ? '' : null}>
	<aside class="score">
		{score}
		<span class="ingoo">
			{player.ingoo}
		</span>
	</aside>

	<div class="cards">
		{#each player.cards as card}
			<div 
				class="card-sm" 
				data-id={card.id}
				data-type={card.type}
				data-vp={card.vp}
				data-res={card.res}
				data-war={card.war}
				data-trade={card.trade}
				data-provides={prov(card)}
			>
				<span class="emblems">
					{#if card.sci}
						<i class="emblem-sci icon icon-{card.sci}"></i>
					{/if}
					{#if card.rescount}
						<span class="extra">{card.rescount}</span>
					{:else if card.link}
						<span class="extra">
							<i class="icon icon-{card.link}"></i>
						</span>
					{/if}
				</span>
			</div>
		{/each}
	</div>

	<div class="tokens">
		{#each player.tokens as token}
			<div class="token" data-id={token.id} data-desc={token.desc}></div>
		{/each}
	</div>

	<div class="missions">
		{#each player.missions as mission}
			<Mission mission={mission} smallMode={true} />
		{/each}
	</div>

	{#if $aStore.andy}
		<div class="andy" on:click={aStore.killAndy}>
			{#if $aStore.tip}
				<div class="says" data-hastip={!!$aStore.tip}>ℹ️ {$aStore.tip}</div>
			{/if}
		</div>
	{/if}
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
	background: url('/assets/food.png') no-repeat 52px center;
	background-size: 40% auto;
	font-size: 3em;
	font-weight: bold;
	line-height: 75px;
	position: relative;
	text-align: center;
	width: 190px;
}

.ingoo {
	background: url('/assets/res.png') no-repeat -120px 0;
	background-size: 160px 80px;
	display: block;
	font-size: 1rem;
	height: 40px;
	line-height: 36px;
	position: absolute;
	text-align: center;
	top: 30%; left: 5px;
	width: 40px;
}

.cards {
	display: grid;
	grid-auto-flow: column;
	grid-template-rows: 1fr 1fr;
	gap: 1px;
}
	.player.you .cards { padding: 5px 20px 5px 0; }
	.player.me .cards { padding: 5px 20px 5px 0; }

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
			color: white;
			float: right; 
		}

.tokens {
	align-items: center;
	display: flex;
	flex: 1;
	padding: 0 20px;
	--token: 60px;
}
	.token {
		height: 60px;
		width: 60px;
	}
		.player.me .token:hover:after {
			top: auto;
			bottom: 110%;
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

.andy {
	background: url('/assets/andy.png') no-repeat;
	background-size: 100%;
	height: 64px;
	position: absolute;
	top: -35px;
	transition: transform 0.3s;
	left: 115px;
	width: 64px;
	z-index: -1;
}
	.andy .says,
	.andy:before {
		border-radius: 4px 4px 4px 0;
		opacity: 0;
		padding: 10px;
		pointer-events: none;
		position: absolute;
		bottom: 65%; left: 110%;
		transition: opacity 0.2s;
		width: 320px;
	}

	.andy .says {
		background: rgba(0, 0, 0, 0.8);
		width: 400px;
	}

	.andy:before {
		background: rgba(1, 1, 255, 0.6);
		content: 'Have you played before? If so, click on my face to kill me and disable help mode.';
	}

	.andy:hover { transform: translateY(-15px); }

	.andy:hover:before,
	.andy .says[data-hastip="true"] {
		opacity: 1;
	}

	.andy:active {
		filter: hue-rotate(-45deg);
	}
	.andy:active:before {
		content: 'HOW COULD YOU DO THIS TO ME? ';
		font-weight: bold;
	}
</style>