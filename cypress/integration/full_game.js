describe('Starts a game', () => {
	it('Starts the game', () => {
		// Loads main page
		cy.visit('/');

		// Start game by choosing missions
		cy.contains('Start Game').click();
		cy.get('.mission').should('have.length', 4);
		cy.get('h2').should('have.text', 'Player 1 Select a Mission:');
		cy.contains('The Bonepit Riots').click();
		cy.contains('Defense of the Cold Mark').click();
		cy.contains('Fuel of Firebrand').click();
		cy.contains('The Sand Kiln at Levacaloo').click();

		// Changes to 2nd set of missions, starts with Player 2
		cy.get('h2').should('have.text', 'Player 2 Select a Mission:');
		cy.get('.mission').should('have.length', 8);
		cy.contains('Frozen in Noe').click();
		cy.contains('Victors Will Feast').click();
		cy.contains('Sage Marro Speaks').click();
		cy.contains('What Might Be').click();

		// Loads cards in Age 1
		cy.get('.card[data-type]').should('have.length', 20);
		cy.get('.card[data-sci="quill"]').should('exist');
		cy.get('.card[data-sci="level"]').should('exist');
	});
});

describe('Play through age 1', () => {
	it('Open and closes modal, adds civ card', () => {
		// Player 1 chooses Civilian card
		cy.get('[data-index="24"]').click();

		// Card modal opens
		cy.get('.modal').should('exist');

		// Clicking overlay closes it
		cy.get('.overlay').click(10, 10);
		cy.get('.modal').should('not.exist');

		// Buying card should be free
		cy.get('[data-index="24"]').click();
		cy.get('.modal .cost').should('have.text', 'You Need: 0 Ingoo ');
		cy.get('.player.me .score .ingoo').should('have.text', '7');
		cy.contains('Get for Free').click();
		cy.get('.player.me .score .ingoo').should('have.text', '7');

		// Card displays in player bar
		cy.get('.player.me .cards .card-sm')
			.should('have.length', 1)
			.should('have.text', ' c ');

		// VP added
		cy.get('.player.me .score').should('have.text', '3 7');

		// Modal is gone
		cy.get('.modal').should('not.exist');
	});

	it('Adds war card, costs extra', () => {
		// P2 gets wood
		cy.get('[data-index="25"]').click();
		cy.contains('Get for Free').click();
	
		// Player 1 chooses war card
		cy.get('[data-index="26"]').click();
		cy.get('.modal .cost [data-res="wood"]').should('have.length', 1);
		cy.get('.modal .current').should('have.text', '  None 😔');
		cy.contains('Buy for 3').click();
		cy.get('.player.me .score').should('have.text', '3 4');
	});

	it('Unblocked cards on row 2', () => {
		cy.get('[data-index="18"]').click();
		cy.contains('Buy for 2').click();

		cy.get('[data-index="19"]').click();
		cy.contains('Buy for 3').click();
	});

	it('Traded a card for money', () => {
		// P2 trades wood
		cy.get('.player.you .score').should('have.text', '3 5');
		cy.get('[data-index="13"]').click();
		cy.contains('Trade').click();
		cy.get('.player.you .score').should('have.text', '3 7');

		// P1 trades eco card, gets +1 more for it because of owned eco card
		cy.get('.player.me .score').should('have.text', '3 1');
		cy.get('[data-index="27"]').click();
		cy.contains('Trade').click();
		cy.get('.player.me .score').should('have.text', '3 4');
	});

	it('Counts cards correctly so far', () => {
		// Grab some more
		cy.get('[data-index="28"]').click();
		cy.contains('Buy for 2').click();
	
		cy.get('[data-index="29"]').click();
		cy.contains('Buy for 2').click();
	
		cy.get('[data-index="21"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="20"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="22"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="14"]').click();
		cy.contains('Buy for 1').click();

		cy.get('[data-index="15"]').click();
		cy.contains('Buy for 1').click();

		cy.get('[data-index="16"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="7"]').click();
		cy.contains('Buy for 1').click();

		cy.get('[data-index="8"]').click();
		cy.contains('Get for Free').click();

		cy.get('.player.me .score').should('have.text', '4 5');
		cy.get('.player.you .score').should('have.text', '6 3');
		cy.get('.player .card-sm').should('have.length', 15);
	});

	it('Purchases card for free with enough resources', () => {
		cy.get('[data-index="9"]').click();
		cy.get('.have .current .pog').should('exist');
		cy.contains('Get for Free').click();
	});

	it('Eco card reduces cost', () => {
		cy.get('[data-index="2"]').click();
		cy.contains('Buy for 1').click();
	});

	it('War progress reduces opponent coins', () => {
		cy.get('.player.you .score').should('have.text', '7 1');
		cy.get('.penalty.top-2').should('not.exist');
	});

	it('Loads next age when cards depleted', () => {
		cy.get('.card[data-type]:not([data-taken])').should('have.length', 1);
		cy.get('[data-index="3"]').click();
		cy.contains('Trade').click();
		cy.get('.card[data-type]').should('have.length', 20);
	})
});

