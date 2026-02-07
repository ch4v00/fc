/**
 * Mensajes y textos de la aplicación
 * Centraliza todos los mensajes para facilitar el mantenimiento
 */
export const MESSAGES = {
  // Mensajes de éxito
  SUCCESS: {
    TITLE: '¡Felicitaciones!',
    SENT_SUCCESSFULLY: 'Tu solicitud fue enviada con éxito',
    USER_CREATED: 'Usuario creado exitosamente',
  },

  // Mensajes de confirmación
  CONFIRMATION: {
    CONFIRM_REQUEST: 'Confirmá tu solicitud',
    CONFIRM_USER: 'Confirmá el alta de usuario',
    CONFIRM_DATA: 'Completa los datos',
  },

  // Indicadores de paso
  STEP: (current: number, total: number) => `Paso ${current} de ${total}`,

  // Mensajes informativos
  INFO: {
    SELECT_OPTION: 'Seleccioná una de las opciones:',
    ACCOUNT_DELAY: 'Las nuevas cuentas tendrán una demora de 24 hs para su habilitación.',
  },

  // Títulos de secciones
  SECTIONS: {
    NEW_USER: 'Nuevo Usuario',
    MOVE_FUNDS: 'Mover fondos',
    INVEST_FCI: 'Invertir en FCI',
    SUBSCRIBE_FUND: 'Suscribir fondo',
  },

  // Mensajes de validación
  VALIDATION: {
    REQUIRED_FIELDS: 'Completá todos los campos requeridos',
  },
};
