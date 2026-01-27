import { test as drive } from "@playwright/test";
import { LoginPage } from "./Login";

const test = drive.extend<{
    login: LoginPage;

}>({
    login: async ({ page }, use) => await use(new LoginPage(page)),

});

export { test };
