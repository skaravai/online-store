import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager'
import * as users from "../data/credentials.json";

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

        // парсинг всех товаров на странице
        const noteItems = await page.locator('.note-list .note-item').all();

        for (const noteItem of noteItems) {
                const product = await pm.onMainPage().parseProductInfo(noteItem)
                await pm.onMainPage().saveProductToCollection(product)
        }
    })

    test('2. добавление 1 товара без акции', async ({ page }) => {
        // 0. todo 1. selector .note-item в котором НЕТ has discount
        // locator(selector).first() ->>
        // Если элемент найден, то: ProductFactory().create(locator)
        // Если не найден:
        // 1. Ищем пагинацию .pagination
        // 2. Если находим первый не .active li
        // 3. Кликаем на него
        // 4. Ждем когда элемент пагинации станет active
        // И так по кругу (п0_ и так далее (по страницам).
       // console.log(pm.onMainPage().productsCollection)


        /// ----- 9 товаров
        // Кликаешь галочку Только акционные
        // Селектор первого акционного товара -> в корзину
        // Отжимаешь галочку
        // ----
        // selector .note-item => []items
        // в цикле их обрабатываешь. Каждый проверяешь, не лежит ли он уже в корзине (технической корзине, Cart) - по имени
        // как только все обработал, проверяешь количество товаров в корзине (их будет 8 скорее всего)
        // Если товаров не хватает - пагниация и все по кругу
 
        const nonDiscountProduct = pm.onMainPage().productsCollection.find(product => product.hasDiscount === false);

        if (nonDiscountProduct) {
          console.log(nonDiscountProduct);
        } else {
          console.log('Продукт с hasDiscount: false не найден.');
        }

        // Добавить в корзину товар без скидки
       await pm.onMainPage().addProductToBasket(nonDiscountProduct!)


       

       //// Проверяем, что рядом с корзиной отображается цифра 1 (наш товар)
       //// Нажать на иконку корзины
       //await pm.onMainPage().basketLinkClick()

      //  // Открывается окно корзины, в котором указана цена, наименование товара, общая сумма
      //  expect(pm.onMainPage().basketDropDownMenu).toBeVisible


      //// В окне корзины нажать кнопку перейти в корзину
      // await pm.onMainPage().goToTheBasket()

      //// 	Проверка перехода на страницу корзины
      //expect(page.url()).toContain('https://enotes.pointschool.ru/basket')
    });

    test('добавление 1 акционного товара', async ({ page }) => {
      // console.log(pm.onMainPage().productsCollection)

       const discountProduct = pm.onMainPage().productsCollection.find(product => product.hasDiscount === true);

       if (discountProduct) {
         console.log(discountProduct);
       } else {
         console.log('Продукт с hasDiscount: true не найден. На данной странице');
       }


       await pm.onMainPage().addProductToBasket(discountProduct!)

   });

   test('добавление 9 одинаковых акционных товаров', async ({ page }) => {
    // console.log(pm.onMainPage().productsCollection)

     const discountProduct = pm.onMainPage().productsCollection.find(product => product.hasDiscount === true);

     if (discountProduct) {
       console.log(discountProduct);
     } else {
       console.log('Продукт с hasDiscount: true не найден. На данной странице');
     }

    await pm.onMainPage().enterAmountOfDiscountItems(9)
    await pm.onMainPage().addProductToBasket(discountProduct!)

 });

})