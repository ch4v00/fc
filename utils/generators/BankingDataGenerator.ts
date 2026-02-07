/**
 * Generador de datos bancarios aleatorios
 * Genera CBU, SWIFT, ABA y otros datos bancarios para testing
 */
export class BankingDataGenerator {
  /**
   * Genera un CBU aleatorio (22 dígitos)
   * CBU = Clave Bancaria Uniforme (Argentina)
   */
  static randomCBU(): string {
    let cbu = '';
    for (let i = 0; i < 22; i++) {
      cbu += Math.floor(Math.random() * 10).toString();
    }
    return cbu;
  }

  /**
   * Genera un código SWIFT aleatorio (8 caracteres)
   * SWIFT = Society for Worldwide Interbank Financial Telecommunication
   */
  static randomSWIFT(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let swift = '';
    for (let i = 0; i < 8; i++) {
      swift += letters[Math.floor(Math.random() * letters.length)];
    }
    return swift;
  }

  /**
   * Genera un código ABA aleatorio (9 dígitos)
   * ABA = American Bankers Association routing number
   */
  static randomABA(): string {
    let aba = '';
    for (let i = 0; i < 9; i++) {
      aba += Math.floor(Math.random() * 10).toString();
    }
    return aba;
  }

  /**
   * Genera un número de cuenta aleatorio (8-12 dígitos)
   */
  static randomAccountNumber(): string {
    const length = Math.floor(Math.random() * 5) + 8; // entre 8 y 12 dígitos
    let number = '';
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    return number;
  }

  /**
   * Genera un número de Echeq aleatorio (9 dígitos)
   */
  static randomEcheqNumber(): number {
    return Math.floor(Math.random() * 999999999) + 100000000;
  }
}
