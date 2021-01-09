
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

	addAlert(a, code = false) {
		let alert = a.msg || { msg: a };
		if (window.Cypress) return false;

		update(self => {
			if (
				(self.andy && !code) 
				|| (self.andy && code && !self[code])
			) {
				self.alerts = [...self.alerts, alert];
				if (code) self[code] = true;
				return self;
			} else {
				return self;
			}
		});
	},
	removeAlert(i = 0) {
		update(self => {
			self.alerts.splice(i, 1);
			self.alerts = [...self.alerts];
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