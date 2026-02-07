import { faker } from '@faker-js/faker/locale/es';

/**
 * Generador de datos aleatorios para tests
 * Usa faker.js para generar datos realistas
 */
export class DataGenerator {
  /**
   * Genera datos de usuario aleatorios
   */
  static randomUser() {
    return {
      email: faker.internet.email(),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: faker.string.numeric(10)
    };
  }

  /**
   * Genera un monto aleatorio
   * @param min - Monto mínimo (default: 1)
   * @param max - Monto máximo (default: 99999999)
   */
  static randomAmount(min: number = 1, max: number = 99999999): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Genera un string numérico de longitud específica
   * @param length - Longitud del string numérico
   */
  static randomNumeric(length: number): string {
    return faker.string.numeric(length);
  }

  /**
   * Genera texto aleatorio
   * @param wordCount - Cantidad de palabras (default: 3)
   */
  static randomText(wordCount: number = 3): string {
    return faker.lorem.words(wordCount);
  }

  /**
   * Genera un email aleatorio
   */
  static randomEmail(): string {
    return faker.internet.email();
  }

  /**
   * Genera un nombre aleatorio
   */
  static randomFirstName(): string {
    return faker.person.firstName();
  }

  /**
   * Genera un apellido aleatorio
   */
  static randomLastName(): string {
    return faker.person.lastName();
  }

  /**
   * Genera un número de teléfono aleatorio
   * @param digits - Cantidad de dígitos (default: 10)
   */
  static randomPhone(digits: number = 10): string {
    return faker.string.numeric(digits);
  }
}
