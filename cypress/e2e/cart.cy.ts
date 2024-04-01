import NavigationBar from "cypress/page-objects/NavigationBar";
import ProductsPage from "cypress/page-objects/Products";
import CartPage from "cypress/page-objects/Cart";

const navigationBar = new NavigationBar();
const products = new ProductsPage();
const cart = new CartPage();

describe('Product cart functionality', () => {
    beforeEach(() => {
        cy.login(Cypress.env('USERNAME'), Cypress.env('PASSWORD'));
    });

    it('should allow the user to add and delete a product from the cart', () => {
        products.selectCategorie('Monitors');
        products.selectProduct('Apple monitor 24');
        cy.get(products.productName).should('have.text', 'Apple monitor 24');
        cy.get(products.productPrice).should('have.text', '$400 *includes tax');
        cy.get(products.productDescription).should('not.be.empty');
        products.addToCart();

        cy.window().then(win => {
            cy.stub(win, 'alert').as('alert');
        });
        cy.get('@alert').should('have.been.calledWith', 'Product added.');

        // Assert that the information message below is displayed when product is added successfully to the cart
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Product added.');
        });

        navigationBar.navigateToCart();

        // Verify that product is added into the cart
        cy.get(cart.productName).should('have.text', 'Apple monitor 24');
        cy.get(cart.productPrice).should('have.text', '400');
        cy.get(cart.totalCartPrice).should('have.text', '400');
        cart.deleteProductFromCart();
        // Verify that product is removed from the cart when deleted
        cy.get(cart.tableOfProducts).should('not.exist');
    });

    it('should allow the user to purchase a product', () => {
        products.selectCategorie('Monitors');
        products.selectProduct('Apple monitor 24');
        cy.get(products.productName).should('have.text', 'Apple monitor 24');
        cy.get(products.productPrice).should('have.text', '$400 *includes tax');
        cy.get(products.productDescription).should('not.be.empty');
        products.addToCart();

        cy.window().then(win => {
            cy.stub(win, 'alert').as('alert');
        });
        cy.get('@alert').should('have.been.calledWith', 'Product added.');

        // Assert that the information message below is displayed when product is added successfully to the cart
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Product added.');
        });

        navigationBar.navigateToCart();
        // Verify that product is added into the cart
        cy.get(cart.productName).should('have.text', 'Apple monitor 24');
        cy.get(cart.productPrice).should('have.text', '400');
        cy.get(cart.totalCartPrice).should('have.text', '400');
        
        cart.placeOrder();
        cart.typeClientName('Ylber');
        cart.typeCountry('Kosovo');
        cart.typeCity('Vushtrri');
        cart.typeCreditCard('0000-0000-0000-0000');
        cart.typeMonth('April');
        cart.typeYear('2024');
        cart.purchaseOrder();

        // Verify that user has successfully purchased a product
        cy.get(cart.purchaseConfirmationSelector).should('have.text', 'Thank you for your purchase!');
        cy.get(cart.okButton).click();
    });
});
