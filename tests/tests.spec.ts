import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager'

// test.describe.configure({mode: 'parallel'})

test.beforeEach(async({page}) => {
    await page.goto('https://enotes.pointschool.ru/login')
})

test('1. Opening an empty shopping cart.', async ({ page }) => {

     const pm = new PageManager(page)

    // нажать на корзину
        await pm.onMainPage().basketLinkClick()
    // expect(). . .   // проверить, что открылось окно корзины
    // нажать на кнопку Перейти в корзину 
    // проверить, что открылась страница Корзины

    });

test('2. Opening the shopping cart with 1 non-promotional item.', async ({ page }) => {

    const pm = new PageManager(page)

    const userLogin = 'test'
    const userPass = 'test'
    
    await pm.onSignInPage().signInToAccount(userLogin, userPass)
    expect(page.url()).toContain('https://enotes.pointschool.ru/')

    const basketContainer = page.locator('#basketContainer')
    const selector = '#basketContainer .basket-count-items'
    await page.waitForSelector(selector) //(basketContainer.locator('.basket-count-items'))

    const element = page.locator(selector).first()

    const initialText = await element.textContent()
    expect(initialText).toEqual('0')

    await pm.onMainPage().buyNonDiscountProduct()

    // страница ожидает, пока обработается функция (5сек). проверяется, пока не вернет true. ждем изменения селектора
 

    // Get the updated text content of the element
    const updatedAmount = await pm.onMainPage().waitForAmountChanging(Number(initialText));
    expect(updatedAmount).toEqual(1)

    // нажать на корзину
    await pm.onMainPage().basketLinkClick()

    // expect(). . .   // проверить, что открылось окно корзины и содержимое
    const dropdownMenuItemTitle = page.locator('.dropdown-menu').locator('.basket-item-title')
    const dropdownMenuItemPrice = page.locator('.basket-item-price')
    const dropdownMenuItemTotalPrice = page.locator('.basket_price')
    await expect(dropdownMenuItemTitle).toHaveText('Блокнот в точку')
    await expect(dropdownMenuItemPrice).toContainText('400 р.')
    await expect(dropdownMenuItemTotalPrice).toHaveText('400')

    //dropdownMenu.click()

    // нажать на кнопку Перейти в корзину 
    await pm.onMainPage().goToTheBasket()
    // проверить, что открылась страница Корзины
    //await pm.onMainPage().cleanTheBasket()

});

test('3. Opening the shopping cart with 1 promotional item.', async ({ page }) => {

    const pm = new PageManager(page)

    const userLogin = 'test'
    const userPass = 'test'
    await pm.onSignInPage().signInToAccount(userLogin, userPass)
    expect(page.url()).toContain('https://enotes.pointschool.ru/')

    const basketContainer = page.locator('#basketContainer')
    const selector = '#basketContainer .basket-count-items'
    await page.waitForSelector(selector) //(basketContainer.locator('.basket-count-items'))

    const element = page.locator(selector).first()

    const initialText = await element.textContent()
    expect(initialText).toEqual('0')

    await pm.onMainPage().buyDiscountProduct()


    // страница ожидает, пока обработается функция (5сек). проверяется, пока не вернет true. ждем изменения селектора
    await page.waitForFunction(
        (initialText) => {
            const currentText = document.querySelector('#basketContainer .basket-count-items')?.textContent;
            return currentText && currentText !== initialText;
        },
        initialText,
        { timeout: 5000 }
    );

    // Get the updated text content of the element
    const updatedText = await page.textContent('#basketContainer .basket-count-items');
    expect(updatedText).toEqual('1')

    // нажать на корзину
    await pm.onMainPage().basketLinkClick()

    // expect(). . .   // проверить, что открылось окно корзины и содержимое
    // const dropdownMenuItemTitle = page.locator('.dropdown-menu').locator('.basket-item-title')
    // const dropdownMenuItemPrice = page.locator('.basket-item-price')
    // const dropdownMenuItemTotalPrice = page.locator('.basket_price')
    // await expect(dropdownMenuItemTitle).toHaveText('Блокнот в точку')
    // await expect(dropdownMenuItemPrice).toContainText('400 р.')
    // await expect(dropdownMenuItemTotalPrice).toHaveText('400')


    //dropdownMenu.click()

    // нажать на кнопку Перейти в корзину 
    await pm.onMainPage().goToTheBasket()

    // проверить, что открылась страница Корзины
    expect(page.url()).toContain('https://enotes.pointschool.ru/basket')
    //await pm.onMainPage().cleanTheBasket()

});

