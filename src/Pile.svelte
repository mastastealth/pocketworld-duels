<script>
	import Card from './Card.svelte';
	import Modal from './Modal.svelte';
	import { gs } from './store/gameState';
	import age1 from './json/age1.json';
	import age2 from './json/age2.json';
	import age3 from './json/age3.json';
	import more from './json/more.json';

	let cards = $gs.shuffle(age1).slice(3);
	let showModal = false;

	/**
	 * Sorts an array of cards, depending on age, to a certain layout.
	 * @param {array} cards
	 */
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

	/**
	 * Calculates and sets the flipped and blocked properties of cards
	 * @param {array} cards
	 */
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

	/** Marks a card as selected in the gameState 
	 * @param {Object} card
	*/
	function selectCard(card) {
		gs.set({
			...$gs,
			selected: card
		});
	}

	/** Closes the modal */
	function deselectModal() {
		if (!showModal) gs.set({
			...$gs,
			selected: null
		});
	}

	/** The computed property that sorts the shuffled cards per age */
	$: finalCards = sortCards(cards);

	/**
	 * Fired when a player chooses an action on a card. Readjusts "blocked" state for newly revealed cards. This is passed down into the modal.
	 * @param {Object} card - The card that was chosen
	 * @param {Boolean} sell - Whether the card was chosen to be sold
	 * @param {Boolean} build - Whether the card was chosen to build a wonder
	 */
	function chooseCard({card, sell = false, build = false, adjustedCost = false}) {
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

		adjustScore(card, sell, build, adjustedCost); // Calculate earnings
	}

	function chooseToken(token, i) {
		const tokens = [...$gs.tokens];
		const p = { ...$gs[$gs.myturn ? 'p1' : 'p2'] };
	
		tokens[i].taken = true;
		p.tokens.push(tokens[i]);

		if (token.vp) p.vp += token.vp;
		if (token.coin) p.food += token.coin;
		if (token.sci) p.sci.push(token.sci);

		if (token.mywar) p.wartoken = true;
		if (token.mymoney) p.ecotoken = true;
		if (token.mylinks) p.linktoken = true;
		if (token.mywonders) p.playtoken = true;

		if (token.discount === "civ") p.civtoken = true;
		if (token.discount === "wonder") p.wondertoken = true;

		showModal = null;
		gs.set({ 
			...$gs, 
			tokens,
			[$gs.myturn ? 'p1' : 'p2']: p,
			myturn: !$gs.myturn,
		});
	}

	/**
	 * Calculates whether or not the player can afford the card with their current resources/money.
	 * @param {Object} card
	 */
	function canAfford(card, adj = false) {
		const me = $gs.myturn ? $gs.p1 : $gs.p2;
		const opp = $gs.myturn ? $gs.p2 : $gs.p1;
		const need = {};
		const cost = adj || card.cost;
		let total = 0;

		// Construct cost object
		cost.forEach(res => {
			if (res) {
				if (!need[res]) need[res] = 0;
				need[res] += 1;
			}
		});

		// Check for link, if so, its free
		if (
			card.linkcost 
			&& me.links.find(l => l === card.linkcost)
		) return { total, link: true, need };

		// Tally up coins needed per resource
		for (const res in need) {
			if (res === "coin") {
				total += need[res]; // Coins are simple enough
			} else {
				// Calculate how much a resource costs us
				const totalNeeded = Math.max(0, need[res] - me[res]); // Amount of res - what we have
				// Check for trade card (1 per res) otherwise use default (2 per res + enemy count)
				const perRes = me.trade.find(r => r === res) ? 1 : 2 + opp[res]; 

				total += totalNeeded * perRes;
			}
		}

		// Reduce total if we have any providing eco cards
		let save = 0;

		if ( // If we have the right eco card and can use it
			(me.provision === 1 || me.provision === 3 )
			&& (need.wood || need.stone || need.clay)
		) {
			save += 1; // We will always save at least 1 food

			if ( // If I don't have the trade card for that resource
				(need.wood && !me.trade.includes('wood'))
				|| (need.stone && !me.trade.includes('stone'))
				|| (need.clay && !me.trade.includes('clay'))
			) save += 1;
		
			if ( // And if opponent has one of the resources we need, we can save 1 more food
				need.wood && opp.wood
				|| (need.clay && opp.clay)
				|| (need.stone && opp.stone)
			) save += 1;
		}

		// Now do same check on manufactured resources
		if (me.provision > 1 && (need.paper || need.glass)) {
			if (me.trade.includes('paper')) {
				save += 1; // With the trade cost, we'd only be saving 1 food
			} else {
				save += 2;
				if (
					need.glass && opp.glass
					|| (need.paper && opp.paper)
				) save += 1;
			}
		}

		return { total: total - save, need };
	}

	/**
	 * Fired after the player has chosen a card. Does the tallying for player and states. Sets next age if needed.
	 * @param {Object} card - The card that was chosen
	 * @param {Boolean} sell - Whether the card was chosen to be sold
	 * @param {Boolean} build - Whether the card was chosen to build a wonder
	 */
	function adjustScore(card, sell, build, adjustedCost) {
		// console.log(card);
		let p = { ...$gs[$gs.myturn ? 'p1' : 'p2'] };
		let o = $gs[$gs.myturn ? 'p2' : 'p1'];
		let discarded = [...$gs.discarded];
		let getToken = false;

		// Mark as taken, so it disappears, regardless of action
		finalCards[card.index].taken = true;

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
			if (typeof card.trade !== 'string') p.trade.flat();
			if (card.provides?.includes('wood')) p.provision = !p.provision ? 1 : 3;
			if (card.provides?.includes('paper')) p.provision = !p.provision ? 2 : 3;

			// Building additions
			if (card.type === "res") p.res += 1;
			if (card.type === "man") p.man += 1;
			if (card.type === "civ") p.civ += 1;
			if (card.type === "eco") p.eco += 1;
			if (card.type === "sci") {
				if (p.sci.includes(card.sci)) getToken = true;
				p.sci.push(card.sci);
			}
			if (card.type === "war") {
				p.warprogress += card.war;
				p.war += 1;
			}

			// Special bonus
			if (card.instaby) p.food += card.instaby.type !== 'wonder'
				? p[card.instaby.type] * card.instaby.coin
				: Object.keys(p.missions).length * 2;

			// Guild
			if (card.earn?.coin) {
				const from = card.earn.from;
				if (from === 'sci') { // Science is an array
					p.food += p.sci.length > o.sci.length 
						? p.sci.length 
						: o.sci.length;
				} else if (from !== 'res') {
					p.food += p[from] > o[from] ? p[from] : o[from];
				} else { // Resources uses both grey/brown
					p.food += (p.res + p.man) > (o.res + o.man) 
						? p.res + p.man 
						: o.res + o.man;
				}
			}

			if (!card.cost.length) {
				p.food -= card.cost; // Deduct food, ez mode
			} else {
				// Calculate how much is spent from missing resources
				const { total, link } = canAfford(card, adjustedCost);
				p.food -= total;

				if (o.tokens.find(t => t.mymoney)) o.food += total;
				if (link && o.tokens.find(t => t.mylinks)) p.food += 4;
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
			myturn: getToken ? $gs.myturn : !$gs.myturn,
			cardsleft: $gs.cardsleft - 1,
			selected: null,
			discarded
		});

		tokenCheck(getToken);
	}

	function tokenCheck(getToken) {
		if (getToken) {
			showModal = "token"
		} else {
			// No more cards, next "age"
			if (!$gs.cardsleft) nextAge();
		}
	}

	/** Shuffles a new deck of cards for the next age, or ends the game if finished */
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

		const g = $gs.shuffle(more.guilds);
		const nextdeck = age === 2 
			? age2.slice(3)
			: [...age3.slice(3), ...g.slice(4)];
		cards = [...$gs.shuffle(nextdeck)];
	}

	/** Does all the end game calculation work */
	function endGame() {
		tallyPlayer($gs.p1);
		tallyPlayer($gs.p2);
	}

	/** Calculates the per player numbers */
	function tallyPlayer(p) {
		// Tally up Guild points
		const g = p.cards.forEach(c => {
			if (c.earn) {
				switch(c.earn.for) {
					case "civ":
					case "war":
					case "eco":
						p.vp += p[c.earn.for];
						break;
					case "sci":
						p.vp += p.sci.length;
						break;
					case "res":
						p.vp += p.res + p.man;
						break;
					case "coin":
						p.vp += Math.floor(p.food / 3);
						break;
					case "wonder":
						p.vp += Object.keys(p.missions).length;
						break;
				}
			} 
		});

		// Math token
		if (p.tokens.includes("mathematics")) p.vp += p.tokens.length * 3;

		// Declare winner
	}
</script>

{#if $gs.selected || showModal}
	<div class="overlay" on:click|self={deselectModal}>
		<Modal 
			chooseCard={chooseCard}
			chooseToken={chooseToken}
			canAfford={canAfford} 
			showModal={showModal} 
		/>
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