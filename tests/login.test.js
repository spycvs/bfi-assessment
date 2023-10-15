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

describe("Login Page", () => {
  const emailInputSelector =
    'input[type="text"][placeholder="email@example.com"]';
  const passwordInputSelector =
    'input[type="password"][placeholder="At least 8 characters"].form-control.form-control-lg';
  const loginButtonSelector = 'button[type="submit"]';

  it("should trigger validation when required input field is empty", async () => {
    await page.goto("http://94.237.65.245:4012/");

    await page.click('a[href="/login"]');
    await page.waitForTimeout(2000);

    await page.type(passwordInputSelector, "password1234");

    await page.click(loginButtonSelector);

    await page.waitForSelector(emailInputSelector + ":invalid");

    const emailInput = await page.$(emailInputSelector);

    const errorMessageText = await emailInput.evaluate(
      (input) => input.validationMessage
    );

    //Expect error message
    expect(errorMessageText).toBe("Please fill out this field.");
  }, 100000);

  it("should fill out the login form and submit", async () => {
    await page.goto("http://94.237.65.245:4012/");

    await page.click('a[href="/login"]');
    await page.waitForTimeout(2000);

    await expect(page.title()).resolves.toMatch("Lou Geh Car Dealership");
    await page.type(emailInputSelector, "test@gmail.com");
    await page.type(passwordInputSelector, "password1234");
    await page.click(loginButtonSelector);

    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    const currentUrl = page.url();

    await page.waitForSelector("h2[data-v-068b70d9]");

    const text = await page.$eval(
      "h2[data-v-068b70d9]",
      (element) => element.textContent
    );

    //Expect that current page is in dashboard
    expect(currentUrl).toBe("http://94.237.65.245:4012/dashboard");
    expect(text).toContain("Dashboard");
  }, 45000);
});
