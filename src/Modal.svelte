<script>
	import Card from './Card.svelte';
	import { gs } from './store/gameState';

	export let chooseCard = null;
	export let chooseToken = null;
	export let showModal = false;
	export let canAfford = () => {};
	
	$: affordable = calcCost($gs.selected, adjustedCost);
	$: who = $gs[$gs.myturn ? 'p1' : 'p2'];
	$: resReduce = $gs.selected?.cost.length ? [...new Set($gs.selected.cost)] : [];

	let total = 0;
	let need = null;
	let adjustedCost = [...$gs.selected.cost];

	function calcCost(card, adj) {
		// console.log(cardCost, $gs[$gs.myturn ? 'p1' : 'p2'].food);
		if (!card) return false;
		const pfood = $gs[$gs.myturn ? 'p1' : 'p2'].food;
		total = card.cost;

		// For complicated cost forms
		if (card.cost.length) {
			const { total : t, need : n } = canAfford(card, adj);
			total = t;
			need = n;
			return t <= pfood;
		} else {
			// Normal cost calculation (pure cash)
			if (!card.cost || card.cost <= pfood) return true;
		}

		return false;
	}

	function reduceMe(i, res) {
		if (
			!who.civtoken 
			|| $gs.selected.type !== "civ" 
			|| !$gs.selected.cost.length
			|| adjustedCost.filter(c => c === false).length === 2
		) return false;
		adjustedCost[i] = !adjustedCost[i] ? res : false;
		adjustedCost = [...adjustedCost];
	}
</script>

<div class="modal">
	{#if !showModal}
		<h2>What would you like to do?</h2>

		<section class="purchase">
			<aside class="item">
				<Card card={$gs.selected} />
			</aside>
	
			<aside class="buy">
				<div class="cost">
					<h4>You Need:</h4>
					{#if $gs.selected.cost.length}
						{#each $gs.selected.cost as res, i}
							<span 
								class="pog" 
								data-res={res}
								data-disable={!adjustedCost[i] || null}
								on:click={reduceMe(i, res)}
							></span>
						{/each}
					{:else}
						{$gs.selected.cost} Food
					{/if}
					{#if who.civtoken && $gs.selected.type === "civ" && $gs.selected.cost.length}
						<small><i>You can disable 2 resources.</i></small>
					{/if}
				</div>

				{#if $gs.selected.cost.length}
					<div class="have">
						<h4>You Have:</h4>
						<div class="current">
							{#if $gs.selected.linkcost && who.links.includes($gs.selected.linkcost)}
								{$gs.selected.linkcost}
							{:else}
								{#each resReduce as res}
									{#if who[res] > 0}
										<span 
											class="pog" 
											data-res={res} 
											data-enough={who[res] >= need[res] || null}
										></span>
									{/if}
								{/each}
							{/if}
						</div>
					</div>
				{/if}
			</aside>

			<aside class="options">
				<button 
					disabled={affordable ? null : true}
					on:click={chooseCard({ card: $gs.selected, adjustedCost })}
				>{!affordable || total > 0 ? `Buy for ${total}` : "Get for Free"}</button>

				<button on:click={chooseCard({ card: $gs.selected, sell: true })}>Trade</button>
			</aside>
		</section>
	{:else if showModal === "token"}
		<h2>Choose a token</h2>

		{#each $gs.tokens.slice(0, 5) as token, i}
			<button 
				class="token"
				disabled={token.taken || null}
				data-id={token.id}
				on:click={chooseToken(token, i)}
			></button>
		{/each}
	{/if}
</div>

<style>

h4 { margin: 0 0 10px; }
.modal {
	background: url('/assets/modal_bg.png') no-repeat;
	background-size: 100% 100%;
	color: white;
	height: 340px;
	margin: auto;
	max-height: 95vh;
	max-width: 80vw;
	padding: 35px;
	text-align: center;
	width: 800px;
}

.modal :global(.card) {
	max-height: 150px;
	margin: 0 auto 20px;
	max-width: 200px;
	pointer-events: none;
}

.item {
	align-items: center;
	display: flex;
}

.purchase {
	display: grid;
	grid-template-columns: 2fr 1fr 1fr;
}

	.purchase aside {
		text-align: left;
	}

	.purchase .pog { display: inline-grid; }

.buy div { margin-bottom: 10px; }
.buy small { display: block; }

.buy .pog[data-disable]:after {
	content: "❌";
	font-size: 1.5em;
	position: absolute;
	top: 3px; left: 8px;
	z-index: 2;
}

.current:empty:before { content: "None 😔"; }

.have .pog:after {
	content: "⚠️";
	position: absolute;
	bottom: 0; right: 0;
	z-index: 2;
}
	.have .pog[data-enough]:after { content: "✅"; }

.options button { 
	display: block; 
	margin-bottom: 10px;
}
</style>