import { MonthYear } from 'src/components/MonthDayPicker';

export type Variation = {
  year: number;
  month: number;
  variation: number;
};

export const calculateVariation = (
  data: Variation[],
  from: MonthYear,
  until: MonthYear
): number | undefined => {
  // Retornamos undefined si el intervalo es inválido
  if (
    from.year > until.year ||
    (from.year === until.year && from.month > until.month)
  ) {
    return undefined;
  }

  // No es la solución más elegante, pero para calcular
  // la variación, recorremos toda la lista de variaciones
  // y multiplicamos los valores que estén dentro del
  // intervalo deseado
  return data.reduce((acc, cur) => {
    // Saltamos los años anteriores a la fecha de inicio
    if (cur.year < from.year) {
      return acc;
    }

    // Si estamos en el año de inicio, saltamos hasta llega al mes de inicio
    if (cur.year === from.year && cur.month < from.month) {
      return acc;
    }

    // Si estamos en el año de término, saltamos los meses posteriores al
    // mes de término
    if (cur.year === until.year && cur.month > until.month - 1) {
      return acc;
    }

    // Si ya pasamos el año de término, saltamos las entradas restantes
    if (cur.year > until.year) {
      return acc;
    }

    return acc * (1 + cur.variation);
  }, 1);
};
