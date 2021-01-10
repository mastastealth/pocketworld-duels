import { readable } from 'svelte/store';

export const age1 = readable([
	{
		id: "claypit",
		cost: 1,
		type: "res",
		res: "clay"
	},
	{
		id: "stoneres",
		cost: 3,
		type: "eco",
		trade: "stone"
	},
	{
		id: "palisade",
		cost: 2,
		type: "war",
		war: 1,
		link: "shield",
		label: "Nomads of the North"
	},
	{
		id: "garrison",
		cost: ["clay"],
		type: "war",
		war: 1,
		link: "hammer",
		label: "The Volunteers"
	},
	{
		id: "pharmacist",
		cost: 2,
		type: "sci",
		sci: "bowl",
		link: "mountain"
	},
	{
		id: "glassworks",
		cost: 1,
		type: "man",
		res: "glass"
	},
	{
		id: "tavern",
		cost: 0,
		type: "eco",
		"instant": 4,
		link: "cup"
	},
	{
		id: "apothecary",
		cost: ["glass"],
		type: "sci",
		sci: "wheel",
		vp: 1
	},
	{
		id: "loggingcamp",
		cost: 1,
		type: "res",
		res: "wood"
	},
	{
		id: "press",
		cost: 1,
		type: "man",
		res: "paper"
	},
	{
		id: "stonepit",
		cost: 1,
		type: "res",
		res: "stone"
	},
	{
		id: "quarry",
		cost: 0,
		type: "res",
		res: "stone"
	},
	{
		id: "baths",
		cost: ["stone"],
		type: "civ",
		vp: 3,
		link: "wine"
	},
	{
		id: "clayreserve",
		cost: 3,
		type: "eco",
		trade: "clay"
	},
	{
		id: "guardtower",
		cost: 0,
		type: "war",
		war: 1,
		label: "Engineers for Hire"
	},
	{
		id: "theater",
		cost: 0,
		type: "civ",
		vp: 3,
		link: "happy"
	},
	{
		id: "claypool",
		cost: 0,
		type: "res",
		res: "clay"
	},
	{
		id: "altar",
		cost: 0,
		type: "civ",
		link: "can",
		vp: 3
	},
	{
		id: "lumberyard",
		cost: 0,
		type: "res",
		res: "wood"
	},
	{
		id: "stable",
		cost: ["wood"],	
		type: "war",
		war: 1,
		link: "flag",
		label: "The Distillery Brothers"
	},
	{
		id: "woodreserve",
		cost: 3,
		type: "eco",
		trade: "wood"
	},
	{
		id: "scriptorium",
		cost: 2,
		type: "sci",
		sci: "quill",
		link: "tree"
	},
	{
		id: "workshop",
		cost: ["paper"],
		type: "sci",
		sci: "level",
		vp: 1
	}
]);

