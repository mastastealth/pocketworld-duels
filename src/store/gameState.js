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

export const gs = writable({
	state: 'menu',
	age: 1,
	p1: null,
	p2: null,
	myturn: true,
	cardsleft: 20,
	selected: null,
	discarded: [],
	tokens: [],
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

export const ns = writable({
	pubnub,
	hostGame() {
		const user = `${random(factions)} ${random(units)}`;

		pubnub.subscribe({
			channels: [`pwd-${pubnub.getUUID().slice(3, 10)}`]
		});

		// Set presence to hosting
		pubnub.setState({
			state: { 
				hosting: true,
				user
			},
			channels: ['pwd-lobby']
		}, (s, resp) => {
			console.log(`Hosting as ${user}`, resp);
		});

		return true;
	}
});