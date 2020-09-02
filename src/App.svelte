<script>
	import Player from './Player.svelte';
	import WarBar from './WarBar.svelte';
	import Pile from './Pile.svelte';
	import Mission from './Mission.svelte';

	import { score, top5, top2, bot5, bot2 } from './store/warStore';
	import { gs } from './store/gameState';

	import more from './json/more.json';

	// Define the Player object and all its props
	class PlayerObj {
		constructor(primary = false) {
			this.primary = primary;
			this.food = 7; // Coins
			this.score = 0; // VPs
			this.cards = [];
			this.tokens = [];
			this.missions = []; // Wonders
			this.winner = false;
			// Resources
			this.wood = 0;
			this.clay = 0; // Bones
			this.stone = 0; 
			this.paper = 0; // Orn
			this.glass = 0; // Ammo
			this.trade = [];
			this.provision = 0; // 0 none, 1 = res, 2 = man, 3 = both
			// "Buildings"
			this.res = 0;
			this.man = 0;
			this.eco = 0;
			this.civ = 0;
			this.sci = [];
			this.war = 0;
			// Token flags
			this.wartoken = false;
			this.ecotoken = false;
			this.linktoken = false;
			this.playtoken = false;
			this.civtoken = false;
			this.wondertoken = false;
			// Other
			this.warprogress = 0;
			this.links = [];
		}
	}

	const p1 = new PlayerObj(true);
	const p2 = new PlayerObj();
	const tokens = [...$gs.shuffle(more.tokens)];
	const missions = [...$gs.shuffle(more.wonders)];

	let missionSet = [...missions.slice(0, 4)];
	let selectedMissions = [];

	function startGame() {
		gs.set({
		...$gs,
			state: "wonders",
			p1,
			p2,
			tokens
		});
	}

	function chooseMission(m) {
		// Track selected missions
		selectedMissions.push(m.id);
		selectedMissions = [...selectedMissions];

		// Track who it goes to
		const p = $gs.myturn ? p1 : p2;
		p.missions.push(m);

		// Check when we need to change turns
		let changeTurn = true;

		switch(selectedMissions.length) {
			case 4:
				missionSet = [...missions.slice(4, 8)];
			case 3:
			case 5:
				changeTurn = true;
				break;
			case 2:
			case 6:
				changeTurn = false;
				break;
			case 8:
				gs.set({
					...$gs,
					state: "started"
				});

				break;
		}

		gs.set({
		...$gs,
			myturn: changeTurn ? !$gs.myturn : $gs.myturn,
			[$gs.myturn ? 'p1' : 'p2']: p 
		});
	}
</script>

<main>
	<div class="game">
		{#if $gs.p2}<Player className="you" player={$gs.p2} ws={$score} turn={!$gs.myturn} />{/if}

		{#if $gs.state === "started"}
			<WarBar />

			<main class="table">
				<Pile />
			</main>

			<aside class="tokens">
				{#each $gs.tokens.slice(0, 5) as token}
					<div 
						class="token"
						data-taken={token.taken || null}
						data-id={token.id}
					></div>
				{/each}
			</aside>
		{:else if $gs.state === "wonders"}
			<div class="table wonder-select">
				<h2>Player {$gs.myturn ? 1 : 2} Select a Mission:</h2>

				{#each missionSet as m}
					<Mission 
						taken={selectedMissions.includes(m.id) || null} 
						mission={m} 
						chooseMission={chooseMission} 
					/>
				{/each}
			</div>
		{:else}
			<main class="table menu">
				<ul class="lobbies">

				</ul>
				<aside>
					<button on:click={startGame}>Start Game</button>
					<button disabled>Host Lobby</button>
				</aside>
			</main>
		{/if}

		{#if $gs.p1}<Player className="me" player={$gs.p1} ws={$score} turn={$gs.myturn} />{/if}
	</div>
</main>

<style>
.game {
	display: grid;
	grid-template-areas:
		"p2 p2 p2"
		"ws tb ts"
		"p1 p1 p1";
	grid-template-columns: 100px 1fr 100px;
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

.menu {
	gap: 10px;
}
	.menu .lobbies { 
		background: rgba(0, 0, 0, 0.5);
		flex: 1;
		height: 100%;
	}

	.menu aside {
		flex: 1;
	}

.wonder-select { flex-wrap: wrap; }
	.wonder-select h2 { 
		margin: 0;
		text-align: center;
		width: 100%; 
	}

.tokens {
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100%;
	grid-area: ts;
	padding: 5vh 0;
}
:global(.token) {
	background: green;
	border-radius: 100%;
	height: 90px;
	width: 90px;
}

:global(.token[disabled]),
:global(.token[data-taken]) {
	background: gray;
}

:global(.pog) { 
	background: url('/assets/pog.png');
	background-size: 100% auto;
	display: grid;
	height: 40px;
	position: relative;
	width: 40px;
}
	:global(.pog:before) {
		background: url('/assets/res.png') no-repeat;
		background-size: 120px 60px;
		content: '';
		height: 30px;
		margin: auto;
		width: 30px;
		z-index: 1;
	}
		:global(.pog[data-res="stone"]:before) { background-position: -30px 0; }
		:global(.pog[data-res="wood"]:before) { background-position: -60px 0; }
		:global(.pog[data-res="paper"]:before) { background-position: 0 -30px; }
		:global(.pog[data-res="glass"]:before) { background-position: -30px -30px; }
</style>