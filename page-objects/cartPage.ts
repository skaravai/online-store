import { Locator, Page } from "@playwright/test";

export class CartPage {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }
}