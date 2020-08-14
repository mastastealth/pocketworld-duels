<script>
	import Player from './Player.svelte';
	import WarBar from './WarBar.svelte';
	import { score, top5, top2, bot5, bot2 } from './WarStore';

	// Define the Player object and all its props
	class PlayerObj {
		constructor(primary = false) {
			this.primary = primary;
			this.food = 0; // Coins
			this.score = 0; // VPs
			this.cards = [];
			this.tokens = [];
			this.missions = {}; // Wonders
		}
	}

	// Setup the rest of the game state
	let gameState = {};
	let p1 = new PlayerObj(true);
	let p2 = new PlayerObj();

	// Fn
	function doIt() {
		p1.cards = [...p1.cards, { label: "Toot" }];
		p1.score += 1;
	}

	function doIt2() {
		let flipped = false;
		score.update(n => n + 1);

		// Check for a war win
		if ($score === 9 || $score === -9) {
			// ...
		}

		if ($score === 6 && !$top5) { top5.update(n => true); flipped = true; }
		if ($score === 3 && !$top2) { top2.update(n => true); flipped = true; }
		if ($score === -6 && !$bot5) { bot5.update(n => true); flipped = true; }
		if ($score === -3 && !$bot2) { bot2.update(n => true); flipped = true; }

		// Deduct coins
		if (flipped) { 
			// ...
		}
	}
</script>

<main>
	<div class="game">
		<Player className="you" player={p2} ws={$score} />
		<WarBar ws={$score} />

		<main class="table">
			<button on:click={doIt}>Add Score</button>
			<button on:click={doIt2}>Add War Score</button>
		</main>

		<Player className="me" player={p1} ws={$score} />
	</div>
</main>

<style>
.game {
	display: grid;
	grid-template-areas:
		"p2 p2 p2 p2"
		"ws tb tb tb"
		"p1 p1 p1 p1";
	grid-template-columns: 200px 1fr;
	grid-template-rows: 100px 1fr 100px;
	height: 100vh;
}

.table {
	background: #FAFAFA;
	height: 100%;
	grid-area: tb;
	padding: 48px 20px;
}
</style>