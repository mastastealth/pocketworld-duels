<script>
	import Card from './Card.svelte';
	import { gs } from './store/gameState';

	export let chooseCard = null;
	export let canAfford = () => {};

	let total = 0;

	function calcCost(cardCost) {
		// console.log(cardCost, $gs[$gs.myturn ? 'p1' : 'p2'].food);

		// For complicated cost forms
		if (cardCost.length) {
			const t = canAfford(cardCost);
			total = t;
			return t <= $gs[$gs.myturn ? 'p1' : 'p2'].food
		} else {
			// Normal cost calculation (pure cash)
			if (
				!cardCost 
				|| cardCost <= $gs[$gs.myturn ? 'p1' : 'p2'].food
			) {
				total = cardCost;
			}
		}

		return true;
	}

	$: affordable = calcCost($gs.selected.cost);
</script>

<div class="modal">
	<h2>What would you like to do?</h2>

	<Card card={$gs.selected} />

	<button 
		disabled={affordable ? null : true}
		on:click={chooseCard($gs.selected)}
	>{total <= 0 ? "Get for Free" : `Buy for ${total}`}</button>

	<button on:click={chooseCard($gs.selected, true)}>Trade</button>
</div>

<style>
.modal {
	background: url('/assets/modal_bg.png') no-repeat;
	background-size: 100% 100%;
	color: white;
	height: 320px;
	margin: auto;
	max-height: 95vh;
	max-width: 80vw;
	padding: 35px;
	text-align: center;
	width: 800px;
}

.modal :global(.card) { margin: 0 auto 20px; }

</style>