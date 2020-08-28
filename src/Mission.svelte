<script>
	export let mission = {};
	export let taken = null;
	export let chooseMission = null;
	export let smallMode = false;
</script>

<div class="mission {smallMode ? 'small' : ''}" data-taken={taken} on:click={() => { if (!smallMode) chooseMission(mission)}}>
	<aside class="cost">
		{#each mission.cost as cost}
			<div class="pog" data-res={cost}></div>
		{/each}
	</aside>

	<h3>{mission.label}</h3>

	<aside class="actions">
		{#if mission.coin}
			<div class="food">{mission.coin}</div>
		{/if}
		{#if mission.vp}
			<div class="txt">{mission.vp}</div>
		{/if}
		{#if mission.war}
			<img src="/assets/star.png" alt="star" />
			{#if mission.war > 1}<img src="/assets/star.png" alt="star" />{/if}
		{/if}
		{#if mission.playagain}
			<div class="txt">🔁</div>
		{/if}
		{#if mission.destroycoin}
			<div class="txt">💥</div>
		{/if}
		{#if mission.destroyres}
			<div class="txt">☢️</div>
		{/if}
		{#if mission.destroyman}
			<div class="txt">💣</div>
		{/if}
		{#if mission.selecttoken}
			<div class="txt">🙏</div>
		{/if}
		{#if mission.selectdiscard}
			<div class="txt">🃏</div>
		{/if}
		{#if mission.provides}
			<span class="pog" data-res={mission.provides[0]}></span>
			<span class="pog" data-res={mission.provides[1]}></span>
			{#if mission.provides.length === 3}
				<span class="pog" data-res={mission.provides[2]}></span>
			{/if}
		{/if}
	</aside>
</div>

<style>
.mission {
	background: green;
	border-radius: 5px;
	display: flex;
	height: 25vh;
	margin: 5px;
	width: 45%;
}
	.mission[data-taken] {
		filter: grayscale(100%);
		pointer-events: none;
	}

	.mission.small {
		align-items: center;
		background: black;
		display: inline-flex;
		flex: 1;
		height: auto;
		margin: 0 5px;
		max-width: 25%;
		padding: 5px;
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

h3 { flex: 1; text-align: center; }

.cost, .actions {
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;
}
	.mission.small .cost,
	.mission.small .actions {
		flex-direction: row;
	}

	.mission.small:not(:hover) .actions,
	.mission.small:hover .cost {
		display: none;
	}

	.mission.small .actions {
		font-size: 0.7em;
	}

.actions {
	width: 60px;
}
	.actions img {
		width: 40px;
	}

	.actions .pog:nth-of-type(2) { transform: translateY(-25%); }
	.actions .pog:nth-of-type(3) { transform: translateY(-50%); }

.food {
	background: url('/assets/res.png') no-repeat -120px 5px;
	background-size: 160px 80px;
	color: white;
	display: grid;
	font-size: 1.25em;
	font-weight: bold;
	height: 40px;
	place-items: center;
	width: 40px;
}

.txt {
	color: white;
	font-size: 2em;
	font-weight: bold;
}
</style>