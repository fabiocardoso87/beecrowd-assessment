const apiBaseUrl = Cypress.config('apiBaseUrl');

// API commands
Cypress.Commands.add('getUserByEmail', (email) => {
    return cy.request('GET', `${apiBaseUrl}/usuarios`).then((response) => {
        expect(response.status).to.equal(200);
        const user = response.body.usuarios.find((u) => u.email === email);
        expect(user).to.not.be.undefined;
        return user;
    });
});

Cypress.Commands.add('createUser', (userData) => {
    return cy.request('POST', `${apiBaseUrl}/usuarios`, userData).then((response) => {
        return response;
    });
});

Cypress.Commands.add('createUserAndLogin', (userData) => {
    return cy.request('POST', `${apiBaseUrl}/usuarios`, userData).then(() => {
        return cy.request('POST', `${apiBaseUrl}/login`, {
            email: userData.email,
            password: userData.password
        }).then((response) => {
            window.localStorage.setItem('serverest/userToken', response.body.authorization);
        });
    });
});

Cypress.Commands.add('deleteUser', (userId) => {
    return cy.request('DELETE', `${apiBaseUrl}/usuarios/${userId}`);
});


// UI commands
Cypress.Commands.add('login', (email, password) => {
    cy.get('[data-testid=email]').type(email);
    cy.get('[data-testid=senha]').type(password);
    cy.get('[data-testid=entrar]').click();
});

Cypress.Commands.add('createUserUi', (randomName, randomEmail, randomPassword) => {
    cy.get('.login-page.container').should('exist');
    cy.get('.form').should('exist');

    cy.get('[data-testid="cadastrar"]').click();
    cy.get('[data-testid="nome"]').type(randomName);
    cy.get('[data-testid="email"]').type(randomEmail);
    cy.get('[data-testid="password"]').type(randomPassword);
    cy.get('[data-testid="cadastrar"]').click();

    return cy.wrap({ randomName, randomEmail, randomPassword });

});

Cypress.Commands.add('validateNavbar', () => {
    const expectedItems = ['Home', 'Lista de Compras', 'Carrinho'];
    cy.get('.navbar-nav').within(() => {
        expectedItems.forEach(item => {
            cy.contains('.nav-item', item).should('exist');
        });
    });
});