export const age2 = readable([
	{
		id: "statue",
		cost: [
			"clay",
			"clay"
		],
		linkcost: "happy",
		type: "civ",
		link: "shop",
		vp: 4
	},
	{
		id: "caravansery",
		cost: [
			"glass",
			"paper",
			"coin",
			"coin"
		],
		type: "eco",
		"provides": [
			"wood",
			"clay",
			"stone"
		]
	},
	{
		id: "forum",
		cost: [
			"clay",
			"coin",
			"coin",
			"coin"
		],
		type: "eco",
		"provides": [
			"paper",
			"glass"
		]
	},
	{
		id: "feather",
		cost: [
			"wood",
			"wood",
			"glass"
		],
		type: "civ",
		vp: 5
	},
	{
		id: "archeryrange",
		cost: [
			"stone",
			"wood",
			"paper"
		],
		type: "war",
		war: 2,
		link: "target",
		label: "The Freight Union"
	},
	{
		id: "shelfquarry",
		cost: 2,
		type: "res",
		res: "stone",
		"rescount": 2
	},{
		id: "walls",
		cost: [
			"stone",
			"stone"
		],
		type: "war",
		war: 2,
		label: "Bullet Hive"
	},
	{
		id: "brickyard",
		cost: 2,
		type: "res",
		res: "clay",
		"rescount": 2
	},
	{
		id: "dryingroom",
		cost: 0,
		type: "man",
		res: "paper"
	},
	{
		id: "barracks",
		cost: 3,
		linkcost: "hammer",
		type: "war",
		war: 1,
		label: "Wing Demons"
	},
	{
		id: "dispensary",
		cost: [
			"clay",
			"clay",
			"stone"
		],
		linkcost: "mountain",
		type: "sci",
		sci: "bowl",
		vp: 2
	},
	{
		id: "aqueduct",
		cost: [
			"stone",
			"stone",
			"stone"
		],
		linkcost: "wine",
		type: "civ",
		vp: 5
	},
	{
		id: "library",
		cost: [
			"wood",
			"stone",
			"glass"
		],
		linkcost: "tree",
		type: "sci",
		sci: "quill",
		vp: 2
	},
	{
		id: "rostrum",
		cost: [
			"wood",
			"stone"
		],
		type: "civ",
		vp: 4,
		link: "feather"
	},
	{
		id: "brewery",
		cost: 0,
		type: "eco",
		"instant": 6,
		link: "drink"
	},
	{
		id: "temple",
		cost: [
			"wood",
			"paper"
		],
		linkcost: "can",
		type: "civ",
		vp: 4,
		link: "clock"
	},
	{
		id: "sawmill",
		cost: 2,
		type: "res",
		res: "wood",
		"rescount": 2
	},
	{
		id: "horsebreeders",
		cost: [
			"wood",
			"clay"
		],
		linkcost: "flag",
		type: "war",
		war: 1,
		label: "The Glorious AFB"
	},
	{
		id: "laboratory",
		cost: [
			"wood",
			"glass",
			"glass"
		],
		type: "sci",
		sci: "level",
		vp: 1,
		link: "snow"
	},
	{
		id: "glassblower",
		cost: 0,
		type: "man",
		res: "glass"
	},
	{
		id: "paradeground",
		cost: [
			"glass",
			"clay",
			"clay"
		],
		type: "war",
		war: 2,
		link: "fire",
		label: "Morning Light Croakers"
	},
	{
		id: "customshouse",
		cost: 4,
		type: "eco",
		trade: [
			"paper",
			"glass"
		]
	},
	{
		id: "school",
		cost: [
			"wood",
			"paper",
			"paper"
		],
		type: "sci",
		sci: "wheel",
		vp: 1,
		link: "flower"
	}
]);

