import LoginPage from "cypress/page-objects/Login";
import NavigationBar from "cypress/page-objects/NavigationBar";

const login = new LoginPage();
const navigationBar = new NavigationBar();

describe('Login functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        navigationBar.navigateToLogin();
    });

    it('should display an error message when user attempts to login with a correct email but an incorrect password', () => {
        cy.get(login.loginModalLabel).should('be.visible');
        login.submitLogin(Cypress.env('USERNAME'), '0a0a0a0a0a');
        cy.window().then(win => {
            cy.stub(win, 'alert').as('alert');
        });
        cy.get('@alert').should('have.been.calledWith', 'Wrong password.');

        // Assert that an error message as below is displayed when password is incorrect
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Wrong password.');
        });
    });

    it('should display an error message when user attempts to login with empty username and password', () => {
        cy.get(login.loginModalLabel).should('be.visible');
        login.submitLogin('        ', '        ');
        cy.window().then(win => {
            cy.stub(win, 'alert').as('alert');
        });
        
        cy.wait(1000);

        cy.get('@alert').should('not.have.been.calledWith', 'Wrong password.');

        // Assert that error message displayed should be not equal with wrong password but with incorrect email and password format
        cy.on('window:alert', (str) => {
            expect(str).to.not.equal('Wrong password.');
        });
    });

    it('should allow the user to login when user enters valid credentials', () => {
        cy.get(login.loginModalLabel).should('be.visible');
        login.submitLogin(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
        // Assert that a welcome message is displayed when user login successfully
        cy.get(login.welcomeMessageSelector).should('be.visible').should('have.text', `Welcome ${Cypress.env('USERNAME')}`);
    });
});
