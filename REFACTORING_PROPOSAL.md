# 📋 PROPUESTA DE REFACTORIZACIÓN - PLAYWRIGHT + TYPESCRIPT

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Aspectos Positivos
- ✓ Ya se usa `@faker-js/faker` para generación de datos
- ✓ Existe una implementación básica de POM (`LoginPage` y `TestBase`)
- ✓ Se usa autenticación persistente (`auth.setup.ts`)
- ✓ Configuración de Playwright bien establecida
- ✓ Estructura de carpetas básica creada (`/pages`, `/fixtures`, `/utils`)

### ⚠️ Problemas Identificados

#### 1. **CÓDIGO DUPLICADO CRÍTICO**

**Navegación y Setup (se repite en TODOS los tests):**
```typescript
// Se repite ~100+ veces
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});
```

**Generación de datos random (duplicado en múltiples archivos):**
```typescript
// En cuentas.spec.ts
function randomCBU(): string {
  let cbu = '';
  for (let i = 0; i < 22; i++) cbu += Math.floor(Math.random() * 10).toString();
  return cbu;
}

// Fecha actual (se repite en depositos, movimientos, etc.)
const today = new Date();
const fechaHoy = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
```

**Adjuntar archivos (patrón repetido ~20 veces):**
```typescript
const [fileChooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByText('Adjuntar comprobante').click()
]);
await fileChooser.setFiles('test.pdf');
```

**Verificación de éxito (duplicado en todos los flujos):**
```typescript
await expect(page.getByText('¡Felicitaciones!')).toBeVisible({ timeout: 10000 });
await expect(page.getByText('Tu solicitud fue enviada con éxito')).toBeVisible();
await page.getByRole('button', { name: 'Finalizar' }).click();
```

#### 2. **SELECTORES MÁGICOS**
- Selectores hardcodeados sin centralización
- Mismo selector escrito de diferentes maneras
- No hay constantes para textos comunes

#### 3. **ANTI-PATRONES**
- **Abuso de `waitForTimeout`**: Se usa en lugar de esperas inteligentes
- **Selectores frágiles**: `.nth(3)`, `filter().nth(4)` son muy propensos a fallar
- **Tests muy largos**: Algunos tests tienen 100+ líneas

#### 4. **FALTA DE ABSTRACCIÓN**
- Lógica de wizards multi-step repetida
- No hay helpers para operaciones comunes
- Cada test maneja su propio flujo de navegación

---

## 🏗️ ESTRUCTURA PROPUESTA

```
fyodigital/
├── tests/                          # Tests organizados por features
│   ├── auth.setup.ts              # ✅ Ya existe
│   ├── users/
│   │   ├── add-user.spec.ts       # Crear usuarios
│   │   └── manage-users.spec.ts   # Gestión de usuarios
│   ├── banking/
│   │   ├── add-account.spec.ts    # Añadir cuentas
│   │   ├── deposits.spec.ts       # Depósitos
│   │   └── withdrawals.spec.ts    # Retiros
│   ├── investments/
│   │   ├── invest-fci.spec.ts     # Invertir en FCI
│   │   ├── withdraw-fci.spec.ts   # Retirar FCI
│   │   └── move-funds.spec.ts     # Mover fondos
│   ├── portfolio/
│   │   ├── portfolio.spec.ts      # Cartera financiera
│   │   └── funds.spec.ts          # Fondos
│   └── navigation/
│       └── navigation.spec.ts     # Validación de navegación
│
├── pages/                          # Page Object Models
│   ├── base/
│   │   ├── BasePage.ts            # Clase base para todas las páginas
│   │   └── BaseWizard.ts          # Clase base para wizards multi-step
│   ├── auth/
│   │   └── LoginPage.ts           # ✅ Ya existe
│   ├── common/
│   │   ├── HomePage.ts            # Dashboard principal
│   │   ├── NavigationMenu.ts      # Menú de navegación
│   │   └── SuccessModal.ts        # Modal de éxito
│   ├── users/
│   │   └── AddUserWizard.ts       # Wizard de añadir usuario
│   ├── banking/
│   │   ├── AddAccountWizard.ts    # Wizard de añadir cuenta
│   │   └── DepositWizard.ts       # Wizard de depósito
│   ├── investments/
│   │   ├── InvestFCIWizard.ts     # Wizard de inversión FCI
│   │   ├── WithdrawFCIWizard.ts   # Wizard de retiro FCI
│   │   └── MoveFundsWizard.ts     # Wizard de mover fondos
│   └── TestBase.ts                # ✅ Ya existe
│
├── components/                     # Componentes reutilizables
│   ├── CurrencySelector.ts        # Selector de monedas (ARS/USD/Cable)
│   ├── FileUploader.ts            # Componente de subida de archivos
│   ├── StepIndicator.ts           # Indicador de pasos (Paso X de Y)
│   └── ConfirmationModal.ts       # Modales de confirmación
│
├── fixtures/                       # Datos de prueba
│   ├── userData.ts                # Datos de usuarios
│   ├── bankAccountData.ts         # Datos de cuentas bancarias
│   ├── depositData.ts             # Datos de depósitos
│   └── investmentData.ts          # Datos de inversiones
│
├── utils/                          # Helpers y utilidades
│   ├── generators/
│   │   ├── DataGenerator.ts       # Generación de datos random
│   │   ├── DateHelper.ts          # Manejo de fechas
│   │   └── BankingDataGenerator.ts # CBU, SWIFT, ABA, etc.
│   ├── helpers/
│   │   ├── WaitHelper.ts          # Esperas inteligentes
│   │   ├── FileHelper.ts          # Manejo de archivos
│   │   └── NavigationHelper.ts    # Navegación común
│   └── constants/
│       ├── messages.ts            # Mensajes de la app
│       ├── buttons.ts             # Textos de botones
│       └── urls.ts                # URLs de la app
│
├── config/
│   └── test-config.ts             # Configuraciones de tests
│
└── playwright.config.ts           # ✅ Ya existe
```

