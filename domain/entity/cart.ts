import {Product} from "./product";

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

    public toString(): string {
        return `${this.product} - ${this.count}`
    }
}