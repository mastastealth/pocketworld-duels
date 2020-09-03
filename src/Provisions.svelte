<script>
	export let provisions = [];
	export let changeRes = null;
	export let res = [];
</script>

{#each provisions as p, i}
	<span 
		class="pog" 
		data-res={p.provides[res[i]]}
		data-type={p.type ? 'card' : 'wonder'}
		on:click={() => { changeRes(i) }}
	></span>
{/each}

<style>
.pog { 
	background-position: center;
	background-size: 90%;
	border: 1px solid black;
	border-radius: 3px;
	cursor: pointer;
	display: inline-grid; 
}
	.pog[data-type="card"] {
		background-color: var(--eco);
	}

	.pog[data-type="wonder"] {
		background-color: #e4501a;
	}
</style>