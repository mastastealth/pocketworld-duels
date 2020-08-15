import { writable } from 'svelte/store';

export const score = writable(0);
export const top5 = writable(false);
export const top2 = writable(false);
export const bot5 = writable(false);
export const bot2 = writable(false);