<script>
	import Card from './Card.svelte';
	import { gs } from './store/gameState';
	import age1 from './json/age1.json';
	import age2 from './json/age2.json';
	import age3 from './json/age2.json';
	import guilds from './json/guilds.json';

	let cards = $gs.shuffle(age1).slice(3);

	function sortCards(cards) {
		const c = [...cards];
		
		switch($gs.age) {
			case 1:
				c.unshift(false);
				c.unshift(false);
				c.splice(4, 0, false, false, false);
				c.splice(10, 0, false, false, false);
				c.splice(17, 0, false);
				c.splice(23, 0, false);
				return adjustCards(c);
				// Age 1 Structure looks like:
				// 0, 0, 1, 1, 0, 0,
				//   0, 1, 1, 1, 0, 0,
				// 0, 1, 1, 1, 1, 0,
				//   1, 1, 1, 1, 1, 0,
				// 1, 1, 1, 1, 1, 1
			case 2:
				c.splice(11, 0, false, false);
				c.splice(17, 0, false, false);
				c.splice(22, 0, false, false, false, false);
				c.push(false);
				c.push(false);
				return adjustCards(c);
				// Age 2 Structure looks like:
				// 1, 1, 1, 1, 1, 1
				//   1, 1, 1, 1, 1, 0,
				// 0, 1, 1, 1, 1, 0,
				//   0, 1, 1, 1, 0, 0,
				// 0, 0, 1, 1, 0, 0,
			case 3:
				c.unshift(false);
				c.unshift(false);
				c.splice(4, 0, false, false, false);
				c.splice(10, 0, false, false, false);
				c.splice(17, 0, false, false);
				c.splice(20, 0, false);
				c.splice(22, 0, false, false, false);
				c.splice(29, 0, false, false);
				c.splice(34, 0, false, false, false, false);
				c.push(false);
				c.push(false);
				return adjustCards(c);
				// Age 3 Structure looks like:
				// 0, 0, 1, 1, 0, 0,
				//   0, 1, 1, 1, 0, 0,
				// 0, 1, 1, 1, 1, 0,
				//   0, 1, 0, 1, 0, 0
				// 0, 1, 1, 1, 1, 0,
				//   0, 1, 1, 1, 0, 0,
				// 0, 0, 1, 1, 0, 0,
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
			if (i < 24 && $gs.age < 3) { // Ignore last row
				// Age 1 default, everything is blocked by 2
				c.blocked = 2;
				// Edge cards only blocked by one, in Age 2
				if ($gs.age === 2) {
					if (
						!cards[i - 1] 
						|| !cards[i + 1] 
						|| i === 5 
						|| i === 6
					) c.blocked = 1;
				}
			}

			// Age 3
			if ($gs.age === 3 && i < 37) {
				c.blocked = 2;

				if (
					(i > 12 && i < 17) // Row 3
					|| i === 25 || i === 28 // Row 5
					|| i === 31 || i === 33 // Row 6
				) c.blocked = 1;
			}

			return c;
		});
	}

	$: finalCards = sortCards(cards);

	function unblock(card) {
		const isOdd = Math.floor(card.index / 6) % 2; // Checks the row
		const i = card.index - (7 - isOdd);

		console.log(i, i+1)
		if (finalCards[i]) {
			finalCards[i].blocked -= 1;
			if (!finalCards[i].blocked) finalCards[i].flipped = false;
		}

		if (finalCards[i + 1]) {
			finalCards[i + 1].blocked -= 1;
			if (!finalCards[i + 1].blocked) finalCards[i + 1].flipped = false;
		}

		adjustScore(card); // Calculate earnings
	}

	function adjustScore(card) {
		let p = { ...$gs[$gs.myturn ? 'p1' : 'p2'] };
		let pCards = [...p.cards, card];

		// Doesn't sort??
		// p1Cards.sort((a, b) => {
		// 	return a.type - b.type;
		// });

		p.cards = pCards;
		if (card.vp) p.score += card.vp;

		gs.set({
			...$gs,
			p1: $gs.myturn ? p : $gs.p1,
			p2: $gs.myturn ? $gs.p2 : p,
			myturn: !$gs.myturn,
			cardsleft: $gs.cardsleft - 1
		});

		// No more cards, next "age"
		if (!$gs.cardsleft) nextAge();
	}

	function nextAge() {
		const age = $gs.age + 1;

		if (age === 4) {
			endGame();
			return false;
		}

		gs.set({
			...$gs,
			age,
			cardsleft: 20
		});

		const agedeck = age === 2 ? age2 : age3;
		const g = $gs.shuffle(guilds);
		const nextdeck = age === 2 
			? age2.slice(3)
			: [...age3.slice(6), ...g.slice(4)];
		cards = [...$gs.shuffle(nextdeck)];
	}
</script>

<div class="pile" data-myturn={$gs.myturn} data-age={$gs.age}>
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
	width: 100vh;
}

	.pile[data-age="1"] :global(.card[data-hidden]) {
		background-color: rgb(230, 79, 9);
		background-blend-mode: hard-light;
	}

	.pile[data-age="2"] :global(.card[data-hidden]) {
		background-color: rgb(27, 105, 230);
		background-blend-mode: hard-light;
	}

	.pile[data-age="3"] :global(.card[data-hidden]) {
		background-color: rgb(29, 149, 59);
		background-blend-mode: hard-light;
	}
</style>