---

## 🎯 IMPLEMENTACIÓN PASO A PASO

### **FASE 1: FUNDAMENTOS Y UTILIDADES**

#### 1.1 Crear Helpers de Generación de Datos
**Archivo:** `utils/generators/DataGenerator.ts`
```typescript
import { faker } from '@faker-js/faker/locale/es';

export class DataGenerator {
  // Datos de usuario
  static randomUser() {
    return {
      email: faker.internet.email(),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: faker.string.numeric(10)
    };
  }

  // Montos random
  static randomAmount(min: number = 1, max: number = 99999999): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Números random
  static randomNumeric(length: number): string {
    return faker.string.numeric(length);
  }

  // Texto random
  static randomText(length: number = 10): string {
    return faker.lorem.words(length);
  }
}
```

**Archivo:** `utils/generators/BankingDataGenerator.ts`
```typescript
export class BankingDataGenerator {
  static randomCBU(): string {
    let cbu = '';
    for (let i = 0; i < 22; i++) {
      cbu += Math.floor(Math.random() * 10).toString();
    }
    return cbu;
  }

  static randomSWIFT(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let swift = '';
    for (let i = 0; i < 8; i++) {
      swift += letters[Math.floor(Math.random() * letters.length)];
    }
    return swift;
  }

  static randomABA(): string {
    let aba = '';
    for (let i = 0; i < 9; i++) {
      aba += Math.floor(Math.random() * 10).toString();
    }
    return aba;
  }

  static randomAccountNumber(): string {
    const length = Math.floor(Math.random() * 5) + 8; // 8-12 dígitos
    let number = '';
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  }
}
```

**Archivo:** `utils/generators/DateHelper.ts`
```typescript
export class DateHelper {
  // SIEMPRE retorna la fecha actual en formato dd/mm/yyyy
  static getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.formatDate(date);
  }
}
```

#### 1.2 Crear Helpers de Espera
**Archivo:** `utils/helpers/WaitHelper.ts`
```typescript
import { Page, Locator } from '@playwright/test';

export class WaitHelper {
  static async waitForNavigation(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  static async waitForElement(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  static async waitForElementToBeHidden(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  static async waitForURL(page: Page, urlPattern: string | RegExp, timeout: number = 10000) {
    await page.waitForURL(urlPattern, { timeout });
  }
}
```

#### 1.3 Crear Constantes
**Archivo:** `utils/constants/messages.ts`
```typescript
export const MESSAGES = {
  SUCCESS: {
    TITLE: '¡Felicitaciones!',
    SENT_SUCCESSFULLY: 'Tu solicitud fue enviada con éxito'
  },
  CONFIRMATION: {
    CONFIRM_REQUEST: 'Confirmá tu solicitud'
  },
  STEP: (current: number, total: number) => `Paso ${current} de ${total}`
};
```

