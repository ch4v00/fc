# 🎯 PRÓXIMOS PASOS - Refactorización Playwright

## ✅ LO QUE YA ESTÁ LISTO

### **Infraestructura Completa** (100%)
- ✅ Helpers de generación de datos
- ✅ Helpers de espera y navegación
- ✅ Constantes centralizadas
- ✅ Clases base (BasePage, BaseWizard)
- ✅ Componentes reutilizables
- ✅ Page Objects principales

### **Archivos Creados** (30 archivos)
```
✅ utils/generators/ (3 archivos)
✅ utils/helpers/ (3 archivos)
✅ utils/constants/ (3 archivos)
✅ pages/base/ (2 archivos)
✅ pages/auth/ (1 archivo)
✅ pages/common/ (2 archivos)
✅ pages/banking/ (2 archivos)
✅ pages/investments/ (2 archivos)
✅ components/ (4 archivos)
✅ tests/banking/ (1 test de ejemplo)
✅ Documentación (4 archivos)
```

---

## 🚀 CÓMO CONTINUAR

Tienes **3 opciones** para continuar:

### **Opción 1: Refactorizar los Tests Restantes** ⭐ RECOMENDADO

Ya tienes todos los Page Objects necesarios. Ahora puedes refactorizar los tests originales usando lo que ya está creado.

**Archivos a refactorizar:**
1. ✅ `tests/cuentas.spec.ts` → Ya tienes ejemplo en `tests/banking/add-account.refactored.spec.ts`
2. ⬜ `tests/depositos.spec.ts` → Usar `DepositWizard`
3. ⬜ `tests/invertirFCI.spec.ts` → Usar `InvestFCIWizard`
4. ⬜ `tests/movimientos.spec.ts` → Usar `MoveFundsWizard`
5. ⬜ `tests/retirosFCI.spec.ts` → Crear `WithdrawFCIWizard` (similar a InvestFCIWizard)
6. ⬜ `tests/newUser.spec.ts` → Crear `AddUserWizard` (similar a AddAccountWizard)
7. ⬜ `tests/fondos.spec.ts` → Usar `InvestFCIWizard`
8. ⬜ `tests/fondosPortfolio.spec.ts` → Crear `PortfolioPage`
9. ⬜ `tests/validarNavegacion.spec.ts` → Crear `NavigationPage`

**Proceso:**
1. Tomar un archivo (ej: `tests/depositos.spec.ts`)
2. Crear el archivo refactorizado (ej: `tests/banking/deposits.refactored.spec.ts`)
3. Reescribir cada test usando los Page Objects
4. Ejecutar y verificar que pase
5. Repetir con el siguiente archivo

**Tiempo estimado:** 2-3 horas por archivo = 1-2 días total

---

### **Opción 2: Crear Page Objects Faltantes**

Completar los Page Objects que aún no existen:

**Por crear:**
1. ⬜ `WithdrawFCIWizard.ts` - Para rescate de FCI
2. ⬜ `AddUserWizard.ts` - Para añadir usuarios
3. ⬜ `PortfolioPage.ts` - Para navegación de portfolio
4. ⬜ `NavigationPage.ts` - Para tests de navegación

**Tiempo estimado:** 2-3 horas

---

### **Opción 3: Ejecutar y Validar lo Actual**

Probar que todo lo implementado funcione correctamente:

```bash
# 1. Ejecutar el test de ejemplo
npx playwright test tests/banking/add-account.refactored.spec.ts

# 2. Ver el reporte
npm run report

# 3. Si hay errores, ajustar
```

**Tiempo estimado:** 30 minutos

---

## 📋 PLAN RECOMENDADO (Orden Sugerido)

### **Día 1: Validación y Tests Prioritarios**
1. ✅ Ejecutar test de ejemplo
2. ⬜ Refactorizar `tests/depositos.spec.ts` (usa `DepositWizard` que ya existe)
3. ⬜ Refactorizar `tests/movimientos.spec.ts` (usa `MoveFundsWizard` que ya existe)

### **Día 2: Inversiones**
4. ⬜ Refactorizar `tests/invertirFCI.spec.ts` (usa `InvestFCIWizard`)
5. ⬜ Crear `WithdrawFCIWizard.ts`
6. ⬜ Refactorizar `tests/retirosFCI.spec.ts`

### **Día 3: Usuarios y Portfolio**
7. ⬜ Crear `AddUserWizard.ts`
8. ⬜ Refactorizar `tests/newUser.spec.ts`
9. ⬜ Crear `PortfolioPage.ts`
10. ⬜ Refactorizar `tests/fondosPortfolio.spec.ts`

### **Día 4: Navegación y Limpieza**
11. ⬜ Crear `NavigationPage.ts`
12. ⬜ Refactorizar `tests/validarNavegacion.spec.ts`
13. ⬜ Eliminar archivos `.spec.ts` originales (hacer backup)
14. ⬜ Renombrar `.refactored.spec.ts` a `.spec.ts`

---

## 💡 EJEMPLO: Refactorizar depositos.spec.ts

### **Paso 1: Crear archivo nuevo**
```bash
touch tests/banking/deposits.refactored.spec.ts
```

