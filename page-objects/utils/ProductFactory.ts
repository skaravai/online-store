import { Locator } from "@playwright/test";
import { Product } from "../../domain/entity/product";

export class ProductFactory {
    async create(locator: Locator): Promise<Product> {
        return new Product(
            await this.getName(locator),
            await this.parsePrice(locator),
            await this.hasDiscount(locator)
        )
    }

    private async getName(locator: Locator) {
        return await locator.locator('.product_name').textContent()
    }

    private async parsePrice(locator: Locator): Promise<number> {
        const match = (await locator.locator('.product_price').innerText()).match(/(\d+)/)

        return parseInt(match[0])
    }

    private async hasDiscount(element: Locator): Promise<boolean> {
        const classList = await element.getAttribute('class')

        return classList!.split(' ').includes('hasDiscount');
    }
}