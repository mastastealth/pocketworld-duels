<script>
	import Player from './Player.svelte';
	import { score } from './WarStore';

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

	// Setup the War Score
	let wscore = 0;
	const warscore = score.subscribe(n => {
		wscore = n;
	})

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
		score.update(n => n + 1);
	}
</script>

<main>
	<div class="game">
		<Player className="you" player={p2} ws={wscore} />
		<aside class="war-bar">
			<button on:click={doIt}>Add Score</button>
			<button on:click={doIt2}>Add War Score</button>
		</aside>
		<main class="table"></main>
		<Player className="me" player={p1} ws={wscore} />
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

.war-bar { 
	background: red;
	height: 100%;
	grid-area: ws;
}

.table {
	background: #FAFAFA;
	height: 100%;
	grid-area: tb;
}
</style>