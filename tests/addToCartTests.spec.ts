import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/pageManager'
import * as users from "../data/credentials.json";
import {Cart, ProductFactory} from "../utils/productType"
import selectors from '../utils/selectors.json'


test.describe("Shopping Cart Feature. @cart", async () => {

    let pm: PageManager;

    test.beforeEach(async ({ page }) => {

        pm = new PageManager(page);
        await page.goto('https://enotes.pointschool.ru/login');
        await pm.onSignInPage().signInToAccount(users.standard.login, users.standard.password)
        expect(page.url()).toContain('https://enotes.pointschool.ru/')

    })

    test('1. Opening an empty shopping cart.', async ({ page }) => {

        await pm.onMainPage().basketIconClick()
        await expect(page.locator(selectors.mainPage.basketDropDownMenu)).toBeVisible()

        await pm.onMainPage().goToTheBasketPage()
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')

    });

    test('2. Opening the shopping cart with 1 non-promotional item.', async ({ page }) => {

        const pf = new ProductFactory()

        const productLocator = page.locator(selectors.mainPage.nonDiscountItem).first()
        await expect(productLocator).not.toBeEmpty()

        const product = await pf.create(productLocator)
        const currentAmountOfItems = await pm.onMainPage().getBasketAmount()
        await pm.onMainPage().buyProduct(product, 1)
        await pm.onMainPage().waitForAmountChanging(currentAmountOfItems)

        const newAmountOfItems = await pm.onMainPage().getBasketAmount()
        expect(newAmountOfItems).toEqual(1)

        await pm.onMainPage().basketIconClick()
        expect(pm.onMainPage().hasProduct(product, 1))

        await pm.onMainPage().goToTheBasketPage()
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')

    });

    test('3. Opening the shopping cart with 1 promotional item.', async ({ page }) => {

        const pf = new ProductFactory()

        const productLocator = page.locator(selectors.mainPage.discountItem).first()
        await expect(productLocator).not.toBeEmpty()

        const product = await pf.create(productLocator)
        const currentAmountOfItems = await pm.onMainPage().getBasketAmount()
        await pm.onMainPage().buyProduct(product)
        await pm.onMainPage().waitForAmountChanging(currentAmountOfItems)

        const newAmountOfItems = await pm.onMainPage().getBasketAmount()
        expect(newAmountOfItems).toEqual(1)

        await pm.onMainPage().basketIconClick()
        expect(pm.onMainPage().hasProduct(product, 1))

        await pm.onMainPage().goToTheBasketPage()
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')

    });

    test('4. Добавление 9 разных товаров', async ({ page }) => {
        const pf = new ProductFactory()
        const cart = new Cart()

        // todo refactor
        await page.waitForTimeout(1000)

        await page.locator('#gridCheck').click()
        await page.waitForTimeout(5000)

        const productLocator = page.locator(selectors.mainPage.discountItem).first()

        let discountProduct = await pf.create(productLocator)

        cart.add(discountProduct)
        await pm.onMainPage().buyProduct(discountProduct)

        await page.locator('#gridCheck').click()
        await page.waitForTimeout(5000)

        const productsSelector = '.note-list .note-item'

        const need = 9

        while (true) {
            let productsCollection = page.locator(productsSelector)

            if (await productsCollection.count() == 0) {
                break
            }

            for (let item of await productsCollection.all()) {
                let productInfo = await pf.create(item)

                if (cart.containsProduct(productInfo)) {
                    continue
                }

                cart.add(productInfo)
                await pm.onMainPage().buyProduct(productInfo)

                if (cart.items.length >= need) {
                    break
                }
            }

            if (cart.items.length >= need) {
                break
            }

            let nextPage = page.locator('.page-item.active+li.page-item')
            await nextPage.click()
            // todo проверить когда элемент nextPage станет .active
            await page.waitForTimeout(5000)
        }

        // todo expect
        // const productAmountLocator = pm.onMainPage().BASKET_AMOUNT_OF_ITEMS
        // const updatedAmount = await pm.onMainPage().waitForAmountChanging(Number(page.locator(productAmountLocator).first().textContent()));
        expect(cart.items.length).toEqual(need)

        //await page.waitForTimeout(15000)
        // todo проверить в UI
    });

    test('5. Opening the shopping cart with 9 promotional item.', async ({ page }) => {

        const pf = new ProductFactory()

        const productLocator = page.locator(selectors.mainPage.discountItem).first()
        await expect(productLocator).not.toBeEmpty()

        const product = await pf.create(productLocator)
        const currentAmountOfItems = await pm.onMainPage().getBasketAmount()
        await pm.onMainPage().buyProduct(product, 9)
        await pm.onMainPage().waitForAmountChanging(currentAmountOfItems)

        const newAmountOfItems = await pm.onMainPage().getBasketAmount()
        expect(newAmountOfItems).toEqual(9)

        expect(pm.onMainPage().hasProduct(product, 9))

        await pm.onMainPage().basketIconClick()
        await expect(page.locator(selectors.mainPage.basketDropDownMenu)).toBeVisible()

        await pm.onMainPage().goToTheBasketPage()
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')

        await page.waitForTimeout(15000)

    });
})

