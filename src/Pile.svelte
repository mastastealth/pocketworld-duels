<script>
	import Card from './Card.svelte';
	import Modal from './Modal.svelte';
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

	function chooseCard(card, sell = false, build = false) {
		const isOdd = Math.floor(card.index / 6) % 2; // Checks the row
		const i = card.index - (7 - isOdd);

		if (finalCards[i]) {
			finalCards[i].blocked -= 1;
			if (!finalCards[i].blocked) finalCards[i].flipped = false;
		}

		if (finalCards[i + 1]) {
			finalCards[i + 1].blocked -= 1;
			if (!finalCards[i + 1].blocked) finalCards[i + 1].flipped = false;
		}

		adjustScore(card, sell, build); // Calculate earnings
	}

	function canAfford(card) {
		const me = $gs.myturn ? $gs.p1 : $gs.p2;
		const need = {};
		let total = 0;

		// Check for link, if so, its free
		if (
			card.linkcost 
			&& me.links.find(l => l === card.linkcost)
		) return total;

		// Construct cost object
		card.cost.forEach(res => {
			if (!need[res]) need[res] = 0;
			need[res] += 1;
		});

		// Tally up coins needed per resource
		for (const res in need) {
			if (res === "coin") {
				total += need[res]; // Coins are simple enough
			} else {
				// Calculate how much a resource costs us
				const opp = $gs.myturn ? $gs.p2 : $gs.p1;
				const totalNeeded = Math.max(0, need[res] - me[res]); // Amount of res - what we have
				// Check for trade card (1 per res) otherwise use default (2 per res + enemy count)
				const perRes = me.trade.find(r => r === res) ? 1 : 2 + opp[res]; 

				total += totalNeeded * perRes;
			}
		}

		return total;
	}

	function adjustScore(card, sell, build) {
		console.log(card);
		let p = { ...$gs[$gs.myturn ? 'p1' : 'p2'] };
		let discarded = [...$gs.discarded];

		// Mark as taken, so it disappears, regardless of action
		finalCards[card.index].taken = true;

		// Doesn't sort??
		// p1Cards.sort((a, b) => {
		// 	return a.type - b.type;
		// });

		if (!sell && !build) { // If buying card
			p.cards = [...p.cards, card]; // Save cards into my deck
			if (card.vp) p.score += card.vp; // Add VP
			if (card.instant) p.food += card.instant; // Add Eco monies
			if (card.link) p.links.push(card.link); // Tally the links we have

			// Resource addition
			const rescount = card.rescount || 1;
			if (card.res === "stone") p.stone += 1 * rescount;
			if (card.res === "wood") p.wood += 1 * rescount;
			if (card.res === "clay") p.clay += 1 * rescount;
			if (card.res === "glass") p.glass += 1 * rescount;
			if (card.res === "paper") p.paper += 1 * rescount;
			if (card.trade) p.trade.push(card.trade);

			// Building additions
			if (card.type === "civ") p.civ += 1;
			if (card.type === "eco") p.eco += 1;
			if (card.type === "sci") p.sci += 1;
			if (card.type === "war") p.war += 1;

			if (!card.cost.length) {
				p.food -= card.cost; // Deduct food, ez mode
			} else {
				// Calculate how much is spent from missing resources
				const total = canAfford(card);
				p.food -= total;
			}
		} else if (sell) { // If selling card
			p.food += 2 + p.eco;
			discarded = [...$gs.discarded, card];
		} else {
			// Build wonder junk
		}

		gs.set({
			...$gs,
			p1: $gs.myturn ? p : $gs.p1,
			p2: $gs.myturn ? $gs.p2 : p,
			myturn: !$gs.myturn,
			cardsleft: $gs.cardsleft - 1,
			selected: null,
			discarded
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

	function selectCard(card) {
		gs.set({
			...$gs,
			selected: card
		});
	}

	function deselectModal() {
		gs.set({
			...$gs,
			selected: null
		});
	}
</script>

{#if $gs.selected}
	<div class="overlay" on:click|self={deselectModal}>
		<Modal chooseCard={chooseCard} canAfford={canAfford} />
	</div>
{/if}

<div class="pile" data-myturn={$gs.myturn} data-age={$gs.age}>
	{#each finalCards as card}
		{#if !card}
			<div class="card" data-empty></div>
		{/if}
		{#if card}
			<Card card={card} selectCard={selectCard} />
		{/if}
	{/each}
</div>

<style>
.pile {
	column-gap: 5px;
	display: grid;
	justify-items: center;
	grid-template-columns: repeat(6, 1fr);
	transform: translateY(15%);
	width: 100%;
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

.overlay {
	background: rgba(0, 0, 0, 0.5);
	display: grid;
	height: 100vh;
	position: fixed;
	top: 0; left: 0;
	width: 100vw;
	z-index: 99;
}
</style>