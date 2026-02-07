import { Page, Locator } from "@playwright/test";
import { BasePage } from '../base/BasePage';
import { WaitHelper } from '../../utils/helpers/WaitHelper';
import * as env from 'dotenv';
env.config();

const username = process.env.usernameExterno || '';
const password = process.env.passwordExterno || '';

/**
 * Page Object para la página de login
 * Maneja el inicio de sesión de usuarios
 */
export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = this.page.locator('#email');
        this.passwordInput = this.page.locator('#password');
        this.loginButton = this.page.locator('#next');
    }

    /**
     * Login con credenciales del .env (usuario externo)
     */
    async loginExterno() {
        await this.goto('/');
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await WaitHelper.waitForNavigation(this.page);
    }

    /**
     * Login con credenciales personalizadas
     * @param user - Usuario
     * @param pass - Contraseña
     */
    async login(user: string, pass: string) {
        await this.goto('/');
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
        await WaitHelper.waitForNavigation(this.page);
    }
}
