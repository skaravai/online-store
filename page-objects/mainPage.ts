import { Locator, Page } from "@playwright/test";

export class MainPage {

    readonly page: Page
    readonly firstNonDiscountItem: Locator //delete
    readonly firstDiscountItem: Locator //delete
    readonly basketLink: Locator //надо ли удалять?
    readonly basketCount: Locator
    readonly cleanTheBasketButton: Locator 
    readonly goToTheBasketButton: Locator 
    readonly amountInputDiscountItem: Locator //delete
    readonly basketDropDownMenu: Locator //
    readonly dropdownMenuItemTitle: Locator //
    readonly dropdownMenuItemPrice: Locator //
    readonly dropdownMenuItemTotalPrice: Locator //

    readonly BASKET_AMOUNT_OF_ITEMS = '#basketContainer .basket-count-items' //2
    readonly basketAmountOfItems: Locator //1
    
    readonly NON_DISCOUNT_ITEM_PRICE = '.note-list .note-item:not(.hasDiscount) .product_price.ml-1'
    readonly NON_DISCOUNT_ITEM_NAME = '.note-list .note-item:not(.hasDiscount) .product_name.mb-auto'

    readonly DISCOUNT_ITEM_PRICE = '.note-list .note-item.hasDiscount .product_price.ml-1'
    readonly DISCOUNT_ITEM_NAME = '.note-list .note-item.hasDiscount .product_name.mb-auto'
    readonly PAGINATION_BLOCK = 'ul.pagination a.page-link'

    constructor(page: Page) {
        this.page = page

        this.firstDiscountItem = page.locator('.note-list .note-item.hasDiscount').locator('.actionBuyProduct').first()
        this.firstNonDiscountItem = page.locator('.note-list .note-item:not(.hasDiscount)').locator('.actionBuyProduct').first()

        this.basketLink = page.locator('#dropdownBasket')
        this.basketCount = page.locator('#basketContainer').locator('.basket-count-items').first()
        this.cleanTheBasketButton = page.locator('.btn-danger')
        this.goToTheBasketButton = page.locator('a[href="/basket"]')
        this.amountInputDiscountItem = page.locator('div.note-list .input-group.mt-3 input').first()
        this.basketAmountOfItems = page.locator('#basketContainer .basket-count-items')
        this.basketDropDownMenu = page.locator('.dropdown-menu.show')

        this.dropdownMenuItemTitle = page.locator('.dropdown-menu').locator('.basket-item-title')
        this.dropdownMenuItemPrice = page.locator('.basket-item-price')
        this.dropdownMenuItemTotalPrice = page.locator('.basket_price')
    }

    async basketLinkClick() {
        await this.basketLink.click()
    }

    //удалить
    async buyDiscountProduct() {
        await this.firstDiscountItem.click()
    }


    async enterAmountOfDiscountItems(amount: Number) {
        this.amountInputDiscountItem.fill(amount.toString())
    }

    // удалить
    async buyNonDiscountProduct() {
        await this.firstNonDiscountItem.click()
    }

    async getAmountOfItems(): Promise<number> {
        const textContent = await this.basketCount.textContent();
        return Number(textContent?.trim());
    }

    async cleanTheBasket() {
        await this.cleanTheBasketButton.click()
    }

    async goToTheBasket() {
        await this.goToTheBasketButton.click()
    }

    async addProductToBasket(product: ProductOLD) {
        await product.locator!.locator('.actionBuyProduct').click()
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

    async openNextPage(){
        
        // await this.page.waitForSelector(this.PAGINATION_BLOCK, { timeout: 5000 });
        // const pageLinks = await this.page.$$(this.PAGINATION_BLOCK);

        const element = await this.page.$('ul.pagination .page-link:text("2")');

        if (element) {
          // Кликаем на найденный элемент
          await element.click();
        } else {
          console.error('Элемент не найден');
        }
    }

    readonly productsCollection: ProductOLD[] = [];

    async parseProductInfo(element: Locator): Promise<ProductOLD> {
        
        const test = (await element.locator('.product_price').innerText()).match(/\d+/)
        const finalPrice = test ? parseInt(test[0]) : NaN;

         return {
            name: await element.locator('.product_name')?.textContent(),
            price: finalPrice,
            hasDiscount: await this.checkElementClass(element, 'hasDiscount'),
            availableAmount: + (await element.locator('.product_count')?.textContent())!,
            locator: element
        } as ProductOLD;
    
    }  

    async saveProductToCollection(product: ProductOLD) {
        this.productsCollection.push(product);
    }

    async checkElementClass(element: Locator, className: string): Promise<boolean> {
        
        const classList = await element.getAttribute('class')
        
        return classList!.split(' ').includes(className);
    }
}