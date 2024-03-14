import { test as baseTest } from '@playwright/test';
import { MainPage} from "../page-objects/pages/mainPage";
import { SignInPage} from "../page-objects/pages/signInPage";
import { BasketPopupComponent } from '../page-objects/components/navbar/basketPopupComponent';


type MyFixtures = {
    signInPage: SignInPage,
    mainPage: MainPage,
    basketPopupComponent: BasketPopupComponent
}
export const test = baseTest.extend<MyFixtures>({

    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },

    mainPage: async ({ page }, use) => {
        await use(new MainPage(page));
    },

    basketPopupComponent: async ({ page }, use) => {
        await use(new BasketPopupComponent(page));
    }

});

export { expect } from '@playwright/test';