import { test, expect } from '../fixtures/my-test';
import * as users from "../data/credentials.json";
import {Product} from "../domain/entity/product"
import selectors from '../page-objects/utils/selectors.json'


test.describe("Shopping Cart Feature. @cart", async () => {
    test.beforeEach(async ({ page, signInPage, basketPopupComponent }) => {

        await page.goto('https://enotes.pointschool.ru/login'); //move to baseURL
        await expect(page).toHaveURL('https://enotes.pointschool.ru/login')
        await signInPage.signInToAccount(users.standard.login, users.standard.password)
        await expect(page).toHaveURL('https://enotes.pointschool.ru/')
        await basketPopupComponent.clean()

    })

    test('1. Opening an empty shopping cart.', async ({ page, mainPage, basketPopupComponent  }) => {
        await basketPopupComponent.openBasketPopup()
        await expect(page.locator('[aria-labelledby="dropdownBasket"].show')).toBeVisible()
        // await expect(page.locator(selectors.mainPage.basketDropDownMenu)).toBeVisible()

        await basketPopupComponent.openBasketPage()
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')

    });

    test('2. Opening the shopping cart with 1 non-promotional item.', async ({ page, mainPage, basketPopupComponent }) => {
        let product: Product

        for await (let productLocator of mainPage.iterateOverAllProducts(selectors.mainPage.nonDiscountItem)) {
            product = await mainPage.addProduct(productLocator)
            break
        }

        expect(product).not.toBeNull()

        await page.waitForTimeout(2000) // ждем пока отработает добавление товара в корзину и обновится счетчик в корзине

        expect(await basketPopupComponent.getItemsAmount()).toEqual(1)

        await basketPopupComponent.openBasketPopup()

        await expect(page.locator(selectors.mainPage.basketDropDownMenu)).toBeVisible()

        for (let item of mainPage.cart.items) {
            let productExists = await basketPopupComponent.hasProduct(item.product, item.count)

            expect(productExists, "product not found: " + item).toBeTruthy()
        }

        // check total price with our cart total price
        expect(await basketPopupComponent.getTotalPrice()).toEqual(mainPage.cart.getTotalPrice())

        await basketPopupComponent.openBasketPage()

        await expect(page).toHaveURL('https://enotes.pointschool.ru/basket')
    });

    test('3. Opening the shopping cart with 1 promotional item.', async ({ page, mainPage, basketPopupComponent  }) => {
        await mainPage.showOnlyWithDiscountClick()
        const product = await mainPage.addFirstProduct()

        expect(product).not.toBeNull()

        await page.waitForTimeout(2000) // ждем пока отработает добавление товара в корзину и обновится счетчик в корзине

        expect(await basketPopupComponent.getItemsAmount()).toEqual(1)

        await basketPopupComponent.openBasketPopup()

        await expect(page.locator(selectors.mainPage.basketDropDownMenu)).toBeVisible()

        for (let item of mainPage.cart.items) {
            let productExists = await basketPopupComponent.hasProduct(item.product, item.count)

            expect(productExists, "product not found: " + item).toBeTruthy()
        }

        // check total price with our cart total price
        expect(await basketPopupComponent.getTotalPrice()).toEqual(mainPage.cart.getTotalPrice())

        await basketPopupComponent.openBasketPage()

        await expect(page).toHaveURL('https://enotes.pointschool.ru/basket')
    });

    test('4. Добавление 9 разных товаров', async ({ page, mainPage, basketPopupComponent }) => {
        const UNIQUE_PRODUCT_AMOUNT = 9

        // 1. Add product with discount
        await mainPage.showOnlyWithDiscountClick()
        await mainPage.addFirstProduct()
        await mainPage.showOnlyWithDiscountClick()

        // 2. Add 8 unique products
        for await (let productLocator of mainPage.iterateOverAllProducts('.note-list .note-item')) {
            await mainPage.addUniqueProduct(productLocator)

            if (mainPage.cart.items.length == UNIQUE_PRODUCT_AMOUNT){
                break;
            }
        }

        await page.waitForTimeout(2000) // ждем пока отработает добавление товара в корзину и обновится счетчик в корзине

        expect(await basketPopupComponent.getItemsAmount()).toEqual(9)

        await basketPopupComponent.openBasketPopup()

        await expect(page.locator(selectors.mainPage.basketDropDownMenu)).toBeVisible()

        for (let item of mainPage.cart.items) {
            let productExists = await basketPopupComponent.hasProduct(item.product, item.count)

            expect(productExists, "product not found: " + item).toBeTruthy()
        }

        // check total price with our cart total price
        expect(await basketPopupComponent.getTotalPrice()).toEqual(mainPage.cart.getTotalPrice())

        await basketPopupComponent.openBasketPage()

        await expect(page).toHaveURL('https://enotes.pointschool.ru/basket')
    });

    test('5. Opening the shopping cart with 9 promotional item.', async ({ page, mainPage, basketPopupComponent }) => {

        await mainPage.showOnlyWithDiscountClick()
        const product = await mainPage.addFirstProduct(9)

        expect(product).not.toBeNull()

        await page.waitForTimeout(2000) // ждем пока отработает добавление товара в корзину и обновится счетчик в корзине

        expect(await basketPopupComponent.getItemsAmount()).toEqual(9)

        await basketPopupComponent.openBasketPopup()

        await expect(page.locator(selectors.mainPage.basketDropDownMenu)).toBeVisible()

        for (let item of mainPage.cart.items) {
            let productExists = await basketPopupComponent.hasProduct(item.product, item.count)

            expect(productExists, "product not found: " + item).toBeTruthy()
        }

        // check total price with our cart total price
        expect(await basketPopupComponent.getTotalPrice()).toEqual(mainPage.cart.getTotalPrice())

        await basketPopupComponent.openBasketPage()

        await expect(page).toHaveURL('https://enotes.pointschool.ru/basket')

    });
})

