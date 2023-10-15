const puppeteer = require("puppeteer");

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe("Customers Page", () => {
  it("should trigger validation when required input field in customer is empty", async () => {
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    const emailInputSelector =
      'input[type="text"][placeholder="email@example.com"]';
    const passwordInputSelector =
      'input[type="password"][placeholder="At least 8 characters"]';
    const loginButtonSelector = 'button[type="submit"]';
    await page.goto("http://94.237.65.245:4012/login");
    await page.waitForTimeout(9000);
    await page.type(emailInputSelector, "test@gmail.com");
    await page.type(passwordInputSelector, "password1234");

    await page.click(loginButtonSelector);
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    await page.waitForSelector('a[href="/customers"]');
    await page.waitForTimeout(4000);
    await page.click('a[href="/customers"]');
    await page.waitForSelector('button[data-v-809e3eda][type="submit"]');
    await page.waitForTimeout(4000);
    await page.click('button[data-v-809e3eda][type="submit"]');
    await page.waitForSelector('div[role="alert"]');

    const alertElement = await page.$('div[role="alert"]');
    const alertIsVisible = await alertElement.evaluate((element) => {
      return (
        window.getComputedStyle(element).getPropertyValue("display") !== "none"
      );
    });
    const alertText = await page.evaluate(
      (element) => element.textContent,
      alertElement
    );

    //Expect that alert will be shown
    expect(alertIsVisible).toBe(true);
    expect(alertText).toBe("× Warning: Please fill out the fields ");
  }, 45000);
});
