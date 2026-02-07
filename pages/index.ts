/**
 * Index file for all Page Objects and Wizards
 * Exports all wizards for easy importing in tests
 */

// Base
export { BaseWizard } from './base/BaseWizard';

// Banking Wizards - Spanish
export { AgregarCuentaWizard } from './banking/AgregarCuentaWizard';
export { DepositoWizard, TipoDeposito } from './banking/DepositoWizard';
export { SolicitarFondosWizard, MetodoRetiro, Moneda } from './banking/SolicitarFondosWizard';

// Investment Wizards - Spanish
export { InvertirFCIWizard, TipoFondo, AccionFCI } from './investments/InvertirFCIWizard';
export { MoverFondosWizard } from './investments/MoverFondosWizard';
export { SuscribirFCIWizard } from './investments/SuscribirFCIWizard';
export { RescatarFCIWizard } from './investments/RescatarFCIWizard';
export { RescatarFCIDesdeInversionesWizard } from './investments/RescatarFCIDesdeInversionesWizard';

// User Wizards - Spanish
export { AgregarUsuarioWizard, DatosUsuario } from './users/AgregarUsuarioWizard';

// Common Components
export { SuccessModal } from './common/SuccessModal';
