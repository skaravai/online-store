import { Page } from "@playwright/test";
import selectors from "../../utils/selectors.json";
import { Product } from "../../../domain/entity/product";

export class BasketPopupComponent {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async clean() {
        if (await this.getItemsAmount() == 0) {
            return
        }

        await this.openBasketPopup()
        await this.page.locator(selectors.basketPopupComponent.cleanTheBasketButton).click()
    }

    async openBasketPopup(){
        await this.page.locator(selectors.basketPopupComponent.dropdownBasket).click()
        await this.page.waitForSelector('[aria-labelledby="dropdownBasket"].show')
    }

    async openBasketPage() {
        await this.page.locator(selectors.basketPopupComponent.goToTheBasketButton).click()
    }

    // @deprecated
    async waitForItemsAmountChanging(initialAmount: Number) {
        await this.page.waitForFunction(
            ({initialAmount, selectors})  => {
                const currentAmount = Number(document.querySelector(selectors.basketPopupComponent.basketItemsAmount)?.textContent);
                return currentAmount && currentAmount !== initialAmount;
            },
            {initialAmount: initialAmount, selectors: selectors},
            {timeout: 20000}
        );
    }

    async getItemsAmount(): Promise<Number> {
        const amount = await this.page.textContent(selectors.basketPopupComponent.basketItemsAmount)

        return Number(amount)
    }

    async hasProduct(product:Product, count: number): Promise<boolean> {
        const products = this.page.locator('//span[@class=\'basket-item-title\' and text() = "' + product.name + '"]/following-sibling::span[@class="basket-item-price" and contains(text(), \'' + product.price+ '\')]/following-sibling::span[contains(@class, \'basket-item-count\') and text() = ' + count + ']')

        return await products.count() > 0
    }

    async getTotalPrice(): Promise<Number> {
        const totalPrice = await this.page.locator('#basketContainer .basket_price').textContent()

        return parseInt(totalPrice)
    }
}