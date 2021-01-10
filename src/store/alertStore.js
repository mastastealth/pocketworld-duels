
import { writable } from 'svelte/store';

const tips = {
	'warbar-end': 'Earn enough sugar to reach your opponent and you will win the Military Victory.',
	'warbar-marker': 'The sugar marker moves upward toward your opponent as you gain sugar. At certain checkpoints you can cause your opponent to lose some Ingoo, as well earn some extra food at the end of the game.',
	'tokens': 'This is the pool of tokens you can choose from when you obtain a pair of Civilized Emblems (the big icon on the yellow cards). Hover each for details.',
	'card-emblem': "This is a Civilized Emblem. If you have the matching set of cards with the same symbol, you'll be able to take a token from the pool on the right.",
	'card-icon': "When you obtain a card with the small white icon, you can obtain the card with the same icon in its cost column, for free.",
	'card-cost': "This is how much this card costs in Ingoo.",
	'card-cost2': "You must have an equal or greater amount of the listed resources to get this card for free. For every resource you don't have, you will pay 2 Ingoo + 1 for every matching resource your opponent has, unless you have a Longcoats card to flatten the trade cost.",
	'card-res': "This card will provide you with the amount of food or resource(s) displayed in the center.",
	'card-trade': "Normally for every resource you don't have, you will pay 2 Ingoo + 1 for every matching resource your opponent has. This causes the trade free for the resource to be flat.",
	'mission-cost': "These are the resources required to complete this mission. Missing resources can be paid for with Ingoo, at the typical trade rates.",
	'mission-ingoo': "This mission will provide you with a one time bonus of Ingoo.",
	'mission-food': "This mission will add to your food total.",
	'mission-again': "This mission will let you take a turn again.",
	'mission-descoin': "This mission will let you reduce your opponent's Ingoo count.",
	'mission-desres': "This mission will let you discard one of your opponent's resources.",
	'mission-desman': "This mission will let you discard one of your opponent's special grey resources.",
	'mission-token': "This mission will let you obtain a free token from the discarded tokens.",
	'mission-discard': "This mission will let you obtain a discarded card (one that was traded) for free.",
	'mission-prov': "This mission will provide you with a set of resources. You can choose to use ONE of these resources as part of your pool when obtaining other cards/missions.",
	'mission-sugar': "This mission will provide you with the displayed amount of sugar."
}

const { subscribe, set, update } = writable({
	andy: true,
	tip: false,
	alerts: [],
	// Codes for specific messages to display once
	res: false,
	man: false,
	eco: false,
	war: false,
	civ: false,
	sci: false,
	guild: false,
	cost: false,
	link: false,
	token: false
});

export const aStore = {
	subscribe,
	set,
	update,

	addAlert(a, code = false, time = 4) {
		let alert = a.msg ? a : { msg: a };
		if (window.Cypress) return false;

		update(self => {
			if (!code || (code && self.andy && !self[code])) self.alerts = [...self.alerts, alert];
			if (code) self[code] = true;

			setTimeout(() => {
				update(self => {
					if (self.alerts.length) self.alerts.splice(0, 1);
					self.alerts = [...self.alerts];
					return self;
				});
			}, time * 1000);

			return self;
		});
	},
	killAndy() {
		update(self => {
			self.andy = false;
			return self;
		});
	},
	setTip(tip = false) {
		update(self => {
			self.tip = tips[tip];
			return self;
		});
	}
};