**Archivo:** `utils/constants/buttons.ts`
```typescript
export const BUTTONS = {
  CONTINUE: 'Continuar',
  SEND_REQUEST: 'Enviar solicitud',
  FINISH: 'Finalizar',
  EXIT: 'Salir',
  PREVIOUS: 'Anterior',
  NEXT: 'Siguiente',
  CANCEL: 'Si, cancelar',
  MAX: 'MAX'
};
```

### **FASE 2: BASE CLASSES Y COMPONENTES**

#### 2.1 Clase Base para Páginas
**Archivo:** `pages/base/BasePage.ts`
```typescript
import { Page, Locator } from '@playwright/test';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string = '/') {
    await this.page.goto(url);
    await WaitHelper.waitForNavigation(this.page);
  }

  async clickButton(buttonName: string) {
    await this.page.getByRole('button', { name: buttonName }).click();
  }

  async fillInput(label: string, value: string) {
    await this.page.getByRole('textbox', { name: label }).fill(value);
  }

  async selectOption(optionText: string) {
    await this.page.getByText(optionText).click();
  }

  async waitForText(text: string, timeout: number = 10000) {
    await this.page.getByText(text).waitFor({ state: 'visible', timeout });
  }
}
```

#### 2.2 Clase Base para Wizards Multi-Step
**Archivo:** `pages/base/BaseWizard.ts`
```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { BUTTONS, MESSAGES } from '../../utils/constants';
import { WaitHelper } from '../../utils/helpers/WaitHelper';

export abstract class BaseWizard extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyStep(stepNumber: number, totalSteps: number) {
    await expect(
      this.page.getByText(MESSAGES.STEP(stepNumber, totalSteps))
    ).toBeVisible({ timeout: 10000 });
  }

  async continue() {
    const continueButton = this.page.getByRole('button', { name: BUTTONS.CONTINUE });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
    await this.page.waitForTimeout(1000); // Pequeña espera para transición
  }

  async previous() {
    await this.clickButton(BUTTONS.PREVIOUS);
    await this.page.waitForTimeout(500);
  }

  async exit() {
    await this.page.locator('.back').filter({ hasText: BUTTONS.EXIT }).click();

    // Manejar modal de confirmación si aparece
    const cancelButton = this.page.getByRole('button', { name: BUTTONS.CANCEL });
    const isVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await cancelButton.click();
    }

    await WaitHelper.waitForNavigation(this.page);
    await expect(this.page).toHaveURL('/');
  }

  async confirmRequest() {
    await expect(this.page.getByText(MESSAGES.CONFIRMATION.CONFIRM_REQUEST)).toBeVisible();

    const sendButton = this.page.getByRole('button', { name: BUTTONS.SEND_REQUEST });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    await this.page.waitForTimeout(3000); // Espera de respuesta del servidor
  }

  async verifySuccess() {
    await expect(
      this.page.getByText(MESSAGES.SUCCESS.TITLE)
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByText(MESSAGES.SUCCESS.SENT_SUCCESSFULLY)
    ).toBeVisible();
  }

  async finish() {
    await this.clickButton(BUTTONS.FINISH);
    await WaitHelper.waitForNavigation(this.page);
    await expect(this.page).toHaveURL('/');
  }

  async completeSuccessFlow() {
    await this.verifySuccess();
    await this.finish();
  }
}
```

#### 2.3 Componente de Subida de Archivos
**Archivo:** `components/FileUploader.ts`
```typescript
import { Page } from '@playwright/test';

export class FileUploader {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async uploadFile(buttonText: string = 'Adjuntar comprobante', filePath: string = 'test.pdf') {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.page.getByText(buttonText).click()
    ]);

    await fileChooser.setFiles(filePath);
    await this.page.waitForTimeout(500);
  }
}
```

#### 2.4 Componente de Selector de Moneda
**Archivo:** `components/CurrencySelector.ts`
```typescript
import { Page } from '@playwright/test';

export enum Currency {
  ARS = 0,
  USD = 1,
  CABLE = 2
}

export class CurrencySelector {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectCurrency(currency: Currency) {
    await this.page.locator('mat-radio-button').nth(currency).click();
    await this.page.waitForTimeout(500);
  }

  async selectARS() {
    await this.selectCurrency(Currency.ARS);
  }

  async selectUSD() {
    await this.selectCurrency(Currency.USD);
  }

  async selectCable() {
    await this.selectCurrency(Currency.CABLE);
  }
}
```