describe('Play through age 2', () => {
	it('Displays player turn modal', () => {
		cy.get('.modal h2').should('have.text', 'Choose who will start this age:');
		cy.contains('Player 1').click();
		cy.get('.modal').should('not.exist');
	});

	it('Displays complex card costs', () => {
		cy.get('[data-index="26"]').click();
		cy.contains('Trade').click();

		cy.get('[data-index="27"]').click();
		cy.get('.modal .cost .pog').should('have.length', 3);
		cy.get('.modal .have .pog[data-enough]').should('have.length', 1);
	});

	it('Constructs a wonder, plays again', () => {
		cy.contains('Complete Mission').click();
		cy.contains('Buy for 2').click();
		cy.get('.player.you .score').should('have.text', '13 1');
		cy.get('.player.you[data-myturn]').should('exist');

		cy.get('[data-index="21"]').click();
		cy.contains('Trade').click();
	});

	it('Buys a card via links instead of resources or ingoo', () => {
		cy.get('[data-index="16"]').click();
		cy.get('.modal .cost .pog').should('have.length', 2);
		cy.get('.modal .have .pog').should('not.exist');
		cy.contains('Get for Free').click();

		cy.get('[data-index="10"]').click();
		cy.contains('Get for Free').click();
	});

	it('Buy matching science icon earns a token', () => {
		cy.get('[data-index="20"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="15"]').click();
		cy.contains('Buy for 2').click();

		cy.get('[data-index="19"]').click();
		cy.contains('Buy for 8').click();

		cy.get('.modal [data-id="economy"]').click();
		cy.get('.player.me .token[data-id="economy"]').should('exist');
		cy.get('aside.tokens .token[data-id="economy"][data-taken]').should('exist');

		cy.get('[data-index="9"]').click();
		cy.contains('Get for Free').click();

		cy.get('.modal [data-id="masonry"]').click();
		cy.get('.player.you .token[data-id="masonry"]').should('exist');
		cy.get('aside.tokens .token[data-id="masonry"][data-taken]').should('exist');
	});

	it('Civ token works', () => {
		cy.get('[data-index="13"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="14"]').click();
		cy.get('.modal small').should('have.text', 'You can disable 2 resources.');
		cy.get('.modal button[disabled]').should('have.text', 'Buy for 3');
		cy.get('.modal .cost [data-res="paper"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="6"]').click();
		cy.contains('Trade').click();

		cy.get('[data-index="4"]').click();
		cy.contains('Trade').click();
	});

	it('Selecting Levacaloo works', () => {
		cy.get('[data-index="8"]').click();
		cy.contains('Complete Mission').click();

		cy.get('.modal .cost .pog').should('have.length', 4);
		cy.get('.pog[data-res="paper"][data-enough]').should('exist');
		cy.contains('The Sand Kiln at Levacaloo').click();
		cy.get('.modal .cost .pog').should('have.length', 5);
		cy.get('.pog[data-res="stone"][data-enough]').should('exist');
		cy.contains('Buy for 8').click();
		cy.get('.modal .card-sm').should('have.length', 4);

		// Deletes the correct resource
		cy.get('.player.you .cards .card-sm').should('have.length', 12);
		cy.get('.modal .card-sm:last-child').click();
		cy.get('.player.you .cards .card-sm').should('have.length', 11);
		cy.get('.player.you .card-sm[data-type="wood] .extra').should('not.exist');
	});

	it('Economy token works', () => {
		cy.get('[data-index="7"]').click();
		cy.get('.player.me .score').should('have.text', '8 3');
		cy.contains('Buy for 2').click();
		cy.get('.player.me .score').should('have.text', '8 5');
	});

	it('Should jack up rice on wood', () => {
		cy.get('[data-index="0"]').click();
		cy.contains('Buy for 6');
		cy.contains('Complete Mission').click();
		cy.contains('Victors Will Feast').click();
		cy.contains('Buy for 3').click();

		cy.get('[data-index="5"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="3"]').click();
		cy.contains('Trade').click();
	});

	it('Should not hit negatives when war nukes coins', () => {
		cy.get('.player.you .score').should('have.text', '25 3');
		cy.get('.penalty.top-5').should('exist');
		cy.get('[data-index="1"]').click();
		cy.contains('Buy for 3').click();
		cy.get('.player.you .score').should('have.text', '25 0');
		cy.get('.penalty.top-5').should('not.exist');
	});

	it('Will load the last age, with 3 guild cards', () => {
		cy.get('[data-index="2"]').click();
		cy.contains('Trade').click();
		cy.get('.card[data-type]').should('have.length', 20);
		cy.get('.card[data-type="guild"]').should('have.length', 3);
	});
});

