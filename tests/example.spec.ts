import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager'
import * as users from "../data/credentials.json";
import { Product } from '../utils/productType';
import { ElementHandle } from 'playwright';

test.describe("Shopping Cart Feature. Empty shopping cart @cart", async () => {

    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await page.goto('https://enotes.pointschool.ru/login');
        await pm.onSignInPage().signInToAccount(users.standard.login, users.standard.password)
        expect(page.url()).toContain('https://enotes.pointschool.ru/')

        const amountOfItems = pm.onMainPage().BASKET_AMOUNT_OF_ITEMS
        await page.waitForSelector(amountOfItems)

        const element = page.locator(amountOfItems).first()
        const initialText = await element.textContent()

        if (initialText != '0') {
            await pm.onMainPage().basketLinkClick()
            await pm.onMainPage().cleanTheBasket()
        }
    })


    test('example', async ({ page }) => {

        const element = page.locator('.note-list .note-item').first();
        
        if (element) {
            const product = await pm.onMainPage().parseProductInfo(element)
            await pm.onMainPage().saveProductToCollection(product)
        } else {
            console.error('HTML-элемент не найден');
            // TO DO остановить тест (фейл)
        }

        console.log(pm.onMainPage().productsCollection)
    });
})