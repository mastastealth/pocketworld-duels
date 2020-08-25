<script>
	export let mission = {};
	export let taken = null;
	export let chooseMission = null;
</script>

<div class="mission" data-taken={taken} on:click={() => chooseMission(mission)}>
	<aside class="cost">
		{#each mission.cost as cost}
			<div class="pog" data-res={cost}></div>
		{/each}
	</aside>

	<h3>{mission.label}</h3>

	<aside class="actions">

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

h3 { flex: 1; text-align: center; }

.cost {
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 5px;
}

.actions {
	width: 60px;
}
</style>