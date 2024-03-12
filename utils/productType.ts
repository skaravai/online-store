import { Locator } from "@playwright/test";
import {Page} from "playwright";


export class Product {
    constructor(
        readonly locator: Locator,
        readonly name: string,
        readonly price: number,
        readonly hasDiscount: boolean
    ) {
    }
}

// todo move to page manager 
export class ProductFactory {
    async create(locator: Locator): Promise<Product> {
        return new Product(
            locator,
            await this.getName(locator),
            await this.parsePrice(locator),
            await this.hasDiscount(locator)
        )
    }

    async getName(locator: Locator) {
       return await locator.locator('.product_name').textContent()
    }

    async parsePrice(locator: Locator): Promise<number> {
        const match = (await locator.locator('.product_price').innerText()).match(/(\d+)/)

        return parseInt(match[0])
    }

    async hasDiscount(element: Locator): Promise<boolean> {
        const classList = await element.getAttribute('class')

        return classList!.split(' ').includes('hasDiscount');
    }
}

export class Cart {
    readonly items: CartItem[]
    private totalPrice: number = 0

    constructor() {
        this.items = []
    }

    add(product: Product, count: number = 1): CartItem {
        let item = new CartItem(product, count)

        this.items.push(item)
        this.totalPrice += product.price * count

        return item
    }

    containsProduct(product: Product): boolean {
        return this.items.findIndex(x => x.product.name === product.name) >= 0
    }

    getTotalPrice(): number {
        return this.totalPrice
    }
}

class CartItem {
    constructor(readonly product: Product, readonly count: number) {
    }
}

// todo move to page manager mainPage.ts !
export class UI {
    constructor(readonly page: Page) {
    }
    async buyProduct(product: Product, count: number = 1)  {
        await product.locator.locator('input[name="product-enter-count"]').fill(count.toString())
        await product.locator.locator('.actionBuyProduct').click()
    }

    async hasProduct(product:Product, count: number): Promise<boolean> {
        // 1. Открываем корзину
        // 2. По xpath проверяем
        this.page.locator('xpath://span[@class=\'basket-item-title\' and text() = "' + product.name + '"]/following-sibling::span[@class="basket-item-price" and contains(text(), \'' + product.price+ '\')]/following-sibling::span[contains(@class, \'basket-item-count\') and text() = ' + count + ']')

        return false
    }
}