import { writable } from 'svelte/store';

export const gs = writable({
	age: 1,
	p1: null,
	p2: null
});