### **Paso 2: Template básico**
```typescript
import { test, expect } from '../../pages/TestBase';
import { Currency } from '../../components/CurrencySelector';
import { DepositType } from '../../pages/banking/DepositWizard';

test.use({ storageState: 'authentication/.auth/user.json' });

test.describe('Informar Depósito - Refactorizado', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('transferencia bancaria en ARS', async ({ homePage, depositWizard }) => {
    await homePage.clickInformDeposit();
    await depositWizard.informBankTransfer(Currency.ARS, 'Banco de Galicia y Bs. As. SA');
  });

  test('transferencia bancaria en USD', async ({ homePage, depositWizard }) => {
    await homePage.clickInformDeposit();
    await depositWizard.informBankTransfer(Currency.USD, 'Banco de Galicia y Bs. As. SA');
  });

  test('Echeq exitoso', async ({ homePage, depositWizard }) => {
    await homePage.clickInformDeposit();
    await depositWizard.informEcheq();
  });

  // ... más tests
});
```

### **Paso 3: Ejecutar**
```bash
npx playwright test tests/banking/deposits.refactored.spec.ts
```

### **Paso 4: Comparar**
- Original: `tests/depositos.spec.ts` (~513 líneas)
- Refactorizado: `tests/banking/deposits.refactored.spec.ts` (~150 líneas estimadas)
- **Reducción: 70%** 🎉

---

## 🎓 GUÍA RÁPIDA DE REFACTORIZACIÓN

### **Patrón común en tests originales:**
```typescript
// ❌ ANTES - Código duplicado
test('test original', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.locator('div').filter({ hasText: /^Acción$/ }).click();
  await page.waitForURL('**/url', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const monto = Math.floor(Math.random() * 99999999) + 1;
  await page.getByRole('textbox', { name: 'Ingresá el monto' }).fill(monto.toString());

  const today = new Date();
  const fecha = `${today.getDate().toString().padStart(2, '0')}/...`;
  await page.locator('input[placeholder="dd/mm/aaaa"]').fill(fecha);

  // ... 50+ líneas más
});
```

### **Transformar a:**
```typescript
// ✅ DESPUÉS - Código limpio
test('test refactorizado', async ({ homePage, wizardName }) => {
  await homePage.goto();
  await homePage.clickActionMethod();

  await wizardName.completeFlow(params);
});
```

---

## 🔍 CHECKLIST POR TEST

Cuando refactorices cada test, verifica:

- [ ] ¿Usa `homePage.goto()` en lugar de `page.goto('/')`?
- [ ] ¿Usa Page Objects en lugar de selectores directos?
- [ ] ¿Usa `DataGenerator` o `BankingDataGenerator` para datos random?
- [ ] ¿Usa `DateHelper.getCurrentDate()` para fechas?
- [ ] ¿Usa `Currency` enum en lugar de selectores manuales?
- [ ] ¿Evita `waitForTimeout` innecesarios?
- [ ] ¿El test tiene menos de 15 líneas?
- [ ] ¿El código es autodescriptivo?

---

## 🎯 OBJETIVO FINAL

**Transformar esto (test actual):**
```
tests/cuentas.spec.ts          - 450 líneas
tests/depositos.spec.ts        - 513 líneas
tests/invertirFCI.spec.ts      - 454 líneas
tests/movimientos.spec.ts      - 334 líneas
tests/retirosFCI.spec.ts       - 665 líneas
tests/newUser.spec.ts          - 236 líneas
tests/fondos.spec.ts           - 479 líneas
tests/fondosPortfolio.spec.ts  - 409 líneas
tests/validarNavegacion.spec.ts - 564 líneas
-------------------------------------------
TOTAL: ~4104 líneas
```

**En esto (tests refactorizados):**
```
tests/banking/add-account.spec.ts      - ~120 líneas
tests/banking/deposits.spec.ts         - ~150 líneas
tests/investments/invest-fci.spec.ts   - ~130 líneas
tests/investments/move-funds.spec.ts   - ~100 líneas
tests/investments/withdraw-fci.spec.ts - ~120 líneas
tests/users/add-user.spec.ts           - ~100 líneas
tests/investments/funds.spec.ts        - ~130 líneas
tests/portfolio/portfolio.spec.ts      - ~120 líneas
tests/navigation/navigation.spec.ts    - ~150 líneas
-------------------------------------------
TOTAL: ~1220 líneas
```

**Reducción total: 70% menos código** 🚀

---

## 📞 ¿NECESITAS AYUDA?

**Documentación disponible:**
- `README_REFACTORED.md` - Guía completa con ejemplos
- `REFACTORING_PROPOSAL.md` - Propuesta detallada
- `IMPLEMENTATION_SUMMARY.md` - Resumen de lo implementado
- `tests/banking/add-account.refactored.spec.ts` - Test de ejemplo

**Para cada Page Object:**
- Todos tienen comentarios JSDoc
- Métodos autodescriptivos
- Ejemplos de uso en los comentarios

---

## 🚀 ¡A REFACTORIZAR!

**Comando para empezar:**
```bash
# Opción 1: Refactorizar depositos.spec.ts
code tests/banking/deposits.refactored.spec.ts

# Opción 2: Crear WithdrawFCIWizard
code pages/investments/WithdrawFCIWizard.ts

# Opción 3: Ejecutar test de ejemplo
npx playwright test tests/banking/add-account.refactored.spec.ts --headed
```

**¿Listo para continuar?** 💪
