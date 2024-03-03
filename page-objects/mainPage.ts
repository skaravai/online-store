import { Locator, Page } from "@playwright/test";

export class MainPage {

    readonly page: Page
    readonly buyButton: Locator
    readonly amountInput: Locator
    readonly firstNonDiscountItem: Locator
    readonly firstDiscountItem: Locator
    readonly basketLink: Locator
    readonly basketCount: Locator
    readonly cleanTheBasketButton: Locator
    readonly goToTheBasketButton: Locator
    readonly amountInputDiscountItem: Locator
    readonly BASKET_AMOUNT_OF_ITEMS = '#basketContainer .basket-count-items'

    constructor(page: Page) {
        this.page = page
        this.buyButton = page.locator('')
        this.amountInput = page.locator('')
        this.firstDiscountItem = page.locator('.note-list .note-item.hasDiscount').locator('.actionBuyProduct').first()
        this.firstNonDiscountItem = page.locator('.note-list .note-item:not(.hasDiscount)').locator('.actionBuyProduct').first()
        this.basketLink = page.locator('#dropdownBasket')
        this.basketCount = page.locator('#basketContainer').locator('.basket-count-items').first()
        this.cleanTheBasketButton = page.locator('.btn-danger')
        this.goToTheBasketButton = page.locator('a[href="/basket"]')
        this.amountInputDiscountItem = page.locator('div.note-list .input-group.mt-3 input').first()
    }

    async basketLinkClick() {
        await this.basketLink.click()
    }

    async buyDiscountProduct() {
        await this.firstDiscountItem.click()
    }

    async enterAmountOfDiscountItems(amount: Number) {
        this.amountInputDiscountItem.fill(amount.toString())
    }

    async buyNonDiscountProduct() {
        await this.firstNonDiscountItem.click()
    }

    async getAmountOfItems(): Promise<number> {
        const textContent = await this.basketCount.textContent();
        return Number(textContent?.trim());
    }

    async cleanTheBasket() {
        //this.basketLinkClick()
        await this.cleanTheBasketButton.click()
    }

    async goToTheBasket() {
        await this.goToTheBasketButton.click()
    }

    async addProductToBasket(product: Locator) {
        await product.locator('.actionBuyProduct').first().click()
    }

    async waitForAmountChanging(initialAmount: Number): Promise<Number> {

        await this.page.waitForFunction(
            (initialAmount) => {
                const currentAmount = Number(document.querySelector('#basketContainer .basket-count-items')?.textContent);
                return currentAmount && currentAmount !== initialAmount;
            },
            initialAmount,
            { timeout: 20000 }
        );

        const updatedAmount = await this.page.textContent(this.BASKET_AMOUNT_OF_ITEMS)
        return Number(updatedAmount)
    }

    async searchProduct() {

    }
}