export const age3 = readable([
	{
		id: "study",
		cost: [
			"wood",
			"wood",
			"glass",
			"paper"
		],
		type: "sci",
		sci: "sundial",
		vp: 3
	},
	{
		id: "arsenal",
		cost: [
			"clay",
			"clay",
			"clay",
			"wood",
			"wood"
		],
		type: "war",
		war: 3,
		label: "Thermal Airsniper"
	},
	{
		id: "obelisk",
		cost: [
			"stone",
			"stone",
			"glass"
		],
		type: "civ",
		vp: 5
	},
	{
		id: "lighthouse",
		cost: [
			"clay",
			"clay",
			"glass"
		],
		linkcost: "cup",
		type: "eco",
		vp: 3,
		"instaby": {
			coin: 1,
			type: "eco"
		}
	},
	{
		id: "circus",
		cost: [
			"clay",
			"clay",
			"stone",
			"stone"
		],
		linkcost: "fire",
		type: "war",
		war: 2,
		label: "Uncle Butter"
	},
	{
		id: "gardens",
		cost: [
			"wood",
			"wood",
			"clay",
			"clay"
		],
		linkcost: "shop",
		type: "civ",
		vp: 6
	},
	{
		id: "pantheon",
		cost: [
			"wood",
			"clay",
			"paper",
			"paper"
		],
		linkcost: "clock",
		type: "civ",
		vp: 6
	},
	{
		id: "university",
		cost: [
			"clay",
			"glass",
			"paper"
		],
		linkcost: "flower",
		type: "sci",
		sci: "armillary",
		vp: 2
	},
	{
		id: "observatory",
		cost: [
			"stone",
			"paper",
			"paper"
		],
		linkcost: "snow",
		type: "sci",
		sci: "armillary",
		vp: 2
	},
	{
		id: "fortifications",
		cost: [
			"stone",
			"stone",
			"clay",
			"paper"
		],
		linkcost: "shield",
		type: "war",
		war: 2,
		label: "Kasha, Farmhand"
	},
	{
		id: "pretorium",
		cost: 8,
		type: "war",
		war: 3,
		label: "The Matriark"
	},
	{
		id: "siegeworkshop",
		cost: [
			"wood",
			"wood",
			"wood",
			"glass"
		],
		linkcost: "target",
		type: "war",
		war: 2,
		label: "Drumfire Cannon"
	},
	{
		id: "palace",
		cost: [
			"wood",
			"stone",
			"clay",
			"glass",
			"glass"
		],
		type: "civ",
		vp: 7
	},
	{
		id: "townhall",
		cost: [
			"wood",
			"wood",
			"stone",
			"stone",
			"stone"
		],
		type: "civ",
		vp: 7
	},
	{
		id: "arena",
		cost: [
			"wood",
			"clay",
			"stone"
		],
		linkcost: "drink",
		type: "eco",
		vp: 3,
		"instaby": {
			coin: 2,
			type: "wonder"
		}
	},
	{
		id: "chamberofcommerce",
		cost: [
			"paper",
			"paper"
		],
		type: "eco",
		vp: 3,
		"instaby": {
			coin: 3,
			type: "man"
		}
	},
	{
		id: "senate",
		cost: [
			"clay",
			"clay",
			"stone",
			"paper"
		],
		linkcost: "feather",
		type: "civ",
		vp: 5
	},
	{
		id: "academy",
		cost: [
			"stone",
			"wood",
			"glass",
			"glass"
		],
		type: "sci",
		sci: "sundial",
		vp: 3
	},
	{
		id: "armory",
		cost: [
			"stone",
			"stone",
			"glass"
		],
		type: "eco",
		vp: 3,
		"instaby": {
			coin: 1,
			type: "war"
		}
	},
	{
		id: "port",
		cost: [
			"wood",
			"glass",
			"paper"
		],
		type: "eco",
		vp: 3,
		"instaby": {
			coin: 2,
			type: "res"
		}
	}
]);