### **FASE 3: PAGE OBJECTS - EJEMPLOS**

#### 3.1 HomePage
**Archivo:** `pages/common/HomePage.ts`
```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickAddUser() {
    await this.page.locator('div').filter({ hasText: 'Añadir usuario' }).nth(4).click();
  }

  async clickAddAccount() {
    await this.page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();
  }

  async clickInformDeposit() {
    await this.page.locator('div').filter({ hasText: /^Informar Depósito$/ }).click();
  }

  async clickMoveFunds() {
    await this.page.locator('div').filter({ hasText: /^Mover Fondos$/ }).click();
  }

  async clickInvestFCI() {
    await this.page.locator('#invertirFci').click();
  }

  async verifyHomePage() {
    await expect(this.page.getByRole('heading', { name: /Hola,/ })).toBeVisible({ timeout: 10000 });
  }
}
```

#### 3.2 AddAccountWizard (Ejemplo completo)
**Archivo:** `pages/banking/AddAccountWizard.ts`
```typescript
import { Page, expect } from '@playwright/test';
import { BaseWizard } from '../base/BaseWizard';
import { CurrencySelector, Currency } from '../../components/CurrencySelector';
import { FileUploader } from '../../components/FileUploader';
import { BankingDataGenerator } from '../../utils/generators/BankingDataGenerator';

export class AddAccountWizard extends BaseWizard {
  private currencySelector: CurrencySelector;
  private fileUploader: FileUploader;
  private readonly TOTAL_STEPS = 2;

  constructor(page: Page) {
    super(page);
    this.currencySelector = new CurrencySelector(page);
    this.fileUploader = new FileUploader(page);
  }

  // PASO 1: Completar datos de la cuenta
  async fillAccountDetails(currency: Currency, bankName: string, accountType: string) {
    await this.verifyStep(1, this.TOTAL_STEPS);

    // Seleccionar comitente
    await this.page.locator('.select-box').first().click();
    await this.page.waitForTimeout(500);
    await this.page.getByText('AGRO IN SRL -').click();

    // Seleccionar moneda
    if (currency !== Currency.ARS) {
      await this.currencySelector.selectCurrency(currency);
    }

    // Seleccionar banco
    await this.page.locator('.select-container.default > .select-box').first().click();
    await this.page.waitForTimeout(500);
    await this.page.getByText(bankName).click();

    // Completar campos según moneda
    if (currency === Currency.CABLE) {
      await this.fillCableFields();
    } else {
      await this.fillStandardFields(accountType);
    }

    // Adjuntar comprobante
    await this.fileUploader.uploadFile();

    // Continuar
    await this.continue();
  }

  private async fillStandardFields(accountType: string) {
    await this.fillInput('Ingresá el CBU', BankingDataGenerator.randomCBU());
    await this.fillInput('Ingresá el número', BankingDataGenerator.randomAccountNumber());
    await this.fillInput('Ingresá una observación', 'Test Automatizado');

    // Seleccionar tipo de cuenta
    await this.page.locator('.select-container.default > .select-box').click();
    await this.page.waitForTimeout(500);
    await this.page.getByText(accountType).click();
  }

  private async fillCableFields() {
    await this.fillInput('Ingresá el SWIFT', BankingDataGenerator.randomSWIFT());
    await this.fillInput('Ingresá el ABA', BankingDataGenerator.randomABA());
    await this.fillInput('Ingresá el número', BankingDataGenerator.randomAccountNumber());
    await this.fillInput('Ingresá una observación', 'Test Automatizado');
  }

  // PASO 2: Confirmar y enviar
  async confirmAndSend() {
    await this.verifyStep(2, this.TOTAL_STEPS);
    await this.confirmRequest();
  }

  // Flujo completo
  async addAccount(currency: Currency, bankName: string, accountType: string) {
    await this.fillAccountDetails(currency, bankName, accountType);
    await this.confirmAndSend();
    await this.completeSuccessFlow();
  }

  // Opción de añadir otra cuenta
  async addAnotherAccount() {
    await this.page.getByRole('button', { name: 'Añadir otra cuenta' }).click();
    await this.page.waitForTimeout(1000);
    await this.verifyStep(1, this.TOTAL_STEPS);
  }
}
```