test('4. Opening the shopping cart with 9 different items.', async ({ page }) => {
    const pm = new PageManager(page)

    const userLogin = 'test'
    const userPass = 'test'
    await pm.onSignInPage().signInToAccount(userLogin, userPass)
    expect(page.url()).toContain('https://enotes.pointschool.ru/')

    const basketContainer = page.locator('#basketContainer')
    const selector = '#basketContainer .basket-count-items'
    await page.waitForSelector(selector) //(basketContainer.locator('.basket-count-items'))

    const element = page.locator(selector).first()

    const initialText = await element.textContent()
    expect(initialText).toEqual('0')

    await pm.onMainPage().buyDiscountProduct()

    await page.waitForFunction(
        (initialText) => {
            const currentText = document.querySelector('#basketContainer .basket-count-items')?.textContent;
            return currentText && currentText !== initialText;
        },
        initialText,
        { timeout: 5000 }
    );

    const updatedText = await page.textContent('#basketContainer .basket-count-items');
    expect(updatedText).toEqual('1')

});

test('5. Opening the shopping cart with 9 identical promotional items.', async ({ page }) => {
    const pm = new PageManager(page)

    const userLogin = 'test'
    const userPass = 'test'
    await pm.onSignInPage().signInToAccount(userLogin, userPass)
    expect(page.url()).toContain('https://enotes.pointschool.ru/')

    const basketContainer = page.locator('#basketContainer')
    const selector = '#basketContainer .basket-count-items'
    await page.waitForSelector(selector) //(basketContainer.locator('.basket-count-items'))

    const element = page.locator(selector).first()

    const initialText = await element.textContent()
    expect(initialText).toEqual('0')

    await pm.onMainPage().enterAmountOfDiscountItems(9)

    await pm.onMainPage().buyDiscountProduct()


    // страница ожидает, пока обработается функция (5сек). проверяется, пока не вернет true. ждем изменения селектора
    await page.waitForFunction(
        (initialText) => {
            const currentText = document.querySelector('#basketContainer .basket-count-items')?.textContent;
            return currentText && currentText !== initialText;
        },
        initialText,
        { timeout: 5000 }
    );

    // Get the updated text content of the element
    const updatedText = await page.textContent('#basketContainer .basket-count-items');
    expect(updatedText).toEqual('9')

    // нажать на корзину
    await pm.onMainPage().basketLinkClick()

    // expect(). . .   // проверить, что открылось окно корзины и содержимое
    // const dropdownMenuItemTitle = page.locator('.dropdown-menu').locator('.basket-item-title')
    // const dropdownMenuItemPrice = page.locator('.basket-item-price')
    // const dropdownMenuItemTotalPrice = page.locator('.basket_price')
    // await expect(dropdownMenuItemTitle).toHaveText('Блокнот в точку')
    // await expect(dropdownMenuItemPrice).toContainText('400 р.')
    // await expect(dropdownMenuItemTotalPrice).toHaveText('400')



    //dropdownMenu.click()

    // нажать на кнопку Перейти в корзину 
    await pm.onMainPage().goToTheBasket()

    // проверить, что открылась страница Корзины
    // expect(page.url()).toContain('https://enotes.pointschool.ru/basket')
})
