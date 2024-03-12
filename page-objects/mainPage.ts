import { Locator, Page } from "@playwright/test";
import { Product } from "../utils/productType";
import selectors from '../utils/selectors.json'

export class MainPage {

    readonly page: Page

    readonly firstNonDiscountItem: Locator //delete
    readonly firstDiscountItem: Locator //deleteк
    readonly cleanTheBasketButton: Locator
    readonly basketDropDownMenu: Locator //
    readonly BASKET_AMOUNT_OF_ITEMS = '#basketContainer .basket-count-items' //2
    readonly basketAmountOfItems: Locator //1

    constructor(page: Page) {
        this.page = page
        this.firstDiscountItem = page.locator('.note-list .note-item.hasDiscount').locator('.actionBuyProduct').first()
        this.firstNonDiscountItem = page.locator('.note-list .note-item:not(.hasDiscount)').first()
        this.cleanTheBasketButton = page.locator('.btn-danger')
        this.basketAmountOfItems = page.locator('#basketContainer .basket-count-items')
        this.basketDropDownMenu = page.locator('.dropdown-menu.show')
    }

    async basketIconClick() {
        await this.page.locator((selectors.mainPage.dropdownBasket)).click()
    }

    async clickTest() {
        await this.page.locator(selectors.mainPage.dropdownBasket).click()
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

        // 2. По xpath проверяем
        this.page.locator('xpath://span[@class=\'basket-item-title\' and text() = "' + product.name + '"]/following-sibling::span[@class="basket-item-price" and contains(text(), \'' + product.price+ '\')]/following-sibling::span[contains(@class, \'basket-item-count\') and text() = ' + count + ']')

        return false
    }
}