<script>
	import Card from './Card.svelte';
	import Mission from './Mission.svelte';
	import Provisions from './Provisions.svelte';
	import { gs, ns } from './store/gameState';

	export let chooseCard = null;
	export let chooseToken = null;
	export let changePlayer = null;
	export let showModal = false;
	export let setModal = () => {};
	export let canAfford = () => {};
	export let destroyCard = () => {};
	export let deselectModal = () => {};
	
	let selectedWonder;
	let total = 0;
	let need = null;
	let adjustedCost = $gs.selected?.cost.length ? [...$gs.selected.cost] : false;
	let adjustedWonderCost = false;
	let canChooseAge = true;
	const who = $gs[$gs.myturn ? 'p1' : 'p2'];
	const notwho = $gs[$gs.myturn ? 'p2' : 'p1'];

	// These are the extra bits to support "provision" type cards/wonders
	const eco = who.cards.filter(c => c.provides);
	const wonders = who.missions.filter(c => c.built && c.provides);
	const provisions = [ ...eco, ...wonders ];

	$: {
		let wTotal = $gs.p1.warprogress - $gs.p2.warprogress;
		canChooseAge = !$ns.online 
		|| ($ns.online && (wTotal < 0 || (wTotal === 0 && $gs.myturn)));
	}

	$: canClick = !$ns.online || ($ns.online && $gs.myturn);

	// Computed for affording junk
	$: affordable = calcCost($gs.selected, adjustedCost, res);
	$: affordableWonder = calcCost(selectedWonder, adjustedWonderCost, res);

	$: resReduce = $gs.selected?.cost.length ? [...new Set($gs.selected.cost)] : [];
	$: wonderResReduce = selectedWonder?.cost.length ? [...new Set(selectedWonder.cost)] : [];

	$: {
		if (!selectedWonder && showModal === "wonder") 
			selectedWonder = who.missions.filter(m => !m.built)[0];
		adjustedWonderCost = selectedWonder ? [...selectedWonder.cost] : [];
	}

	$: enoughWonders = [
		...who.missions,
		notwho.missions
	].filter(m => m.built).length >= 6;
	
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
		const pingoo = $gs[$gs.myturn ? 'p1' : 'p2'].ingoo;
		total = card.cost;

		// For complicated cost forms
		if (card.cost.length) {
			const pro = provisions ? { provisions, res } : false;
			const { total : t, need : n } = canAfford(card, adj, pro);
			total = t;
			need = n;
			return t <= pingoo;
		} else {
			// Normal cost calculation (pure cash)
			if (!card.cost || card.cost <= pingoo) return true;
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

	function prov(c) {
		if (!c.provides) return null;

		return c.provides.includes('wood')
			? 'res'
			: 'man';
	}
</script>

<div 
	class="modal" 
	data-modal="{showModal || null}"
>
	<span class="close" on:click|self={deselectModal}>×</span>
	{#if !showModal}
		<h2>What would you like to do?</h2>

		<section class="purchase" data-buy={!!$gs.selected.cost.length}>
			<aside class="item">
				<Card card={$gs.selected} />
			</aside>
	
			<aside class="buy">
				{#if $gs.selected.cost.length}
					<div class="cost">
						<h4>You Need:</h4>

						{#each $gs.selected.cost as res, i}
							<span 
								class="pog" 
								data-res={res}
								data-disable={!adjustedCost[i] || null}
								on:click={reduceMe(i, res)}
							></span>
						{/each}

						{#if who.civtoken && $gs.selected.type === "civ" && $gs.selected.cost.length}
							<small><i>You can disable 2 resources.</i></small>
						{/if}
					</div>
				{/if}

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

								{#if provisions.length}
									<Provisions provisions={provisions} res={res} changeRes={changeRes} />
								{/if}

								{#if !provisions.length}<span class="empty-txt">None 😔</span>{/if}
							{/if}
						</div>
					</div>
				{/if}
			</aside>

			<aside class="options">
				<button
					class="btn-board"
					data-free={affordable && !total}
					disabled={affordable ? null : true}
					on:click={chooseCard({ card: $gs.selected, adjustedCost, pro: { provisions, res } })}
				>
					{#if !affordable || total > 0}
						Buy for {total} <span class="ingoo"></span>
					{:else}
						Get for Free
					{/if}
				</button>

				<button 
					class="btn-board"
					data-trade
					on:click={chooseCard({ card: $gs.selected, sell: true })}
				>Discard for 2 <span class="ingoo"></span></button>

				<button
					class="btn-board"
					data-mission
					disabled={enoughWonders}
					on:click={buildWonder}
				>Complete Mission...</button>
			</aside>
		</section>
	{:else if showModal.includes("token")}
		{#if canClick}
			<h2>Choose a token:</h2>
		{:else}
			<h2>Opponent is choosing a token...</h2>
		{/if}

		{#if showModal === "token"}
			{#each $gs.tokens.slice(0, 5) as token, i}
				<button 
					class="token"
					disabled={!canClick || token.taken || null}
					data-id={token.id}
					data-desc={token.desc}
					on:click={chooseToken(token, i)}
				></button>
			{/each}
		{:else}
			{#each $gs.tokens.slice(5, 8) as token}
				<button
					class="token"
					disabled={!canClick || null}
					data-id={token.id}
					data-desc={token.desc}
					on:click={chooseToken(token)}
				></button>
			{/each}
		{/if}
	{:else if showModal === "wonder"}
		<h2>Choose a mission to complete:</h2>
		<section class="purchase">
			<aside class="item">
				{#each who.missions.filter(m => !m.built) as mission}
					<button
						data-selected={selectedWonder.id === mission.id}
						on:click={() => { selectWonder(mission) }}
					>
						<Mission mission={mission} />
					</button>
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
					class="btn-board"
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
	{:else if showModal === "select-man"}
		{#if canClick}
			<h2>Choose a card to destroy:</h2>

			<section class="cards">
				{#each notwho.cards.filter(c => c.type === "man") as card}
					<div 
						class="card-sm" 
						data-res={card.res} 
						data-type={card.type} 
						on:click={destroyCard(card)}
					></div>
				{/each}
			</section>
		{:else}
			<h2>Opponent is choosing a resource to destroy...</h2>
		{/if}
	{:else if showModal === "select-res"}
		{#if canClick}
			<h2>Choose a card to destroy:</h2>

			<section class="cards">
				{#each notwho.cards.filter(c => c.type === "res") as card}
					<div 
						class="card-sm" 
						data-res={card.res} 
						data-type={card.type} 
						on:click={destroyCard(card)}
					>
						<span class="emblems">
							{#if card.rescount}<span class="extra">{card.rescount}</span>{/if}
						</span>
					</div>
				{/each}
			</section>
		{:else}
			<h2>Opponent is choosing a resource to destroy...</h2>
		{/if}
	{:else if showModal === "select-discard"}
		{#if canClick}
			<h2>Choose a card from the discard:</h2>

			<section class="cards">
				{#each $gs.discarded as card}
					<div 
						class="card-sm"
						data-type={card.type}
						data-vp={card.vp}
						data-res={card.res}
						data-war={card.war}
						data-trade={card.trade}
						data-provides={prov(card)}
						on:click={chooseCard({ card, free: true })}
					>
						<span class="emblems">
							{#if card.sci}
								<i class="emblem-sci icon icon-{card.sci}"></i>
							{/if}
							{#if card.rescount}
								<span class="extra">{card.rescount}</span>
							{:else if card.link}
								<span class="extra">
									<i class="icon icon-{card.link}"></i>
								</span>
							{/if}
						</span>
					</div>
				{/each}
			</section>
		{:else}
			<h2>Opponent is choosing a card from discard pile...</h2>
		{/if}
	{:else if showModal === "next"}
		{#if canChooseAge}
			<h2>Who will start this campaign?</h2>
			<button on:click={changePlayer("p1")}>I will</button>
			<button on:click={changePlayer("p2")}>They will</button>
		{:else}
			<h2>Opponent is choosing who goes first this campaign...</h2>
		{/if}
	{/if}
</div>

<style>

h4 { margin: 0 0 10px; }
.modal {
	background: url('/assets/modal_bg.png') no-repeat;
	background-size: 100% 100%;
	color: white;
	margin: auto;
	max-height: 95vh;
	max-width: 80vw;
	min-width: 480px;
	padding: 35px;
	position: relative;
	text-align: center;
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
		grid-template-areas: 
			"mission buy"
			"mission opt";
		grid-template-columns: 4fr 1fr;
		grid-template-rows: auto 60px;
	}
		[data-modal="wonder"] .purchase .item {
			grid-area: mission;
			padding: 0 20px;
		}

		[data-modal="wonder"] .purchase .buy { grid-area: buy; }
		[data-modal="wonder"] .purchase .options { grid-area: opt; }

	.purchase aside {
		text-align: left;
	}

	.purchase .pog { display: inline-grid; }

	.purchase[data-buy="false"] {
		grid-template-columns: 1fr 20px 1fr;
	}

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

.have .pog ~ .empty-txt {
	display: none;
}

.have .pog:after {
	content: "⚠️";
	position: absolute;
	bottom: 0; right: 0;
	z-index: 2;
}
	.have .pog[data-enough]:after { content: "✅"; }

.options button { 
	display: block; 
	margin-bottom: 5px;
}

.cards {
	text-align: center;
}

.card-sm {
	cursor: pointer;
	display: inline-grid;
	height: 70px;
	line-height: 70px;
	margin: 0 2px 5px 2px;
	transition: transform 0.2s;
	width: 50px;
	vertical-align: top;
}
	.card-sm:hover {
		transform: scale(1.1);
	}

	.card-sm:before {
		left: 14px;
		top: 24px;
	}

	.card-sm:after {
		height: 30px;
		width: 30px;
	}

	.card-sm[data-type="civ"]:after,
	.card-sm[data-type="sci"]:after,
	.card-sm[data-type="war"]:after {
		width: 100% !important;
	}

.emblems {
	font-size: 10px;
	font-weight: bold;
	position: absolute;
	top: -1px; right: 0;
	text-transform: uppercase;
	width: 100%;
}
	.emblems span {
		border-radius: 3px;
		float: left;
		line-height: 14px;
		padding: 0 3px;
	}
		.emblems span.extra { 
			background: rgba(0, 0, 0, 0.5);
			color: white;
			float: right; 
		}

.token {
	margin: 0 5px;
}

[data-free="true"] {filter: hue-rotate(-20deg) saturate(200%); }
[data-free="false"] {filter: hue-rotate(40deg) saturate(600%); }
[data-trade] {filter: hue-rotate(20deg) saturate(600%); }
[data-mission] {filter: hue-rotate(-110deg) saturate(200%); }

.ingoo {
	background: url('/assets/res.png') no-repeat -60px 1px;
	background-size: 80px 40px;
	display: inline-block;
	height: 20px;
	margin-left: 5px;
	width: 20px;
	vertical-align: middle;
}
	[data-free="false"] .ingoo { filter: hue-rotate(-30deg) saturate(20%); }
	[data-trade] .ingoo { filter: hue-rotate(-10deg) saturate(20%); }

.item button {
	background: none;
	border: 0 none;
	padding: 5px;
}
	.item button[data-selected="false"] { 
		filter: grayscale(30%) brightness(40%);
	}

button > :global(.mission[data-id]:first-child) {
	height: 20vh;
	margin: 0;
	width: 100%;
}

.close {
	cursor: pointer;
	font-size: 3em; 
	opacity: 0.9;
	position: absolute;
	top: 5px; right: 35px;
}
</style>