<script>
	import Card from './Card.svelte';
	import { gs } from './store/gameState';

	export let chooseCard = null;

	function calcCost(cardCost) {
		// console.log(cardCost, $gs[$gs.myturn ? 'p1' : 'p2'].food);

		// Normal cost calculation (pure cash)
		if (
			!cardCost 
			|| cardCost <= $gs[$gs.myturn ? 'p1' : 'p2'].food
		) return true;

		// For complicated cost forms
		if (cardCost.length) {
			let need = 0;

			// Loop through each resource required
			cardCost.forEach(res => {
				if (res === "coin") {
					need += 1;
				} else {
					need += 2;
					// TODO - Check opponent's count 
				}
			});

			return need <= $gs[$gs.myturn ? 'p1' : 'p2'].food
		}

		return false;
	}

	$: canAfford = calcCost($gs.selected.cost);
</script>

<div class="modal">
	<Card card={$gs.selected} />

	<button 
		disabled={canAfford ? null : true}
		on:click={chooseCard($gs.selected)}
	>Buy</button>

	<button on:click={chooseCard($gs.selected, true)}>Trade</button>
</div>

<style>
.modal {
	background: url('/assets/modal_bg.png') no-repeat;
	height: 470px;
	margin: auto;
	max-height: 95vh;
	max-width: 80vw;
	padding: 35px;
	width: 800px;
}
</style>