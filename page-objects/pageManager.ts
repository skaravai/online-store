import { Page } from "@playwright/test";
import { SignInPage } from "./signInPage";
import { MainPage } from "./mainPage";
import { CartPage } from "./cartPage";

export class PageManager {

    private readonly page: Page
    private readonly signInPage: SignInPage
    private readonly mainPage: MainPage
    private readonly cartPage: CartPage

    constructor(page: Page) {
        this.page = page
        this.signInPage = new SignInPage(this.page)
        this.mainPage = new MainPage(this.page)
        this.cartPage = new CartPage(this.page)
    }

    onMainPage() {
        return this.mainPage
    }

    onSignInPage() {
        return this.signInPage
    }

    onCartPage() {
        return this.cartPage
    }
}