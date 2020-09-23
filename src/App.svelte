<script>
	import Player from './Player.svelte';
	import WarBar from './WarBar.svelte';
	import Pile from './Pile.svelte';
	import Mission from './Mission.svelte';

	import { score, top5, top2, bot5, bot2 } from './store/warStore';
	import { gs, ns } from './store/gameState';
	import { age1, more } from './store/cards';

	// Define the Player object and all its props
	class PlayerObj {
		constructor(primary = false) {
			this.primary = primary;
			this.ingoo = 7; // Coins
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

	let tokens = [...gs.shuffle($more.tokens, process.env.isDev)];
	let missions = [...gs.shuffle($more.wonders, process.env.isDev)];
	let cards = gs.shuffle($age1, process.env.isDev).slice(3);
	let missionSet = [...missions.slice(0, 4)];

	let selectedMissions = [];
	let winner = null;

	function startGame(mp = false) {
		console.info('Starting Game.')
		let myturn = true;

		if (mp) {
			// Leave the lobby
			$ns.pubnub.unsubscribe({
				channels: ["pwd-lobby"]
			});

			if ($ns.hosting) {
				$ns.pubnub.publish({
					message: {
						cards,
						tokens,
						missions,
						start: true
					},
					channel: $ns.channel
				});
			} else {
				myturn = false;
			}
		}

		gs.set({
			...$gs,
			state: 'wonders',
			p1,
			p2,
			tokens,
			myturn
		});
	}

	/**
	 * Selects a mission, durin the start of the game.
	 * @param m - The mission object
	 * @param choosemission - Set to true when triggered from an online opponent
	 */
	function chooseMission(m, choosemission = false) {
		// Relay in MP
		if ($ns.online && !choosemission) $ns.pubnub.publish({
			message: {
				mission: m,
				choosemission: true
			},
			channel: $ns.channel
		});

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
					state: 'started'
				});

				break;
		}

		gs.set({
		...$gs,
			myturn: changeTurn ? !$gs.myturn : $gs.myturn,
			[$gs.myturn ? 'p1' : 'p2']: p 
		});
	}

	/** Does all the end game calculation work */
	function endGame(win) {
		winner = { player: `Player ${$gs.myturn ? 2 : 1} Wins` }

		// Check for war victory
		if (win === 'war') {
			winner.type = 'Military Victory';
			return true;
		}

		if (win === 'sci') {
			winner.type = 'Civilized Victory';
			return true;
		}

		winner.type = 'Standard Victory';
		tallyPlayer('p1');
		tallyPlayer('p2');

		if ($gs.p1.score > $gs.p2.score) winner.player = 'You Win';
		if ($gs.p2.score > $gs.p1.score) winner.player = 'They Win';

		// Civilian cards handle tie breakers
		if ($gs.p1.score === $gs.p2.score) {
			const civ1 = 0;
			const civ2 = 0;

			$gs.p1.cards.forEach(c => { if (c.type === "civ") civ1 += c.vp });
			$gs.p2.cards.forEach(c => { if (c.type === "civ") civ2 += c.vp });

			if (civ1 > civ2) winner.player = 'You Win';
			if (civ2 > civ1) winner.player = 'They Win';
			if (civ1 === civ2) winner.player = 'Both Players Win';
		}
	}

	/** Calculates the per player numbers */
	function tallyPlayer(p) {
		const player = {...$gs[p]};

		// Tally up war points
		if (p === 'p1') {
			switch($score) {
				case 1:
				case 2:
					player.score += 2;
					break;
				case 3:
				case 4:
				case 5:
					player.score += 5;
					break;
				case 6:
				case 7:
				case 8:
					player.score += 10;
					break;
			}
		} else {
			switch(score) {
				case -1:
				case -2:
					player.score += 2;
					break;
				case -3:
				case -4:
				case -5:
					player.score += 5;
					break;
				case -6:
				case -7:
				case -8:
					player.score += 10;
					break;
			}
		}

		// Tally up Guild points
		const g = player.cards.forEach(c => {
			if (c.earn) {
				switch(c.earn.for) {
					case 'civ':
					case 'war':
					case 'eco':
						player.score += player[c.earn.for];
						break;
					case 'sci':
						player.score += player.sci.length;
						break;
					case 'res':
						player.score += player.res + player.man;
						break;
					case 'coin':
						player.score += Math.floor(player.ingoo / 3);
						break;
					case 'wonder':
						player.score += Object.keys(player.missions).length;
						break;
				}
			} 
		});

		// Tally up coins
		player.score += Math.floor(player.ingoo / 3);

		// Math token
		if (player.tokens.includes('mathematics')) 
			player.score += player.tokens.length * 3;

		gs.set({
		...$gs,
			[player]: player
		});
	}

	/** Sets the deck of cards being used */
	function swapCards(deck) {
		cards = [...deck];
	}

	/** Manually change player turn */
	function changePlayer(p, choosep = false) {
		if ($ns.online && !choosep) $ns.pubnub.publish({
			message: { p: p === "p1" ? "p2" : "p1", choosep: true },
			channel: $ns.channel
		});

		gs.set({ 
			...$gs,
			myturn: p === "p1",
			showModal: false
		});
	}

	/**
	 * Fired after a player has chosen from one of the 2 token modals
	 * @param {Object} The chosen token
	 * @param {Number} The index of the chosen token, to mark as taken in UI
	 * @param {Boolean} Indicates whether it came from the internets
	 */ 
	 function chooseToken(token, i = false, choosetoken = false) {
		if ($ns.online && !choosetoken) $ns.pubnub.publish({
			message: {
				token,
				i,
				choosetoken: true
			},
			channel: $ns.channel
		});

		const tokens = [...$gs.tokens];
		const p = { ...$gs[$gs.myturn ? 'p1' : 'p2'] };
	
		if (i) tokens[i].taken = true;
		p.tokens.push(i ? tokens[i] : token);

		if (token.vp) p.vp += token.vp;
		if (token.coin) p.ingoo += token.coin;
		if (token.sci) p.sci.push(token.sci);

		if (token.mywar) p.wartoken = true;
		if (token.mymoney) p.ecotoken = true;
		if (token.mylinks) p.linktoken = true;
		if (token.mywonders) p.playtoken = true;

		if (token.discount === "civ") p.civtoken = true;
		if (token.discount === "wonder") p.wondertoken = true;

		gs.set({ 
			...$gs, 
			tokens,
			[$gs.myturn ? 'p1' : 'p2']: p,
			myturn: !$gs.myturn,
			showModal: null
		});
	}

	/** Choose a card to destroy on your opponent's side 
	 * @param {Object} The chosen card
	*/
	function destroyCard(card, destroycard = false) {
		if ($ns.online && !destroycard) $ns.pubnub.publish({
			message: {
				card,
				destroycard: true
			},
			channel: $ns.channel
		});

		let p = { ...$gs[$gs.myturn ? 'p1' : 'p2'] }; // Do I need this one?
		let o = { ...$gs[$gs.myturn ? 'p2' : 'p1'] };

		// Loop through opponent cards to find right one to nix
		o.cards.forEach((c, i) => {
			if (card.id === c.id) {
				const rescount = card.rescount || 1;

				// Deduct resource
				if (card.type === "res") {
					o.res -= 1;
		
					if (card.res === "stone") o.stone -= 1 * rescount;
					if (card.res === "wood") o.wood -= 1 * rescount;
					if (card.res === "clay") o.clay -= 1 * rescount;
				} else {
					o.man -= 1;

					if (card.res === "glass") o.glass -= 1 * rescount;
					if (card.res === "paper") o.paper -= 1 * rescount;
				}
			
				// Discard
				o.cards.splice(i, 1);
			}
		});

		// Apply it all
		gs.set({
			...$gs,
			p1: $gs.myturn ? p : o,
			p2: $gs.myturn ? o : p,
			myturn: !$gs.myturn,
			showModal: false
		});
	}

	/** Resets the game state */
	function resetGame(dc = false) {
		// ...
		// if (dc === true) // ...
	}

	// ===========================
	// Prepare all the multiplayer stuff
	// ===========================
	$ns.pubnub.subscribe({
		channels: ['pwd-lobby'],
		withPresence: true
	});

	$ns.pubnub.addListener({
		presence(ev) {
			console.log(ev);
			// Used to detect when newly hosted games are created, live
			if (ev.action === "state-change") {
				// console.log('Detected state change', ev)
				if (ev.state.hosting !== null) ns.updateLobbies();
			}
		},
		status(ev) {
			if (ev.category === "PNConnectedCategory") {
				// On the initial connection to the lobby
				if (
					ev.subscribedChannels.length === 1
					&& ev.subscribedChannels.includes("pwd-lobby")
				) {
					console.info('You have joined the lobby.')
					// Clear any old presence? Then update lobbies
					$ns.pubnub.setState({
						state: { hosting: null },
						channels: ['pwd-lobby']
					}, ns.updateLobbies);
				}

				// On join game
				if (ev.subscribedChannels.length === 2) {
					$ns.pubnub.hereNow({ 
						channels: ev.affectedChannels
					}, (s, resp) => {
						console.log(resp);
						if (resp.totalOccupancy > 1) $ns.pubnub.publish({
							message: 'ready',
							channel: ev.affectedChannels[0]
						});
					});
				}
			}
		},
		message(data) {
			// Ignore yourself
			if (data.publisher === $ns.pubnub.getUUID()) return false;

			// Player joined your game
			if ($ns.hosting && data.message === 'ready') {
				startGame(true);
			}

			// Host sent over game data
			if (data.message.start) {
				cards = [...data.message.cards];
				tokens = [...data.message.tokens];
				missions = [...data.message.missions];
				missionSet = [...missions.slice(0, 4)];
				startGame(true);
			}

			// Player chose a card
			if (data.message.choosecard) mpdata = data;

			// Player chose a mission
			if (data.message.choosemission) chooseMission(data.message.mission, true);

			// Player chose a who goes first
			if (data.message.choosep) changePlayer(data.message.p, true);

			// Player chose a token
			if (data.message.choosetoken) chooseToken(data.message.token, data.message.i, true);

			// Player chose a card to destroy
			if (data.message.destroycard) destroyCard(data.message.card, true);
		}
	});

	let mpdata = null;