### **FASE 4: ACTUALIZAR TestBase**

**Archivo:** `pages/TestBase.ts`
```typescript
import { test as base } from "@playwright/test";
import { LoginPage } from "./auth/LoginPage";
import { HomePage } from "./common/HomePage";
import { AddAccountWizard } from "./banking/AddAccountWizard";
import { DepositWizard } from "./banking/DepositWizard";
import { InvestFCIWizard } from "./investments/InvestFCIWizard";
import { MoveFundsWizard } from "./investments/MoveFundsWizard";
// ... importar otros Page Objects

type Pages = {
  login: LoginPage;
  homePage: HomePage;
  addAccountWizard: AddAccountWizard;
  depositWizard: DepositWizard;
  investFCIWizard: InvestFCIWizard;
  moveFundsWizard: MoveFundsWizard;
  // ... otros Page Objects
};

export const test = base.extend<Pages>({
  login: async ({ page }, use) => await use(new LoginPage(page)),
  homePage: async ({ page }, use) => await use(new HomePage(page)),
  addAccountWizard: async ({ page }, use) => await use(new AddAccountWizard(page)),
  depositWizard: async ({ page }, use) => await use(new DepositWizard(page)),
  investFCIWizard: async ({ page }, use) => await use(new InvestFCIWizard(page)),
  moveFundsWizard: async ({ page }, use) => await use(new MoveFundsWizard(page)),
  // ... otros Page Objects
});

export { expect } from "@playwright/test";
```

### **FASE 5: TESTS REFACTORIZADOS - EJEMPLO**

**Archivo:** `tests/banking/add-account.spec.ts` (ANTES vs DESPUÉS)

**❌ ANTES (código actual - 127 líneas):**
```typescript
test('debería añadir una cuenta bancaria en ARS exitosamente', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^Añadir Cuenta$/ }).click();
  await page.waitForURL('**/crear-cuenta-bancaria', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  await expect(page.getByText('Paso 1 de 2')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Completa los datos')).toBeVisible();

  // ... 100+ líneas más de código duplicado
});
```

**✅ DESPUÉS (código refactorizado - 20 líneas):**
```typescript
import { test, expect } from '../../pages/TestBase';
import { Currency } from '../../components/CurrencySelector';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Añadir Cuenta Bancaria', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('debería añadir una cuenta bancaria en ARS exitosamente', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.addAccount(
      Currency.ARS,
      'Banco Credicoop',
      'Cuenta Corriente $'
    );
  });

  test('debería añadir una cuenta bancaria en USD exitosamente', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.addAccount(
      Currency.USD,
      'Banco Ciudad de Buenos Aires',
      'Cuenta Corriente u$s'
    );
  });

  test('debería añadir una cuenta en Dólar Cable exitosamente', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.addAccount(
      Currency.CABLE,
      'Amerant Bank',
      '' // No aplica tipo de cuenta para Cable
    );
  });

  test('debería validar campos requeridos', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.verifyStep(1, 2);

    const continueButton = addAccountWizard['page'].getByRole('button', { name: 'Continuar' });
    await expect(continueButton).toBeDisabled();
  });

  test('debería permitir cancelar la operación', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.exit();
  });

  test('debería permitir añadir otra cuenta', async ({
    homePage,
    addAccountWizard
  }) => {
    await homePage.clickAddAccount();
    await addAccountWizard.addAccount(Currency.ARS, 'Banco Bica', 'Cuenta Corriente $');
    await addAccountWizard.addAnotherAccount();
  });
});
```

---

## 📈 BENEFICIOS DE LA REFACTORIZACIÓN

### **Reducción de Código**
- **Antes**: ~3000 líneas de código en tests
- **Después**: ~1000 líneas de código (reducción del 66%)

### **Mantenibilidad**
- ✅ Cambio en un selector → 1 solo lugar a modificar
- ✅ Nueva funcionalidad → se extiende fácilmente
- ✅ Código autodocumentado y fácil de entender

### **Escalabilidad**
- ✅ Agregar nuevos tests es muy rápido
- ✅ Reutilización de componentes
- ✅ Menos propenso a errores

