import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager'
import * as users from "../data/credentials.json";
import { sendRequest } from '../utils/requestUtils';
import { requestOptions } from '../utils/requestOptions';
import {UI, Cart} from "../utils/productType";

test.describe("Shopping Cart Feature. Empty shopping cart @cart", async () => {

    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await page.goto('https://enotes.pointschool.ru/login');
        await pm.onSignInPage().signInToAccount(users.standard.login, users.standard.password)
        expect(page.url()).toContain('https://enotes.pointschool.ru/')

        //очистку реализовать через вызов метода для кейса с 9 товарами
        //await sendRequest(requestOptions);

        //проверка на количество товаров в корзине. если не 0, то чистим корзину

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

       // Определение типа для продукта

    });


    test('1. Opening an empty shopping cart.', async ({ page }) => {

        // нажать на корзину
        await pm.onMainPage().basketLinkClick()

        // проверить, что открылось окно корзины
        expect(pm.onMainPage().basketDropDownMenu).toBeVisible //

        // нажать на кнопку Перейти в корзину 
        await pm.onMainPage().goToTheBasket()

        // проверить, что открылась страница Корзины
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')

    });

    test('2. Opening the shopping cart with 1 non-promotional item.', async ({ page }) => {

        // вызвать функцию парсинга товаров на странице, 
        // добавить в корзину первый товар, который isDiscounted: false
        // если такого нет, то листаем страницу на след (предварительно получив их кол-во)
        // если мы на последней странице и товар не найден, то тест скипается
        // сравнить данные в корзине о товаре с теми, что мы распарсили до function compareData


        //получить название и цену выбранного товара без скидки
        const itemPriceLocator = await page.$(pm.onMainPage().NON_DISCOUNT_ITEM_PRICE);
        const itemPrice = await itemPriceLocator?.innerText();

        const itemNameLocator = await page.$(pm.onMainPage().NON_DISCOUNT_ITEM_NAME)
        const itemName = await itemNameLocator?.innerText();

        // Добавить в корзину данный товар без скидки
        await pm.onMainPage().buyNonDiscountProduct()

        // Проверяем, что рядом с корзиной отображается цифра 1 (наш товар)
        const newValueLocator = pm.onMainPage().BASKET_AMOUNT_OF_ITEMS
        const updatedAmount = await pm.onMainPage().waitForAmountChanging(Number(page.locator(newValueLocator).first().textContent()));
        expect(updatedAmount).toEqual(1)

        // Нажать на иконку корзины
        await pm.onMainPage().basketLinkClick()

        // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
        expect(pm.onMainPage().basketDropDownMenu).toBeVisible

        await expect(pm.onMainPage().dropdownMenuItemTitle).toContainText(itemName!) //добавить проверку на undefined
        await expect(pm.onMainPage().dropdownMenuItemPrice).toContainText(itemPrice!) //добавить проверку на undefined
        await expect(pm.onMainPage().dropdownMenuItemTotalPrice).toBeVisible()

        // В окне корзины нажать кнопку перейти в корзину
        await pm.onMainPage().goToTheBasket()

        // 	Переход на страницу корзины
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')
    });

    test('3. Opening the shopping cart with 1 promotional item.', async ({ page }) => {

        //получить название и цену выбранного товара со скидкой
        const itemPriceLocator = await page.$(pm.onMainPage().DISCOUNT_ITEM_PRICE);
        const itemPrice = await itemPriceLocator?.innerText();

        const itemNameLocator = await page.$(pm.onMainPage().DISCOUNT_ITEM_NAME)
        const itemName = await itemNameLocator?.innerText();

        // Добавить в корзину данный товар со скидкой
        await pm.onMainPage().buyDiscountProduct()

        // нужна ли эта проверка??
        // Проверяем, что рядом с корзиной отображается цифра 1 (наш товар)   
        const newValueLocator = pm.onMainPage().BASKET_AMOUNT_OF_ITEMS
        const updatedAmount = await pm.onMainPage().waitForAmountChanging(Number(page.locator(newValueLocator).first().textContent()));
        expect(updatedAmount).toEqual(1)

        // Нажать на иконку корзины
        await pm.onMainPage().basketLinkClick()

        // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
        expect(pm.onMainPage().basketDropDownMenu).toBeVisible

        //обрезать до 400
        await expect(pm.onMainPage().dropdownMenuItemTitle).toContainText(itemName!) //добавить проверку на undefined
        await expect(pm.onMainPage().dropdownMenuItemPrice).toContainText(itemPrice!) //добавить проверку на undefined
        await expect(pm.onMainPage().dropdownMenuItemTotalPrice).toBeVisible()

        // В окне корзины нажать кнопку перейти в корзину
        await pm.onMainPage().goToTheBasket()

        // 	Переход на страницу корзины
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')

    });

    test('5. Opening the shopping cart with 9 identical promotional items.', async ({ page }) => {

        // добавление в корзину 9 одинаковых товаров со скидкой
        await pm.onMainPage().enterAmountOfDiscountItems(9)
        await pm.onMainPage().buyDiscountProduct()

        // Проверяем, что рядом с корзиной отображается цифра 9 (наши товары) 
        const newValueLocator = pm.onMainPage().BASKET_AMOUNT_OF_ITEMS
        const updatedAmount = await pm.onMainPage().waitForAmountChanging(Number(page.locator(newValueLocator).first().textContent()));
        expect(updatedAmount).toEqual(9)

        // нажать на корзину
        await pm.onMainPage().basketLinkClick()

        // проверить, что в корзине лежит 9 товаров и их название/цена/итоговая сумма

        // нажать на кнопку Перейти в корзину (на данном шаге кейс упадет)
        //await pm.onMainPage().goToTheBasket()

        //проверить товары в корзине

        // проверить, что открылась страница Корзины
        expect(page.url()).toContain('https://enotes.pointschool.ru/basket')
    });

})



test.describe("Shopping Cart Feature. The basket is not empty. @cart", async () => {

    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await page.goto('https://enotes.pointschool.ru/login');
        await pm.onSignInPage().signInToAccount(users.standard.login, users.standard.password)
        expect(page.url()).toContain('https://enotes.pointschool.ru/')
        //await sendRequest(requestOptions);
        //очистку реализовать через вызов метода для кейса с 9 товарами

        //проверка на количество товаров в корзине. если не 0, то чистим корзину
        const amountOfItems = pm.onMainPage().BASKET_AMOUNT_OF_ITEMS
        await page.waitForSelector(amountOfItems)

        const element = page.locator(amountOfItems).first()
        const initialText = await element.textContent()

        if (initialText != '0') {
            await pm.onMainPage().basketLinkClick()
            await pm.onMainPage().cleanTheBasket()
        }
    })

    test('4. Opening the shopping cart with 9 different items.', async ({ page }) => {
        const cart = new Cart()
        const basket = new UI(page)


        //
        cart.items.forEach(function (item) {
            basket.hasProduct(item.product, item.count)
        })



        // await pm.onMainPage().openNextPage()
        // await page.waitForTimeout(1000);
        // await pm.onMainPage().buyDiscountProduct()
        // await page.goBack()
        // await page.waitForTimeout(1000);

        const noteItems = await page.$$('.note-list .col-3.mb-5 button.actionBuyProduct');
        //const itemBuyButton = '.note-list .col-3.mb-5 button.actionBuyProduct'

        //await page.waitForLoadState(itemBuyButton)
        for (const noteItem of noteItems) {
            await noteItem.click()
            await page.waitForTimeout(1000); // Подождите некоторое время для обработки действия
        }

    });

})