beforeAll(async () => {
  await page.goto("http://94.237.65.245:4012/login");
});

describe("Login Page", () => {
  it("should trigger validation when required input is empty", async () => {
    const emailInputSelector =
      'input[type="text"][placeholder="email@example.com"]';

    await page.type(
      'input[type="password"][placeholder="At least 8 characters"].form-control.form-control-lg',
      "password1234"
    );

    await page.click('button[type="submit"]');

    await page.waitForSelector(emailInputSelector + ":invalid");

    const emailInput = await page.$(emailInputSelector);

    const errorMessageText = await emailInput.evaluate(
      (input) => input.validationMessage
    );

    await expect(errorMessageText).toBe("Please fill out this field.");
  });

  it("should fill out the login form and submit", async () => {
    await expect(page.title()).resolves.toMatch("Lou Geh Car Dealership");
    await page.type(
      'input[type="text"][placeholder="email@example.com"].form-control.form-control-lg',
      "test@gmail.com"
    );

    await page.type(
      'input[type="password"][placeholder="At least 8 characters"].form-control.form-control-lg',
      "password1234"
    );

    await page.click('button[type="submit"]');

    await page.waitForNavigation({
      url: "http://94.237.65.245:4012/dashboard",
    });

    await page.waitForSelector("h2[data-v-068b70d9]");

    const text = await page.$eval(
      "h2[data-v-068b70d9]",
      (element) => element.textContent
    );
    await expect(text).toContain("Dashboard");
  }, 30000);
});
