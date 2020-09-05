describe('Play through a full game', () => {
	it('Starts the game', () => {
		// Loads main page
		cy.visit('/');

		// Start game by choosing missions
		cy.contains('Start Game').click();
		cy.get('.mission').should('have.length', 4);
		cy.get('h2').should('have.text', 'Player 1 Select a Mission:');
		cy.contains('The Bone-Pit Riots').click();
		cy.contains('Defense of the Cold Mark').click();
		cy.contains('Fuel of Firebrand').click();
		cy.contains('The Sand Kiln at Levacaloo').click();

		// Changes to 2nd set of missions, starts with Player 2
		cy.get('h2').should('have.text', 'Player 2 Select a Mission:');
		cy.get('.mission').should('have.length', 8);
		cy.contains('Frozen in Noe').click();
		cy.contains('Victors Will Feast').click();
		cy.contains('Sage Marrow Speaks').click();
		cy.contains('What Might Be').click();

		// Loads cards in Age 1
		cy.get('.card[data-type]').should('have.length', 20);
		cy.get('.card[data-sci="quill"]').should('exist');
		cy.get('.card[data-sci="level"]').should('exist');
	});

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
		cy.get('.modal .cost').should('have.text', 'You Need: 0 Food ');
		cy.get('.player.me .score .food').should('have.text', '7');
		cy.contains('Get for Free').click();
		cy.get('.player.me .score .food').should('have.text', '7');

		// Card displays in player bar
		cy.get('.player.me .cards .card-sm')
			.should('have.length', 1)
			.should('have.text', ' m ');

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