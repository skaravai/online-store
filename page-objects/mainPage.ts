import { Page } from "@playwright/test";
import { Product } from "../utils/productType";
import selectors from '../utils/selectors.json'

export class MainPage {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async basketIconClick() {
        await this.page.locator((selectors.mainPage.dropdownBasket)).click()
    }

    async cleanTheBasket() {
        await this.page.locator(selectors.mainPage.cleanTheBasketButton).click()
    }

    async goToTheBasketPage() {
        await this.page.locator(selectors.mainPage.goToTheBasketButton).click()
    }

    async waitForAmountChanging(initialAmount: Number) {
        await this.page.waitForFunction(
            ({initialAmount, selectors})  => {
                const currentAmount = Number(document.querySelector(selectors.mainPage.basketItemsAmount)?.textContent);
                return currentAmount && currentAmount !== initialAmount;
            },
            {initialAmount: initialAmount, selectors: selectors},
            {timeout: 20000}
        );
    }

    async getBasketAmount(): Promise<Number> {
        const amount = await this.page.textContent(selectors.mainPage.basketItemsAmount)
        return Number(amount)
    }

    async buyProduct(product: Product, count: number = 1)  {
        await product.locator.locator(selectors.mainPage.productCard.amountInput).fill(count.toString())
        await product.locator.locator(selectors.mainPage.productCard.buyButton).click()
    }

    async hasProduct(product:Product, count: number): Promise<boolean> {
        // 1. Открываем корзину
        // 2. По xpath проверяем содержимое
        this.page.locator('xpath://span[@class=\'basket-item-title\' and text() = "' + product.name + '"]/following-sibling::span[@class="basket-item-price" and contains(text(), \'' + product.price+ '\')]/following-sibling::span[contains(@class, \'basket-item-count\') and text() = ' + count + ']')

        return false
    }
}