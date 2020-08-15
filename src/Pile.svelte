<script>
	import Card from './Card.svelte';
	
	export let cards = [];
	export let gs = {};

	function sortCards() {
		const c = [...cards];
		
		switch(gs.age) {
			case 1:
				c.unshift(false);
				c.unshift(false);
				c.splice(4, 0, false, false, false);
				c.splice(10, 0, false, false, false);
				c.splice(17, 0, false);
				c.splice(23, 0, false);
				return adjustCards(c);
			default:
				return c;
		}
	}

	function adjustCards(cards) {
		return cards.map((c, i) => {
			if (!c) return c;

			// Add index
			c.index = i;
			// All are available
			c.taken = false;
			// Every other row is flipped
			if (Math.floor(i / 6) % 2 === 1) c.flipped = true;
			// Calculate who is blocked
			if (i < 24) c.blocked = 2;

			return c;
		});
	}

	$: finalCards = sortCards();

	function unblock(card) {
		const isOdd = Math.floor(card.index / 6) % 2; // Checks the row
		const i = card.index - (7 - isOdd);

		if (finalCards[i]) {
			finalCards[i].blocked -= 1;
			if (!finalCards[i].blocked) finalCards[i].flipped = false;
		}

		if (finalCards[i + 1]) {
			finalCards[i + 1].blocked -= 1;
			if (!finalCards[i + 1].blocked) finalCards[i].flipped = false;
		}
	}

	// Age 1 Structure looks like:
	// 0, 0, 1, 1, 0, 0,
	//   0, 1, 1, 1, 0, 0,
	// 0, 1, 1, 1, 1, 0,
	//   1, 1, 1, 1, 1, 0,
	// 1, 1, 1, 1, 1, 1
</script>

<div class="pile">
	{#each finalCards as card}
		{#if !card}
			<div class="card" data-empty></div>
		{/if}
		{#if card}
			<Card card={card} unblock={unblock} />
		{/if}
	{/each}
</div>

<style>
.pile {
	column-gap: 5px;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	transform: translateY(15%);
	width: 80%;
}
</style>