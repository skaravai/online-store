import {Locator, Page} from "@playwright/test";
import selectors from '../utils/selectors.json'
import {Cart} from "../../domain/entity/cart";
import {ProductFactory} from "../utils/ProductFactory";
import {Product} from "../../domain/entity/product";

export class MainPage {
    readonly page: Page
    readonly cart: Cart
    private readonly productFactory: ProductFactory

    constructor(page: Page) {
        this.page = page
        this.cart = new Cart()
        this.productFactory = new ProductFactory()
    }

    async showOnlyWithDiscountClick() {
        await this.page.locator(selectors.mainPage.showOnlyWithDiscountCheckbox).click()
        await this.page.waitForResponse("https://enotes.pointschool.ru/basket/get")
        //await this.page.waitForTimeout(5000) // wait for render after ajax call
    }

    async addFirstProduct(amount: number = 1): Promise<Product>  {
        return await this.addProduct(this.page.locator('.note-list .note-item').first(), amount)
    }

    async addProduct(productLocator: Locator, amount: number = 1): Promise<Product> {
        const product = await this.productFactory.create(productLocator)

        this.cart.add(product, amount)
        await this.buyProduct(productLocator, amount)

        return product
    }

    async addUniqueProduct(productLocator: Locator, amount: number = 1) {
        const product = await this.productFactory.create(productLocator)

        if (this.cart.containsProduct(product)) {
            console.log("product not unique", product)
            return
        }

        await this.addProduct(productLocator, amount)
    }

    async hasNextPage(): Promise<boolean> {
        const nextPage = this.page.locator('.page-item.active+li.page-item')

        return await nextPage.count() > 0
    }

    async navigateToNextPage() {
        const nextPage = this.page.locator('.page-item.active+li.page-item')

        await nextPage.click()

        await this.page.waitForTimeout(5000)
    }

    async *iterateOverAllProducts(selector: string) {
        await this.page.waitForSelector(selector)

        while (true) {
            let productLocators = await this.page.locator(selector).all()

            for (let productLocator of productLocators) {
                yield productLocator
            }

            if (! await this.hasNextPage()) {
                return
            }

            await this.navigateToNextPage()
        }
    }

    private async buyProduct(product: Locator, count: number = 1)  {
        await product.locator(selectors.mainPage.productCard.amountInput).fill(count.toString())
        await product.locator(selectors.mainPage.productCard.buyButton).click()
    }
}