
import { writable } from 'svelte/store';

const { subscribe, set, update } = writable({
	andy: true,
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
	}
};