</script>

<main>
	<div class="game">
		{#if $gs.p2}<Player className="you" player={$gs.p2} turn={!$gs.myturn} />{/if}

		{#if $gs.state === "started"}
			<WarBar />

			<main class="table" data-winner={winner ? true : null}>
				{#if winner}
					<h1>{winner.player}</h1>
					<h3>{winner.type}</h3>
					<button on:click={resetGame}>Play Again</button>
					<button on:click={resetGame(true)}>Back to Lobby</button>
				{:else}
					<Pile 
						endGame={endGame} 
						cards={cards} 
						mpdata={mpdata}
						swapCards={swapCards}
						changePlayer={changePlayer}
						chooseToken={chooseToken}
						destroyCard={destroyCard}
					/>
				{/if}
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
						myturn={($ns.online && $gs.myturn) || !$ns.online}
					/>
				{/each}
			</div>
		{:else}
			<main class="table menu">
				<ul class="lobbies" data-hosting={$ns.hosting || null}>
					{#each $ns.lobbies as lobby}
						<li 
							data-selected={$ns.selectedRoom === lobby.uuid || null} 
							on:click={ns.selectRoom(lobby)}
						>
							<strong>{lobby.state.user}'s Room</strong>
							<span class="room">{lobby.uuid.slice(3, 8)}</span>
						</li>
					{/each}
				</ul>
				<aside>
					<img src="/assets/logo.png" alt="Pocketworld Duels" class="logo">
					{#if !$ns.hosting}
						<button on:click={() => { startGame(false); }}>Start Local Game</button>
					{/if}
					<button on:click={ns.hostGame}>
						{#if $ns.hosting}Cancel Host
						{:else}Host Lobby{/if}
					</button>
					{#if !$ns.hosting}
						<button disabled={!$ns.selectedRoom} on:click={ns.joinGame}>Join Lobby</button>
					{/if}
				</aside>
			</main>
		{/if}

		{#if $gs.p1}<Player className="me" player={$gs.p1} turn={$gs.myturn} />{/if}
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
	.table[data-winner] {
		flex-direction: column;
	}

.menu {
	gap: 10px;
}
	.menu .lobbies { 
		background: url('/assets/board.png') no-repeat;
		background-size: 100% 100%;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
		color: white;
		height: 100%;
		margin-right: 50px;
		padding: 18px 10px;
		width: 320px;
	}
		.menu .lobbies[data-hosting] {
			cursor: not-allowed;
		}

		.menu .lobbies:empty {
			display: grid;
			place-items: center;
		}

		.menu .lobbies:empty:after {
			content: 'No lobbies.';
		}

		.menu .lobbies li {
			list-style: none;
			padding: 15px 10px;
			user-select: none;
		}
			.menu .lobbies li[data-selected] { border-left: 3px solid yellow; }

		.menu .lobbies .room {
			float: right;
			font-size: italic;
			opacity: 0.5;
		}

	.menu aside {
		flex: 1;
	}

.logo { 
	display: block; 
	margin-bottom: 20px;
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

:global(.pog) { 
	background: url('/assets/pog.png') no-repeat;
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
		:global(.pog[data-res="coin"]:before) { background-position: -91px 0; }
		:global(.pog[data-res="paper"]:before) { background-position: 0 -30px; }
		:global(.pog[data-res="glass"]:before) { background-position: -30px -30px; }
</style>