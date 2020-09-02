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
	.pog { display: inline-grid; }
</style>