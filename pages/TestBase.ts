import { test as base } from "@playwright/test";

// Auth
import { LoginPage } from "./auth/LoginPage";

// Common
import { HomePage } from "./common/HomePage";
import { SuccessModal } from "./common/SuccessModal";

// Banking
import { AddAccountWizard } from "./banking/AddAccountWizard";
import { DepositWizard } from "./banking/DepositWizard";

// Investments
import { InvestFCIWizard } from "./investments/InvestFCIWizard";
import { MoveFundsWizard } from "./investments/MoveFundsWizard";

// Components
import { FileUploader } from "../components/FileUploader";
import { CurrencySelector } from "../components/CurrencySelector";
import { ConfirmationModal } from "../components/ConfirmationModal";

/**
 * Tipo que define todos los Page Objects y componentes disponibles
 */
type Pages = {
  // Auth
  login: LoginPage;

  // Common
  homePage: HomePage;
  successModal: SuccessModal;

  // Banking
  addAccountWizard: AddAccountWizard;
  depositWizard: DepositWizard;

  // Investments
  investFCIWizard: InvestFCIWizard;
  moveFundsWizard: MoveFundsWizard;

  // Components
  fileUploader: FileUploader;
  currencySelector: CurrencySelector;
  confirmationModal: ConfirmationModal;
};

/**
 * Test base extendido con todos los Page Objects
 * Cada Page Object se inicializa automáticamente cuando se usa
 */
export const test = base.extend<Pages>({
  // Auth
  login: async ({ page }, use) => await use(new LoginPage(page)),

  // Common
  homePage: async ({ page }, use) => await use(new HomePage(page)),
  successModal: async ({ page }, use) => await use(new SuccessModal(page)),

  // Banking
  addAccountWizard: async ({ page }, use) => await use(new AddAccountWizard(page)),
  depositWizard: async ({ page }, use) => await use(new DepositWizard(page)),

  // Investments
  investFCIWizard: async ({ page }, use) => await use(new InvestFCIWizard(page)),
  moveFundsWizard: async ({ page }, use) => await use(new MoveFundsWizard(page)),

  // Components
  fileUploader: async ({ page }, use) => await use(new FileUploader(page)),
  currencySelector: async ({ page }, use) => await use(new CurrencySelector(page)),
  confirmationModal: async ({ page }, use) => await use(new ConfirmationModal(page)),
});

export { expect } from "@playwright/test";
