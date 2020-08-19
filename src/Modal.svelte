<script>
	import Card from './Card.svelte';
	import { gs } from './store/gameState';

	export let chooseCard = null;
	export let canAfford = () => {};

	let total = 0;

	function calcCost(card) {
		// console.log(cardCost, $gs[$gs.myturn ? 'p1' : 'p2'].food);
		const pfood = $gs[$gs.myturn ? 'p1' : 'p2'].food;
		total = card.cost;

		// For complicated cost forms
		if (card.cost.length) {
			const t = canAfford(card);
			total = t;
			return t <= pfood;
		} else {
			// Normal cost calculation (pure cash)
			if (!card.cost || card.cost <= pfood) return true;
		}

		return false;
	}

	$: affordable = calcCost($gs.selected);
</script>

<div class="modal">
	<h2>What would you like to do?</h2>

	<Card card={$gs.selected} />

	<button 
		disabled={affordable ? null : true}
		on:click={chooseCard($gs.selected)}
	>{!affordable || total > 0 ? `Buy for ${total}` : "Get for Free"}</button>

	<button on:click={chooseCard($gs.selected, true)}>Trade</button>
</div>

<style>
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

</style>