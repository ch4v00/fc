import { test as base } from "@playwright/test";

// Auth
import { LoginPage } from "./auth/LoginPage";

// Common
import { HomePage } from "./common/HomePage";
import { SuccessModal } from "./common/SuccessModal";

// Banking - Spanish
import { AgregarCuentaWizard } from "./banking/AgregarCuentaWizard";
import { DepositoWizard } from "./banking/DepositoWizard";
import { SolicitarFondosWizard } from "./banking/SolicitarFondosWizard";

// Investments - Spanish
import { InvertirFCIWizard } from "./investments/InvertirFCIWizard";
import { MoverFondosWizard } from "./investments/MoverFondosWizard";
import { RescatarFCIDesdeInversionesWizard } from "./investments/RescatarFCIDesdeInversionesWizard";
import { SuscribirFCIWizard } from "./investments/SuscribirFCIWizard";
import { RescatarFCIWizard } from "./investments/RescatarFCIWizard";

// Users - Spanish
import { AgregarUsuarioWizard } from "./users/AgregarUsuarioWizard";

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

  // Banking - Spanish
  agregarCuentaWizard: AgregarCuentaWizard;
  depositoWizard: DepositoWizard;
  solicitarFondosWizard: SolicitarFondosWizard;

  // Investments - Spanish
  invertirFCIWizard: InvertirFCIWizard;
  moverFondosWizard: MoverFondosWizard;
  rescatarFCIDesdeInversionesWizard: RescatarFCIDesdeInversionesWizard;
  suscribirFCIWizard: SuscribirFCIWizard;
  rescatarFCIWizard: RescatarFCIWizard;

  // Users - Spanish
  agregarUsuarioWizard: AgregarUsuarioWizard;

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

  // Banking - Spanish
  agregarCuentaWizard: async ({ page }, use) => await use(new AgregarCuentaWizard(page)),
  depositoWizard: async ({ page }, use) => await use(new DepositoWizard(page)),
  solicitarFondosWizard: async ({ page }, use) => await use(new SolicitarFondosWizard(page)),

  // Investments - Spanish
  invertirFCIWizard: async ({ page }, use) => await use(new InvertirFCIWizard(page)),
  moverFondosWizard: async ({ page }, use) => await use(new MoverFondosWizard(page)),
  rescatarFCIDesdeInversionesWizard: async ({ page }, use) => await use(new RescatarFCIDesdeInversionesWizard(page)),
  suscribirFCIWizard: async ({ page }, use) => await use(new SuscribirFCIWizard(page)),
  rescatarFCIWizard: async ({ page }, use) => await use(new RescatarFCIWizard(page)),

  // Users - Spanish
  agregarUsuarioWizard: async ({ page }, use) => await use(new AgregarUsuarioWizard(page)),

  // Components
  fileUploader: async ({ page }, use) => await use(new FileUploader(page)),
  currencySelector: async ({ page }, use) => await use(new CurrencySelector(page)),
  confirmationModal: async ({ page }, use) => await use(new ConfirmationModal(page)),
});

export { expect } from "@playwright/test";
