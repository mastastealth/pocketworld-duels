<script>
	export let mission = {};
	export let taken = null;
	export let chooseMission = null;
	export let smallMode = false;
	export let myturn = false;

	import { aStore } from './store/alertStore';
</script>

<div 
	class="mission {smallMode ? 'small' : ''}" 
	data-taken={taken}
	data-built={mission.built}
	data-id={mission.id}
	on:click={() => { if (!smallMode && myturn) chooseMission(mission)}}
>
	<aside 
		class="cost"
		on:mouseenter={() => { aStore.setTip('mission-cost') }}
		on:mouseleave={() => { aStore.setTip() }}
	>
		{#each mission.cost as cost}
			<div class="pog" data-res={cost}></div>
		{/each}
	</aside>

	<h3>{mission.label}</h3>

	<aside class="actions">
		{#if mission.coin}
			<div class="ingoo"
				on:mouseenter={() => { aStore.setTip('mission-ingoo') }}
				on:mouseleave={() => { aStore.setTip() }}
			>{mission.coin}</div>
		{/if}
		{#if mission.vp}
			<div class="txt vp"
				on:mouseenter={() => { aStore.setTip('mission-food') }}
				on:mouseleave={() => { aStore.setTip() }}
			>{mission.vp}</div>
		{/if}
		{#if mission.war}
			<img 
				src="/assets/star.png" 
				alt="star"
				on:mouseenter={() => { aStore.setTip('mission-sugar') }}
				on:mouseleave={() => { aStore.setTip() }}
			/>
			{#if mission.war > 1}<img src="/assets/star.png" alt="star" />{/if}
		{/if}
		{#if mission.playagain}
			<div class="txt"
				on:mouseenter={() => { aStore.setTip('mission-again') }}
				on:mouseleave={() => { aStore.setTip() }}
			>🔁</div>
		{/if}
		{#if mission.destroycoin}
			<div class="txt"
				on:mouseenter={() => { aStore.setTip('mission-descoin') }}
				on:mouseleave={() => { aStore.setTip() }}
			>💥</div>
		{/if}
		{#if mission.destroyres}
			<div class="txt"
				on:mouseenter={() => { aStore.setTip('mission-desres') }}
				on:mouseleave={() => { aStore.setTip() }}
			>☢️</div>
		{/if}
		{#if mission.destroyman}
			<div class="txt"
				on:mouseenter={() => { aStore.setTip('mission-desman') }}
				on:mouseleave={() => { aStore.setTip() }}
			>💣</div>
		{/if}
		{#if mission.selecttoken}
			<div class="txt"
				on:mouseenter={() => { aStore.setTip('mission-token') }}
				on:mouseleave={() => { aStore.setTip() }}
			>🙏</div>
		{/if}
		{#if mission.selectdiscard}
			<div class="txt"
				on:mouseenter={() => { aStore.setTip('mission-discard') }}
				on:mouseleave={() => { aStore.setTip() }}
			>🃏</div>
		{/if}
		{#if mission.provides}
			<span 
				class="pog" 
				data-res={mission.provides[0]}
				on:mouseenter={() => { aStore.setTip('mission-prov') }}
				on:mouseleave={() => { aStore.setTip() }}
			></span>
			<span 
				class="pog" 
				data-res={mission.provides[1]}
				on:mouseenter={() => { aStore.setTip('mission-prov') }}
				on:mouseleave={() => { aStore.setTip() }}
			></span>
			{#if mission.provides.length === 3}
				<span class="pog" data-res={mission.provides[2]}></span>
			{/if}
		{/if}
	</aside>
</div>

<style>
.mission {
	background-repeat: no-repeat;
	background-size: cover;
	border: 1px solid black;
	border-radius: 5px;
	display: flex;
	height: 25vh;
	margin: 5px;
	transition: transform 0.2s;
	user-select: none;
	width: 45%;
}
	.mission:not(.small):hover { transform: scale(1.05); z-index: 10; }

	.mission[data-id="snikaree"] { background-image: url('/assets/missions/snikaree.jpg'); }
	.mission[data-id="levacaloo"] { background-image: url('/assets/missions/levacaloo.jpg'); }
	.mission[data-id="scrapetown"] { background-image: url('/assets/missions/scrapetown.jpg'); }

	.mission[data-id="bonepit"] { background-image: url('/assets/missions/bonepit.jpg'); }
	.mission[data-id="blacksledge"] { background-image: url('/assets/missions/blacksledge.jpg'); }
	.mission[data-id="firebrand"] { background-image: url('/assets/missions/firebrand.jpg'); }

	.mission[data-id="solawa"] { background-image: url('/assets/missions/solawa.jpg'); }
	.mission[data-id="feast"] { background-image: url('/assets/missions/feast.jpg'); }
	.mission[data-id="sagemarro"] { background-image: url('/assets/missions/sagemarro.jpg'); }

	.mission[data-id="coldmark"] { background-image: url('/assets/missions/coldmark.jpg'); }
	.mission[data-id="noe"] { background-image: url('/assets/missions/noe.jpg'); }
	.mission[data-id="mightbe"] { background-image: url('/assets/missions/mightbe.jpg'); }

	.mission[data-taken] {
		filter: grayscale(100%);
		pointer-events: none;
		transform: scale(0.95);
	}

	.mission.small {
		align-items: center;
		display: inline-flex;
		flex: 1;
		height: auto;
		margin: 0 5px;
		max-width: 25%;
		padding: 5px;
	}
		.mission.small[data-built] {
			background: blue;
		}

		.mission.small h3 {
			font-size: 14px;
		}

		.mission.small .pog {
			display: inline-grid;
			height: 24px;
			width: 24px;
		}
			.mission.small .pog:before {
				background: url('/assets/res.png') no-repeat;
				background-size: 80px 40px;
				height: 20px;
				position: absolute;
				top: 2px; left: 2px;
				width: 20px;
			}
				.mission.small .pog[data-res="stone"]:before { background-position: -20px 0; }
				.mission.small .pog[data-res="wood"]:before { background-position: -40px 0; }
				.mission.small .pog[data-res="paper"]:before { background-position: 0 -20px; }
				.mission.small .pog[data-res="glass"]:before { background-position: -20px -20px; }

h3 { 
	color: white;
	flex: 1; 
	text-align: center; 
	text-shadow: 0 0 12px black, 0 0 2px black, 0 0 1px black;
}

.cost, .actions {
	align-items: center;
	background: linear-gradient(to right, rgba(0,0,0, 0.7), transparent);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;
	position: relative;
	transition: transform 0.3s;
}
	.mission.small .cost,
	.mission.small .actions {
		background: none;
		flex-direction: row;
		width: auto;
	}

	.mission.small:not([data-built]):not(:hover) .actions {
		display: none;
	}

	.mission.small:hover .cost,
	.mission.small[data-built] .cost {
		position: absolute;
		transform: translateY(-90%);
	}

	.player.you .mission.small:hover .cost,
	.player.you .mission.small[data-built] .cost {
		position: absolute;
		transform: translateY(90%);
	}

	.mission.small .actions {
		font-size: 0.7em;
	}
		.mission.small .actions > div,
		.mission.small .actions > img {
			margin: 0 2px;
		}

		.mission.small .actions img {
			width: 30px;
		}

		.mission.small .actions .pog:nth-of-type(2) { transform: translateX(-25%); }
		.mission.small .actions .pog:nth-of-type(3) { transform: translateX(-50%); }

.actions {
	background: linear-gradient(to left, rgba(0,0,0, 0.7), transparent);
	width: 60px;
}
	.actions img {
		width: 40px;
	}

	.actions .pog:nth-of-type(2) { transform: translateY(-25%); }
	.actions .pog:nth-of-type(3) { transform: translateY(-50%); }

.ingoo {
	background: url('/assets/res.png') no-repeat -120px 2px;
	background-size: 160px 80px;
	color: white;
	display: grid;
	font-size: 1.25em;
	font-weight: bold;
	height: 40px;
	place-items: center;
	width: 40px;
}
	.mission.small .ingoo {
		background: url('/assets/res.png') no-repeat -90px 0;
		background-size: 120px 60px;
		font-size: 1.1em;
		height: 30px;
		width: 30px;
	}

.txt {
	color: white;
	font-size: 2em;
	font-weight: bold;
}

.vp {
	background: url('/assets/food.png') no-repeat 0 5px;
	background-size: 100% auto;
	font-size: 1.5em;
	min-width: 40px;
	text-align: center;
	text-indent: 4px;
}
	.mission.small .vp {
		background-position: 2px 0px;
		background-size: 85% auto;
	}
</style>