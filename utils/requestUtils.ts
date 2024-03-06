import { chromium, Browser, Page } from 'playwright';

export interface RequestOptions {
  url: string;
  method: string;
  headers: Record<string, string>;
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
  }>;
  body: string;
}

export async function sendRequest(options: RequestOptions): Promise<void> {
  const browser: Browser = await chromium.launch();
  const context = await browser.newContext();

  await context.addCookies(options.cookies);

  const page: Page = await context.newPage();

  await page.setExtraHTTPHeaders(options.headers);

  await page.route(options.url, route => {
    route.continue({
      method: options.method,
      headers: options.headers,
      postData: options.body
    });
  });

  await page.goto(options.url);

  await browser.close();
}
