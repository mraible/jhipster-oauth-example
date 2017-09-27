import { browser, element, by, protractor, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage} from './../page-objects/jhi-page-objects';

describe('account', () => {

    let navBarPage: NavBarPage;
    let signInPage: SignInPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage(true);
        browser.waitForAngular();
    });

    it('should fail to login with bad password', () => {
        const expect1 = /Welcome, Java Hipster!/;
        element.all(by.css('h1')).first().getText().then((value) => {
            expect(value).toMatch(expect1);
        });
        signInPage = navBarPage.getSignInPage();
        signInPage.loginWithOAuth('admin', 'foo');

        // Keycloak
        const alert = element.all(by.css('.alert-error'));
        alert.isPresent().then((result) => {
            if (result) {
                expect(alert.first().getText()).toMatch("Invalid username or password.");
            } else {
                // Okta
                const error = element.all(by.css('.infobox-error')).first();
                browser.wait(ec.visibilityOf(error), 2000).then(() => {
                    expect(error.getText()).toMatch("Sign in failed!");
                });
            }
        });
    });

    it('should login successfully with admin account', () => {
        signInPage.clearUserName();
        signInPage.setUserName('admin');
        signInPage.clearPassword();
        signInPage.setPassword('admin');
        signInPage.login();

        browser.waitForAngular();

        const expect2 = /You are logged in as user "admin"/;
        const success = element.all(by.css('.alert-success span')).first();
        browser.wait(ec.visibilityOf(success), 5000).then(() => {
            success.getText().then((value) => {
                expect(value).toMatch(expect2);
            });
        });

        navBarPage.autoSignOut();
    });
});
