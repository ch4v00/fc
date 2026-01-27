import { test as setup } from "./pages/TestBase"


const authFile = 'authentication/.auth/user.json';

setup('authenticate', async ({ page, login }) => {
    await login.loginExterno();
    await page.waitForURL('/');
    await page.context().storageState({ path: authFile });
});
