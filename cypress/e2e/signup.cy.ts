import SignupPage from "cypress/page-objects/Signup";
import LoginPage from "cypress/page-objects/Login";
import { faker } from '@faker-js/faker';

const signup = new SignupPage();
const login = new LoginPage();

describe('Signup functionality', () => {
    let generatedEmail: string;
    let generatedPassword: string;

    it('should allow the user to sign up or create an account', () => {
        generatedEmail = faker.internet.email();
        generatedPassword = faker.internet.password();
        
        signup.createAccount(generatedEmail, generatedPassword);

        // Assert that a success message is displayed when user successfully creates an account
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Sign up successful.');
        });

        cy.writeFile('cypress/fixtures/randomCredentials.json', { generatedEmail, generatedPassword });
        cy.wait(5000);
    });

    it('should allow the user to login with already created account', () => {
        cy.readFile('cypress/fixtures/randomCredentials.json').then((data) => {
            // Use the saved email and password
            cy.login(data.generatedEmail, data.generatedPassword);
            cy.get(login.welcomeMessageSelector).should('be.visible').should('have.text', `Welcome ${data.generatedEmail}`);
        });
    });
});
