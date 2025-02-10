const apiBaseUrl = Cypress.config('apiBaseUrl');
import { faker } from '@faker-js/faker';

describe('User API Tests', () => {
  it('should retrieve a list of users successfully', () => {
    cy.request('GET', `${apiBaseUrl}/usuarios`).then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.usuarios).to.be.an('array');
      expect(res.body.usuarios.length).to.be.greaterThan(0);
      expect(res.body.usuarios[0]).to.have.property('nome');
      expect(res.body.usuarios[0]).to.have.property('email');
    });
  });

  it('Should create a user and log in', () => {
    const user = {
      nome: `beecrowd-${Date.now()}`,
      email: `beecrowd${Date.now()}@example.com`,
      password: faker.internet.password(),
      administrador: "false"
    };

    cy.createUserAndLogin(user).then((loginResponse) => {
      cy.log(`Generated Password: ${user.password}`);
      expect(loginResponse.status).to.eq(200);
    });
  });

  it('should create an admin user and validate the response', () => {
    const randomEmail = `user${Date.now()}@example.com`;
    const randomPassword = faker.internet.password();

    cy.createUser({
      nome: 'Fabio Test',
      email: randomEmail,
      password: randomPassword,
      administrador: 'true',
    }).then((res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('should create a new user and validate its existence', () => {
    const randomEmail = `user${Date.now()}@example.com`;
    const randomPassword = faker.internet.password();

    const userData = {
      nome: 'Test User',
      email: randomEmail,
      password: randomPassword,
      administrador: 'true',
    };

    cy.createUser(userData).then((res) => {
      const userId = res._id;
      cy.getUserByEmail(userData.email).then((user) => {
        expect(user.nome).to.equal(userData.nome);
        expect(user.email).to.equal(userData.email);
      });
    });
  });

  it('should create and delete a user', () => {
    const randomEmail = `user${Date.now()}@example.com`;
    const randomPassword = faker.internet.password();

    cy.createUser({
      nome: 'Test User',
      email: randomEmail,
      password: randomPassword,
      administrador: 'true',
    }).then((res) => {
      expect(res.status).to.equal(201);
      const userId = res.body._id;
      cy.deleteUser(userId).then((delRes) => {
        expect(delRes.status).to.equal(200);
      });
    });
  });
});