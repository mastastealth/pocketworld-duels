<script>
	import Card from './Card.svelte';
	import Modal from './Modal.svelte';
	import { gs, ns } from './store/gameState';
	import { age2, age3, more } from './store/cards';

	export let endGame = null;
	export let cards = null;
	export let mpdata = null;
	export let swapCards = null;
	export let changePlayer = null;
	export let chooseToken = null;
	export let destroyCard = null;

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
		if (
			$gs.showModal
			&& (
				$gs.showModal.includes('token') 
				|| $gs.showModal.includes('select-')
				|| $gs.showModal === 'next'
			)
		) return false;

		if ($gs.showModal === "wonder" || !$gs.showModal) gs.set({
			...$gs,
			selected: null,
			showModal: false
		});
	}

	function setModal(x) {
		gs.set({
			...$gs,
			showModal: x
		});
	}

	/** The computed property that sorts the shuffled cards per age */
	$: finalCards = sortCards(cards);

	$: {
		if (mpdata) {
			if (mpdata.publisher !== $ns.myid) chooseCard({
				...mpdata.message[0],
				choosecard: true
			});
		}
	}

	/**
	 * Fired when a player chooses an action on a card. Readjusts "blocked" state for newly revealed cards. This is passed down into the modal.
	 * @param {Object} card - The card that was chosen
	 * @param {Boolean} sell - Whether the card was chosen to be sold
	 * @param {Boolean} build - Whether the card was chosen to build a wonder
	 * @param {Boolean} wonder - The wonder that is being built
	 */
	function chooseCard({
		card,
		sell = false, 
		build = false, 
		adjustedCost = false, 
		wonder = false,
		pro = false,
		free = false,
		choosecard = null
	}) {
		// Send choice when playing online
		if ($ns.online && !choosecard) $ns.pubnub.publish({
			message: {
				...arguments,
				choosecard: true
			},
			channel: $ns.channel
		});

		if (wonder) deselectModal();

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

		adjustScore({card, sell, build, adjustedCost, wonder, pro, free}); // Calculate earnings
	}

	/**
	 * Calculates whether or not the player can afford the card with their current resources/money.
	 * @param {Object} card
	 */
	function canAfford(card, adj = false, pro = false) {
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

		// Adjust need to special provision cards
		if (pro) {
			pro.provisions.forEach((x, i) => {
				const bonus = x.provides[pro.res[i]];
				if (need[bonus]) need[bonus] -= 1;
			});
		}

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

		return { total, need };
	}

	/**
	 * Fired after the player has chosen a card. Does the tallying for player and states. Sets next age if needed.
	 * @param {Object} card - The card that was chosen
	 * @param {Boolean} sell - Whether the card was chosen to be sold
	 * @param {Boolean} build - Whether the card was chosen to build a wonder
	 */
	function adjustScore({card, sell, build, adjustedCost, wonder, pro, free}) {
		let p = { ...$gs[$gs.myturn ? 'p1' : 'p2'] };
		let o = { ...$gs[$gs.myturn ? 'p2' : 'p1'] };
		let discarded = [...$gs.discarded];
		let getToken = false;
		let playAgain = false;
		let selectCard = false;

		// Mark as taken, so it disappears, regardless of action
		finalCards[card.index].taken = true;

		if (!sell && !build) { // If buying card
			p.cards = [...p.cards, card]; // Save cards into my deck
			if (card.vp) p.score += card.vp; // Add VP
			if (card.instant) p.ingoo += card.instant; // Add Eco monies
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
			if (card.instaby) p.ingoo += card.instaby.type !== 'wonder'
				? p[card.instaby.type] * card.instaby.coin
				: p.missions.filter(m => m.built).length * 2;

			// Guild
			if (card.earn?.coin) {
				const from = card.earn.from;
				if (from === 'sci') { // Science is an array
					p.ingoo += p.sci.length > o.sci.length 
						? p.sci.length 
						: o.sci.length;
				} else if (from !== 'res') {
					p.ingoo += p[from] > o[from] ? p[from] : o[from];
				} else { // Resources uses both grey/brown
					p.ingoo += (p.res + p.man) > (o.res + o.man) 
						? p.res + p.man 
						: o.res + o.man;
				}
			}

			if (!free) {
				if (!card.cost.length) {
					p.ingoo -= card.cost; // Deduct ingoo, ez mode
				} else {
					// Calculate how much is spent from missing resources
					const { total, link } = canAfford(card, adjustedCost, pro);
					p.ingoo -= total;

					if (o.tokens.find(t => t.mymoney)) o.ingoo += total;
					if (link && o.tokens.find(t => t.mylinks)) p.ingoo += 4;
				}
			} else {
				setModal(false);
			}
		} else if (sell) { // If selling card
			p.ingoo += 2 + p.eco;
			discarded = [...$gs.discarded, card];
		} else {
			// Build wonder junk
			p.missions = p.missions.map(w => {
				const m = {...w};
				if (w.id === wonder.id) m.built = true;
				return m;
			});

			// Basic wins
			if (wonder.vp) p.score += wonder.vp;
			if (wonder.coin) p.ingoo += wonder.coin;
			if (wonder.war) p.warprogress += wonder.war;

			// Tricky wins
			if (wonder.playagain) playAgain = true;
			if (wonder.destroycoin) o.ingoo = o.ingoo <= 3 ? 0 : o.ingoo - 3;

			// Calculate how much is spent from missing resources
			const { total } = canAfford(card, adjustedCost, pro);
			p.ingoo -= total;
			if (o.tokens.find(t => t.mymoney)) o.ingoo += total;
			if (wonder.selecttoken) getToken = true;
			if (
				wonder.selectdiscard
				|| wonder.destroyres
				|| wonder.destroyman
			) selectCard = true;
		}

		gs.set({
			...$gs,
			p1: $gs.myturn ? p : o,
			p2: $gs.myturn ? o : p,
			myturn: getToken || ($gs.cardsleft && playAgain) || selectCard ? $gs.myturn : !$gs.myturn,
			cardsleft: $gs.cardsleft - 1,
			selected: null,
			discarded
		});

		// Check for extra wonder/token actions
		if (getToken) setModal("token");
		if (wonder) wonderCheck(wonder);

		// Check for special wins
		const warTotal = $gs.p1.warprogress - $gs.p2.warprogress;
		if (warTotal >= 9 || warTotal <= -9) endGame('war');

		const sciTotal = [...new Set(p.sci)].length;
		if (sciTotal === 6) endGame('sci');

		// Last but not least
		if (!getToken && !wonder && !$gs.cardsleft) nextAge();
	}

	/**
	 * Performs some extra things for certain wonders
	 * @param {Object} The wonder that was bought and is being checked
	 */
	function wonderCheck(wonder) {
		if (wonder.selecttoken) setModal("token-special");
		if (wonder.selectdiscard) setModal("select-discard");
		if (wonder.destroyres) setModal("select-res");
		if (wonder.destroyman) setModal("select-man");
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
			cardsleft: 20,
			showModal: 'next'
		});

		const g = gs.shuffle($more.guilds, process.env.isDev);
		const nextdeck = age === 2 
			? $age2.slice(3)
			: [...$age3.slice(3), ...g.slice(4)];
		swapCards(gs.shuffle(nextdeck, process.env.isDev));
	}
</script>

{#if $gs.selected || $gs.showModal}
	<div class="overlay" on:click|self={deselectModal}>
		<Modal 
			chooseCard={chooseCard}
			chooseToken={chooseToken}
			destroyCard={destroyCard}
			changePlayer={changePlayer}
			canAfford={canAfford} 
			showModal={$gs.showModal} 
			setModal={setModal}
		/>
	</div>
{/if}

<div class="pile" data-myturn={$gs.myturn || null} data-age={$gs.age}>
	{#each finalCards as card, i}
		{#if !card}
			<div class="card" data-empty></div>
		{/if}
		{#if card}
			<Card 
				card={card} 
				selectCard={selectCard} 
				index={i} 
				myturn={($ns.online && $gs.myturn) || !$ns.online}
			/>
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

	.pile:not([data-myturn]) :global(.card) {
		cursor: default !important;
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