describe('Play through age 3', () => {
	it ('Shuffles in 3 Guild cards', () => {
		cy.contains('Player 1').click();
		cy.get('[data-type="guild"]').should('have.length', 3);
	});

	it('Instant Eco card gains ingoo/VP (Wonders)', () => {
		// Clear a few cards
		cy.get('[data-index="38"]').click();
		cy.contains('Buy for 7').click();

		cy.get('[data-index="31"]').click();
		cy.contains('Trade').click();

		// Get the actual eco card: 2 ingoo per wonder
		cy.get('[data-index="25"]').click();
		cy.get('.player.me .score').should('have.text', '8 4');
		cy.contains('Get for Free').click();
		cy.get('.player.me .score').should('have.text', '11 8');
	});

	it('Wonder provides resources', () => {
		cy.get('[data-index="39"]').click();
		cy.contains('Complete Mission').click();
		cy.contains('Buy for 2').click();
		cy.get('.player.you .mission[data-built]').should('have.length', 2);

		cy.get('[data-index="33"]').click();
		cy.contains('Trade').click();

		cy.get('[data-index="32"]').click();
		cy.get('.player.me .score').should('have.text', '11 10');
		cy.contains('Buy for 3').click();
		cy.get('.player.me .score').should('have.text', '14 9');


		cy.get('[data-index="26"]').click();
		cy.get('.player.you .score').should('have.text', '27 4');
		// Displays wonder provision
		cy.get('.modal .current .pog[data-type="wonder"]').should('have.length', 1);
		cy.get('.modal .current .pog[data-res="glass"]').should('have.length', 1);
		cy.get('.modal button[disabled]').should('have.text', 'Buy for 8');
		// Toggle provided resource
		cy.get('.modal .current .pog[data-type="wonder"]').click();
		cy.get('.modal .current .pog[data-res="paper"]').should('have.length', 1);
		cy.contains('Buy for 4').click();
		cy.get('.player.you .score').should('have.text', '30 3');
	});

	it('Destroy Coin ability works', () => {
		cy.get('[data-index="27"]').click();
		cy.contains('Buy for 2').click();

		cy.get('[data-index="19"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="13"]').click();
		cy.contains('Get for Free').click();

		cy.get('[data-index="14"]').click();
		cy.contains('Trade').click();

		cy.get('[data-index="28"]').click();
		cy.contains('Buy for 6').click();

		cy.get('[data-index="21"]').click();
		cy.contains('Complete Mission').click();
		cy.get('.modal .current .pog[data-type="wonder"]').click();
		cy.get('.player.me .score').should('have.text', '24 5');
		cy.contains('Buy for 5').click();
		// 5 - 3 ingoo = 2 ingoo but +5 from trade because of economy token
		cy.get('.player.me .score').should('have.text', '24 7');
	});

	it('Finish with a war victory', () => {
		cy.get('[data-index="15"]').click();
		cy.contains('Trade').click();

		cy.get('[data-index="16"]').click();
		cy.contains('Get for Free').click();

		cy.get('.table[data-winner] h3').should('have.text', 'Military Victory');
	});
});