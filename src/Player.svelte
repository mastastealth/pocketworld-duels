<script>
	import Mission from './Mission.svelte';
	import { aStore } from './store/alertStore';

	export let className = "";
	export let player = {};
	export let turn = null;

	function prov(c) {
		if (!c.provides) return null;

		return c.provides.includes('wood')
			? 'res'
			: 'man';
	}
</script>


<section class="player {className}" data-myturn={turn ? '' : null}>
	<aside class="score">
		{player.score}
		<span class="ingoo">
			{player.ingoo}
		</span>
	</aside>

	<div class="cards">
		{#each player.cards as card}
			<div 
				class="card-sm" 
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
			<div class="token" data-id={token.id}></div>
		{/each}
	</div>

	<div class="missions">
		{#each player.missions as mission}
			<Mission mission={mission} smallMode={true} />
		{/each}
	</div>

	{#if $aStore.andy}
		<div class="andy" on:click={aStore.killAndy}></div>
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
	.player.you .cards { padding: 5px 20px 10px 0; }
	.player.me .cards { padding: 10px 20px 5px 0; }

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

.andy {
	background: url('assets/andy.png') no-repeat;
	background-size: 100%;
	height: 64px;
	position: absolute;
	top: -35px;
	transition: transform 0.3s;
	right: 0;
	width: 64px;
	z-index: -1;
}
	.andy:before {
		content: '';
		opacity: 0;
		padding: 10px;
		position: absolute;
		top: -25%; right: 110%;
		transition: opacity 0.2s;
		width: 320px;
	}

	.andy:hover { transform: translateY(-15px); }
	.andy:hover:before {
		background: rgba(1, 1, 255, 0.4);
		border-radius: 4px 4px 0 4px;
		content: 'Have you played before? If so, click on my face to kill me and disable help mode.';
		opacity: 1;
	}

	.andy:active {
		filter: hue-rotate(-45deg);
	}
	.andy:active:before {
		content: 'HOW COULD YOU DO THIS TO ME?';
		font-weight: bold;
	}
</style>