export const more = readable({
	"guilds": [
		{
			id: "shipowners",
			cost: [
				"clay",
				"stone",
				"glass",
				"paper"
			],
			type: "guild",
			earn: {
				from: "res",
				vp: 1,
				coin: 1
			}
		},
		{
			id: "magistrates",
			cost: [
				"wood",
				"wood",
				"clay",
				"paper"
			],
			type: "guild",
			earn: {
				from: "civ",
				vp: 1,
				coin: 1
			}
		},
		{
			id: "scientist",
			cost: [
				"wood",
				"wood",
				"clay",
				"clay"
			],
			type: "guild",
			earn: {
				from: "sci",
				vp: 1,
				coin: 1
			}
		},
		{
			id: "tacticians",
			cost: [
				"clay",
				"stone",
				"stone",
				"paper"
			],
			type: "guild",
			earn: {
				from: "war",
				vp: 1,
				coin: 1
			}
		},
		{
			id: "merchants",
			cost: [
				"clay",
				"wood",
				"glass",
				"paper"
			],
			type: "guild",
			earn: {
				from: "eco",
				vp: 1,
				coin: 1
			}
		},
		{
			id: "builders",
			cost: [
				"clay",
				"wood",
				"stone",
				"stone",
				"glass"
			],
			type: "guild",
			earn: {
				from: "wonder",
				vp: 2
			}
		},
		{
			id: "moneylenders",
			cost: [
				"wood",
				"wood",
				"stone",
				"stone"
			],
			type: "guild",
			earn: {
				from: "coin",
				vp: 1
			}
		}
	],
	"tokens": [
		{
			id: "fox",
			vp: 4,
			coin: 6,
			taken: false,
			desc: "Provides 4 food and 6 Ingoos."
		},
		{
			id: "boar",
			discount: "wonder",
			taken: false,
			desc: "Missions cost 2 less resources (of your choice)."
		},
		{
			id: "bellafide",
			mymoney: true,
			taken: false,
			desc: "All Ingoos spent by opponent for resources goes to you."
		},
		{
			id: "archimedes",
			sci: "law",
			taken: false,
			desc: "Provides an extra Civlized Emblem."
		},
		{
			id: "hopper",
			discount: "civ",
			taken: false,
			desc: "Commonfolk cards cost 2 less resources (of your choice)."
		},
		{
			id: "badger",
			mytokens: true,
			taken: false,
			desc: "Choose 1 of 3 tokens from the discarded set."
		},
		{
			id: "mill",
			vp: 7,
			taken: false,
			desc: "Provides 7 food."
		},
		{
			id: "quartermaster",
			mywar: true,
			taken: false,
			desc: "Gives 1 extra sugar per KSR card."
		},
		{
			id: "owl",
			mywonders: true,
			taken: false,
			desc: "All future Missions have the 'Play Again' effect."
		},
		{
			id: "wolf",
			coin: 6,
			mylinks: true,
			taken: false,
			desc: "Provides 6 Ingoos and lets you earn 4 Ingoos for every card bought for free through a link."
		}
	],
	"wonders": [
		{
			id: "bonepit",
			label: "The Bonepit Riots",
			cost: [
				"paper",
				"stone",
				"stone",
				"stone"
			],
			vp: 9
		},
		{
			id: "coldmark",
			label: "Defense of the Cold Mark",
			cost: [
				"glass",
				"glass",
				"clay",
				"stone"
			],
			vp: 6,
			"playagain": true
		},
		{
			id: "firebrand",
			label: "Fuel of Firebrand",
			cost: [
				"clay",
				"stone",
				"wood",
				"wood"
			],
			vp: 2,
			"playagain": true,
			"provides": ["glass", "paper"]
		},
		{
			id: "levacaloo",
			label: "The Sand Kiln at Levacaloo",
			cost: [
				"paper",
				"paper",
				"clay",
				"wood",
				"stone"
			],
			vp: 3,
			war: 1,
			"destroyres": true
		},
		{
			id: "noe",
			label: "Frozen in Noe",
			cost: [
				"paper",
				"clay",
				"clay",
				"stone",
				"stone"
			],
			vp: 3,
			coin: 3,
			"playagain": true,
			"destroycoin": true
		},
		{
			id: "feast",
			label: "Victors Will Feast",
			cost: [
				"paper",
				"glass",
				"stone",
				"wood"
			],
			coin: 12,
			"playagain": true
		},
		{
			id: "sagemarro",
			label: "Sage Marro Speaks",
			cost: [
				"glass",
				"wood",
				"stone",
				"stone"
			],
			vp: 3,
			war: 1,
			"destroyman": true
		},
		{
			id: "mightbe",
			label: "What Might Be",
			cost: [
				"glass",
				"clay",
				"clay",
				"clay"
			],
			vp: 3,
			war: 2
		},
		{
			id: "blacksledge",
			label: "Black Sledge Uprising",
			cost: [
				"wood",
				"stone",
				"paper",
				"paper"
			],
			vp: 4,
			"provides": ["wood", "stone", "clay"]
		},
		{
			id: "solawa",
			label: "Awash in Solawa",
			cost: [
				"paper",
				"glass",
				"wood",
				"wood",
				"wood"
			],
			vp: 4,
			"selecttoken": true
		},
		{
			id: "scrapetown",
			label: "Scrapetown Racket",
			cost: [
				"paper",
				"glass",
				"wood",
				"wood"
			],
			vp: 3,
			"playagain": true,
			coin: 6
		},
		{
			id: "snikaree",
			label: "Snikaree Liberation",
			cost: [
				"paper",
				"glass",
				"glass",
				"clay",
				"clay"
			],
			vp: 2,
			"selectdiscard": true
		}
	]
});