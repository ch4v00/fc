import { Page, Locator } from "@playwright/test";
import * as env from 'dotenv';
env.config();

const username = process.env.usernameExterno || '';
const password = process.env.passwordExterno || '';

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(driver: Page) {
        this.page = driver;
        this.username = this.page.locator('#email');
        this.password = this.page.locator('#password');
        this.loginButton = this.page.locator('#next');
    }

    async loginExterno() {
        await this.page.goto('/');
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.page.waitForTimeout(5000);
    }
}