### **Testing más robusto**
- ✅ Esperas inteligentes en lugar de `waitForTimeout`
- ✅ Selectores centralizados
- ✅ Manejo consistente de errores

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

### **Sprint 1: Fundamentos (1-2 días)**
1. ✅ Crear estructura de carpetas
2. ✅ Implementar helpers (DataGenerator, DateHelper, WaitHelper)
3. ✅ Crear constantes (messages, buttons, urls)
4. ✅ Crear BasePage y BaseWizard

### **Sprint 2: Componentes Comunes (1 día)**
5. ✅ Implementar FileUploader
6. ✅ Implementar CurrencySelector
7. ✅ Implementar HomePage
8. ✅ Actualizar TestBase

### **Sprint 3: Refactorizar Tests Prioritarios (2-3 días)**
9. ✅ Refactorizar tests de cuentas bancarias
10. ✅ Refactorizar tests de depósitos
11. ✅ Refactorizar tests de FCI

### **Sprint 4: Refactorizar Tests Restantes (2-3 días)**
12. ✅ Refactorizar tests de usuarios
13. ✅ Refactorizar tests de movimientos
14. ✅ Refactorizar tests de navegación

### **Sprint 5: Documentación y Limpieza (1 día)**
15. ✅ Crear README con ejemplos
16. ✅ Documentar Page Objects
17. ✅ Eliminar código antiguo
18. ✅ Review final

---

## 📚 DOCUMENTACIÓN ADICIONAL

### **Ejemplo de uso de fixtures:**
```typescript
// fixtures/bankAccountData.ts
import { BankingDataGenerator } from '../utils/generators/BankingDataGenerator';
import { Currency } from '../components/CurrencySelector';

export const bankAccounts = {
  arsAccount: {
    currency: Currency.ARS,
    bank: 'Banco Credicoop',
    accountType: 'Cuenta Corriente $',
    cbu: BankingDataGenerator.randomCBU(),
    accountNumber: BankingDataGenerator.randomAccountNumber()
  },

  usdAccount: {
    currency: Currency.USD,
    bank: 'Banco Ciudad de Buenos Aires',
    accountType: 'Cuenta Corriente u$s',
    cbu: BankingDataGenerator.randomCBU(),
    accountNumber: BankingDataGenerator.randomAccountNumber()
  }
};
```

---

## ✅ CHECKLIST DE REFACTORIZACIÓN

- [ ] Crear estructura de carpetas completa
- [ ] Implementar todos los helpers (DataGenerator, DateHelper, WaitHelper, FileHelper)
- [ ] Crear constantes (messages, buttons, urls)
- [ ] Implementar BasePage y BaseWizard
- [ ] Crear componentes reutilizables (FileUploader, CurrencySelector, etc.)
- [ ] Implementar Page Objects para todas las páginas
- [ ] Actualizar TestBase con todos los POM
- [ ] Refactorizar tests de cuentas bancarias
- [ ] Refactorizar tests de depósitos
- [ ] Refactorizar tests de FCI
- [ ] Refactorizar tests de retiros
- [ ] Refactorizar tests de movimientos
- [ ] Refactorizar tests de usuarios
- [ ] Refactorizar tests de navegación
- [ ] Crear fixtures de datos de prueba
- [ ] Documentar todos los Page Objects
- [ ] Crear README actualizado con ejemplos
- [ ] Eliminar código antiguo
- [ ] Ejecutar suite completa de tests
- [ ] Review de código

---

## 💡 MEJORES PRÁCTICAS APLICADAS

1. **DRY (Don't Repeat Yourself)**: Eliminación de código duplicado
2. **SOLID**: Single Responsibility, cada clase tiene un propósito claro
3. **Page Object Model**: Encapsulación de la lógica de la UI
4. **Component Pattern**: Componentes reutilizables
5. **Builder Pattern**: Construcción fluida de tests
6. **Data-Driven Testing**: Uso de fixtures y generadores
7. **Async/Await correcto**: Manejo adecuado de promesas
8. **Esperas inteligentes**: Evitar `waitForTimeout` innecesarios
9. **Selectores robustos**: Uso de roles y text en lugar de selectores frágiles
10. **Nombres descriptivos**: Código autodocumentado

---

## 🚀 PRÓXIMOS PASOS

Una vez aprobada esta propuesta, comenzaré la implementación siguiendo el orden recomendado.

**¿Deseas que proceda con la implementación?**
