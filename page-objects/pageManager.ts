import { Page } from "@playwright/test";
import { SignInPage } from "./pages/signInPage";
import { MainPage } from "./pages/mainPage";
import { BasketPopupComponent } from "./components/navbar/basketPopupComponent";

export class PageManager {

    private readonly page: Page
    private readonly signInPage: SignInPage
    private readonly mainPage: MainPage
    private readonly navbarPage: BasketPopupComponent
    private readonly cartPage: BasketPopupComponent

    constructor(page: Page) {
        this.page = page
        this.signInPage = new SignInPage(this.page)
        this.mainPage = new MainPage(this.page)
        this.navbarPage = new BasketPopupComponent(this.page)
        this.cartPage = new BasketPopupComponent(this.page)
    }

    onMainPage() {
        return this.mainPage
    }

    onSignInPage() {
        return this.signInPage
    }

    onNavbar(){
        return this.navbarPage
    }

    onCartPage() {
        return this.cartPage
    }
}