/**
 * Helper para manejo de fechas
 * IMPORTANTE: Siempre usa la fecha actual del día para los tests
 */
export class DateHelper {
  /**
   * Retorna la fecha actual en formato dd/mm/yyyy
   * Este método SIEMPRE debe usarse para campos de fecha en los tests
   */
  static getCurrentDate(): string {
    const today = new Date();
    return this.formatDate(today);
  }

  /**
   * Formatea una fecha al formato dd/mm/yyyy
   * @param date - Fecha a formatear
   */
  static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Retorna una fecha con X días sumados a la fecha actual
   * @param days - Días a sumar (puede ser negativo para restar)
   */
  static addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.formatDate(date);
  }

  /**
   * Retorna la fecha de mañana
   */
  static getTomorrow(): string {
    return this.addDays(1);
  }

  /**
   * Retorna la fecha de ayer
   */
  static getYesterday(): string {
    return this.addDays(-1);
  }

  /**
   * Retorna una fecha X meses en el futuro
   * @param months - Meses a sumar
   */
  static addMonths(months: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return this.formatDate(date);
  }
}
