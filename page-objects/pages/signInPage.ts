import { Locator, Page } from "@playwright/test";

export class SignInPage {

    readonly page: Page
    readonly loginInput: Locator 
    readonly passwordInput: Locator
    readonly signInButton: Locator

    constructor(page: Page) {
        this.page = page
        this.loginInput = page.locator('#loginform-username')
        this.passwordInput = page.locator('#loginform-password')
        this.signInButton = page.locator('#login-form').locator('button[name=login-button]') 
    }

    async signInToAccount(login: string, password: string) {
        await this.enterLogin(login)
        await this.enterPassword(password)
        await this.signInButtonClick()
    }

    async enterLogin(email: string) {
        await this.loginInput.pressSequentially(email)
    }

    async enterPassword(password: string) {
        await this.passwordInput.pressSequentially(password)
    }

    async signInButtonClick() {
        await this.signInButton.click()
    }
}