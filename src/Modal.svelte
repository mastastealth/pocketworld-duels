<script>
	import Card from './Card.svelte';
	import Provisions from './Provisions.svelte';
	import { gs } from './store/gameState';

	export let chooseCard = null;
	export let chooseToken = null;
	export let showModal = false;
	export let setModal = () => {};
	export let canAfford = () => {};
	
	let selectedWonder;
	let total = 0;
	let need = null;
	let adjustedCost = $gs.selected?.cost.length ? [...$gs.selected.cost] : false;
	let adjustedWonderCost = false;
	const who = $gs[$gs.myturn ? 'p1' : 'p2'];

	// These are the extra bits to support "provision" type cards/wonders
	const eco = who.cards.filter(c => c.provides);
	const wonders = who.missions.filter(c => c.built && c.provides);
	const provisions = [ ...eco, ...wonders ];

	// Computed for affording junk
	$: affordable = calcCost($gs.selected, adjustedCost, res);
	$: affordableWonder = calcCost(selectedWonder, adjustedWonderCost, res);

	$: resReduce = $gs.selected?.cost.length ? [...new Set($gs.selected.cost)] : [];
	$: wonderResReduce = selectedWonder?.cost.length ? [...new Set(selectedWonder.cost)] : [];

	$: {
		if (!selectedWonder && showModal === "wonder") selectedWonder = who.missions[0];
		adjustedWonderCost = selectedWonder ? [...selectedWonder.cost] : [];
	}
	
	let res = [0, 0, 0, 0];

	/* Cycles through the resource in a provision pog */
	function changeRes(i) {
		// Check if we looped around
		res[i] = res[i] + 1 >= provisions[i].provides.length 
			? 0 
			: res[i] + 1;
		// Set it
		res = [...res];
	}

	function calcCost(card, adj, res) {
		if (!card) return false;
		const pfood = $gs[$gs.myturn ? 'p1' : 'p2'].food;
		total = card.cost;

		// For complicated cost forms
		if (card.cost.length) {
			const pro = provisions ? { provisions, res } : false;
			const { total : t, need : n } = canAfford(card, adj, pro);
			total = t;
			need = n;
			return t <= pfood;
		} else {
			// Normal cost calculation (pure cash)
			if (!card.cost || card.cost <= pfood) return true;
		}

		return false;
	}

	/**
	 * Modifies the adjustedCost array to enable/disable a max of 2 resources
	 */
	function reduceMe(i, res) {
		if (
			!who.civtoken 
			|| $gs.selected.type !== "civ" 
			|| !$gs.selected.cost.length
			|| adjustedCost.filter(c => c === false).length === 2
		) return false;
		// If we have the proper token, card, and counts, you are free to adjust
		adjustedCost[i] = !adjustedCost[i] ? res : false;
		adjustedCost = [...adjustedCost];
	}

	function reduceWonder(i, res) {
		if (!who.wondertoken) return false;
	
		const cost = adjustedWonderCost;
		if (cost[i] === false) {
			adjustedWonderCost[i] = selectedWonder.cost[i];
		} else if (cost.filter(c => c === false).length < 2) {
			adjustedWonderCost[i] = false;
		}
	
		adjustedWonderCost = [...adjustedWonderCost];
	}

	function buildWonder() {
		setModal("wonder");
	}

	function selectWonder(m) {
		selectedWonder = m;
	}
</script>

<div class="modal" data-modal="{showModal || null}">
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
								<Provisions provisions={provisions} res={res} changeRes={changeRes} />
							{/if}
						</div>
					</div>
				{/if}
			</aside>

			<aside class="options">
				<button 
					disabled={affordable ? null : true}
					on:click={chooseCard({ card: $gs.selected, adjustedCost, pro: { provisions, res } })}
				>{!affordable || total > 0 ? `Buy for ${total}` : "Get for Free"}</button>

				<button on:click={chooseCard({ card: $gs.selected, sell: true })}>Trade</button>

				<button on:click={buildWonder}>Complete Mission</button>
			</aside>
		</section>
	{:else if showModal === "token"}
		<h2>Choose a token:</h2>

		{#each $gs.tokens.slice(0, 5) as token, i}
			<button 
				class="token"
				disabled={token.taken || null}
				data-id={token.id}
				on:click={chooseToken(token, i)}
			></button>
		{/each}
	{:else if showModal === "wonder"}
		<h2>Choose a mission to complete:</h2>
		<section class="purchase">
			<aside class="item">
				{#each who.missions as mission}
					<button on:click={() => { selectWonder(mission) }}>{mission.label}</button>
				{/each}
			</aside>
	
			<aside class="buy">
				<div class="cost">
					<h4>You Need:</h4>
					{#each adjustedWonderCost as res, i}
						<span 
							class="pog" 
							data-res={res}
							data-disable={!adjustedWonderCost[i] || null}
							on:click={reduceWonder(i, res)}
						></span>
					{/each}
					{#if who.wondertoken}
						<small><i>You can disable 2 resources.</i></small>
					{/if}
				</div>

				<div class="have">
					<h4>You Have:</h4>
					<div class="current">
						{#each wonderResReduce as res}
							{#if who[res] > 0}
								<span 
									class="pog" 
									data-res={res} 
									data-enough={who[res] >= need[res] || null}
								></span>
							{/if}
						{/each}
						<Provisions provisions={provisions} res={res} changeRes={changeRes} />
					</div>
				</div>
			</aside>

			<aside class="options">
				<button 
					disabled={affordableWonder ? null : true}
					on:click={chooseCard({ 
						card: $gs.selected, 
						build: true,
						wonder: selectedWonder, 
						adjustedCost: adjustedWonderCost,
						pro: { provisions, res }
					})}
				>{!affordable || total > 0 ? `Buy for ${total}` : "Get for Free"}</button>
			</aside>
		</section>
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
	display: flex;
	flex-wrap: wrap;
}
	.item button { width: 50%; }

.purchase {
	column-gap: 10px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}
	[data-modal="wonder"] .purchase { 
		grid-template-columns: 2fr 1fr 100px;
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
	pointer-events: none;
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