export class Product {
    constructor(readonly name: string, readonly price: number, readonly hasDiscount: boolean) {
    }

    public toString(): string {
        return `${this.name} - ${this.price} р.`
    }
}