import { writable } from 'svelte/store';

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