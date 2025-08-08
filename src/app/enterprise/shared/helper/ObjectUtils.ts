export class ObjectUtils {

  /**
   * Emula NVL de Oracle.
   * Devuelve defaultValue si value es null o undefined; 
   * en caso contrario devuelve value.
   *
   * @param value         Valor a comprobar
   * @param defaultValue  Valor por defecto si value es null/undefined
   */
  static nvl<T>(value: T | null | undefined, defaultValue: T): T {
    return value ?? defaultValue;
  }

  /**
   * Emula DECODE de Oracle:
   * decode(expr, search1, result1, search2, result2, ..., [defaultValue])
   *
   * - expr: valor a comparar
   * - args: pares (search, result) y opcionalmente un valor por defecto al final
   *
   * Ejemplo:
   *   ObjectUtils.decode(
   *     estado,
   *     'P', 'Pendiente',
   *     'E', 'Enviado',
   *     'C', 'Cancelado',
   *     'Desconocido'  // valor por defecto
   *   );
   */
  static decode<T, R>(expr: T, ...args: any[]): R | undefined {
    const hasDefault = args.length % 2 === 1;
    const defaultValue = hasDefault ? args[args.length - 1] as R : undefined;
    const pairsLen = hasDefault ? args.length - 1 : args.length;

    for (let i = 0; i < pairsLen; i += 2) {
      if (expr === args[i] as T) {
        return args[i + 1] as R;
      }
    }
    return defaultValue;
  }

}
