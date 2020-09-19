import { writable } from 'svelte/store';

const factions = [
	'Commonfolk',
	'Civilized',
	'KSR',
	'Longcoats'
];

const units = [
	'Squirrel', 'Lizard', 'Toad', 'Pigeon', 'Mole',
	'Skunk', 'Chameleon', 'Falcon', 'Snake', 'Ferret',
	'Fox', 'Boar', 'Badger', 'Owl', 'Wolf'
];

const pubnub = new PubNub({
	publishKey: "pub-c-ee5c8983-447f-4da4-b62c-f423b7c20848",
	subscribeKey: "sub-c-01f737fa-f3d6-11ea-afa2-4287c4b9a283",
	ssl: true
});

function random(arr) {
	return arr[Math.floor(Math.random() * Math.floor(arr.length))];
}

const initialGameState = {
	state: 'menu',
	age: 1,
	p1: null,
	p2: null,
	myturn: true,
	cardsleft: 20,
	selected: null,
	discarded: [],
	tokens: [],
	showModal: false,
}

export const gs = writable({
	...initialGameState,
	// Methods,
	shuffle(arr, dontshuffle = false) {
		const shuffled = [...arr];
		if (dontshuffle) return shuffled;

		// Durstenfled shuffle
		for (let i = shuffled.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		return shuffled;
	}
});

const initialNetState = {
	lobbies: [],
	hosting: false,
	online: false,
	selectedRoom: null
}

const { subscribe, set, update } = writable({
	...initialNetState,
	pubnub,
	myid: pubnub.getUUID(),
	get mychan() {
		return `pwd-${this.myid.slice(3, 10)}`;
	},
	get channel() {
		return this.selectedRoom 
			? `pwd-${this.selectedRoom.slice(3, 10)}`
			: this.mychan;
	}
});

export const ns = {
	// Store defaults
	subscribe,
	set,
	update,

	/** Either hosts a new game or cancels a currently hosted one */
	hostGame() {
		update(self => {
			if (self.hosting) {
				console.info('Closing lobby.');
				pubnub.unsubscribe({
					channels: [self.mychan]
				});
		
				pubnub.setState({
					state: { hosting: false },
					channels: ['pwd-lobby']
				});

				
				self.hosting = false;
				self.online = false;
				return self;
			} else {
				console.info(`Opening lobby ${self.mychan}.`);
				const user = `${random(factions)} ${random(units)}`;

				pubnub.subscribe({
					channels: [self.mychan]
				});

				// Set presence to hosting
				pubnub.setState({
					state: { 
						hosting: true,
						user
					},
					channels: ['pwd-lobby']
				}, (s, resp) => {
					console.info(`Hosting as ${user}`);
				});

				self.hosting = true;
				self.online = true;
				return self;
			}
		});
	},
	/** Join a game */
	joinGame() {
		update(self => {
			if (self.hosting) return false;
			
			// Join the host's channel
			pubnub.subscribe({
				channels: [self.channel]
			});

			self.online = true;
			// TODO - Set a loading state of sorts?
			return self;
		});
	},
	/** Refresh the lobby list by checking the state of all players in the lobby channel */
	async updateLobbies() {
		console.info('Updating lobbies.');

		const resp = await pubnub.hereNow({ 
			channels: ["pwd-lobby"], 
			includeState: true 
		});

		const ppl = resp.channels["pwd-lobby"].occupants;
		console.log(ppl)

		update(self => {
			self.lobbies = ppl.filter(l => l.state.hosting && l.state.user);
			return self;
		});
	},
	/** Sets the room that you plan to join */
	selectRoom(lobby) {
		update(self => {
			if (self.hosting) return self;

			self.selectedRoom = self.selectedRoom ? null : lobby.uuid;
			return self;
		});
	}
};