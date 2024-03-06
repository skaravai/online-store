import { Locator } from "@playwright/test";

export interface Product {
    name: string | null;
    price: number | null;
    hasDiscount: boolean;
    availableAmount: number | null;
}