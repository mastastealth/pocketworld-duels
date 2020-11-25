
import { writable } from 'svelte/store';

const { subscribe, set, update } = writable({
	andy: true,
	alerts: []
});

export const aStore = {
	subscribe,
	set,
	update,

	addAlert(a) {
		let alert = a.msg || { msg: a };

		update(self => {
			self.alerts = [...self.alerts, alert];
			return self;
		});
	},
	removeAlert(i) {
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