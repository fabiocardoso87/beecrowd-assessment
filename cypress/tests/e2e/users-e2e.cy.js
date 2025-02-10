const uiBaseUrl = Cypress.config('uiBaseUrl');
import { faker } from '@faker-js/faker';

describe('User Web Tests', () => {
    it('should create a new user and successfully log in', () => {
        const randomName = `beecrowd-${faker.person.fullName()}`;
        const randomEmail = `beecrowd${Date.now()}@example.com`;
        const randomPassword = faker.internet.password();

        cy.visit(uiBaseUrl);
        cy.createUserUi(randomName, randomEmail, randomPassword).then(() => {
            cy.get('.alert-link').should('contain', 'Cadastro realizado com sucesso');

            cy.visit(uiBaseUrl + '/login');
            cy.login(randomEmail, randomPassword);
            cy.get('.App').should('exist');
            cy.get('h1').contains('Serverest Store');
        });
    });

    it('should register and log a user via API, and verify UI homepage elements', () => {
        const user = {
            nome: `beecrowd-${Date.now()}`,
            email: `beecrowd${Date.now()}@example.com`,
            password: faker.internet.password(),
            administrador: "false"
        };

        cy.createUserAndLogin(user).then((loginResponse) => {
            cy.log(`Generated Password: ${user.password}`);
            expect(loginResponse.status).to.eq(200);
            cy.visit(`${uiBaseUrl}/home`);
            cy.get('h1').contains('Serverest Store');
            cy.validateNavbar();
        });
    });

    // TODO: Implement the "Add to Cart" functionality – Partially implemented due to tool limitations (technical challenge).
    it('should add a random product to the cart', () => {
        const user = {
            nome: `beecrowd-${Date.now()}`,
            email: `beecrowd${Date.now()}@example.com`,
            password: faker.internet.password(),
            administrador: "false"
        };

        cy.createUserAndLogin(user).then((loginResponse) => {
            cy.log(`Generated Password: ${user.password}`);
            expect(loginResponse.status).to.eq(200);
            cy.visit(`${uiBaseUrl}/home`);
        });

        cy.get('.container-fluid').should('exist');
        cy.get('[data-testid="adicionarNaLista"]').first().click();
    });
});