<script>
	import Player from './Player.svelte';
	import WarBar from './WarBar.svelte';
	import Pile from './Pile.svelte';

	import { score, top5, top2, bot5, bot2 } from './store/warStore';
	import { gs } from './store/gameState';

	// Define the Player object and all its props
	class PlayerObj {
		constructor(primary = false) {
			this.primary = primary;
			this.food = 7; // Coins
			this.score = 0; // VPs
			this.cards = [];
			this.tokens = [];
			this.missions = {}; // Wonders
			// Resources
			this.wood = 0;
			this.clay = 0; // Bones
			this.stone = 0; 
			this.paper = 0; // Orn
			this.glass = 0; // Ammo
			this.trade = [];
			// "Buildings"
			this.eco = 0;
			this.civ = 0;
			this.sci = [];
			this.war = 0;
		}
	}

	const p1 = new PlayerObj(true);
	const p2 = new PlayerObj();
	gs.set({
		...$gs,
		p1,
		p2
	});
</script>

<main>
	<div class="game">
		<Player className="you" player={$gs.p2} ws={$score} turn={!$gs.myturn} />
		<WarBar />

		<main class="table">
			<Pile />
		</main>

		<Player className="me" player={$gs.p1} ws={$score} turn={$gs.myturn} />
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
	align-items: center;
	display: flex;
	height: 100%;
	grid-area: tb;
	justify-content: center;
	max-height: calc(100vh - 200px);
	padding: 48px 20px;
}
</style>