import { useEffect } from 'react';

import { IListValue, Listbox } from 'src/components/Listbox';
import { Variation } from 'src/variation';

export type MonthYear = {
  month: number;
  year: number;
};

interface IProps {
  data: Variation[];
  monthYear: MonthYear;
  onChange: (monthYear: MonthYear) => void;
  type: 'start' | 'end';
}

const getYears = (data: Variation[]): IListValue[] => {
  const yearsSet = new Set<number>();

  data.forEach((entry) => {
    yearsSet.add(entry.year);
  });

  return Array.from(yearsSet)
    .reverse()
    .map((year) => ({
      value: year,
      label: `${year}`,
    }));
};

const getValidMonths = (data: Variation[], year: number): IListValue[] => {
  if (!data.some((entry) => entry.year == year)) {
    return [];
  }

  const ret = new Set<number>();
  data.forEach((entry) => {
    if (entry.year != year) return;

    ret.add(entry.month);
  });

  // Cuando el año que estamos revisando es el actual, no vamos a tener las
  // entradas para los 12 meses (p. ej. si estamos en junio, la última entrada
  // será la de mayo), por lo que hay que añadir el mes actual a la lista
  if (ret.has(1) && ret.size != 12) {
    const lastMonth = Math.max(...(Array.from(ret.values()) as number[]));

    ret.add(lastMonth + 1);
  }

  return Array.from(ret).map((month) => {
    const monthDate = new Date(2021, month - 1);
    const monthName = monthDate.toLocaleString('es-CL', { month: 'long' });

    return {
      value: month,
      label: `${monthName}`,
    };
  });
};

export const MonthDayPicker = ({ data, monthYear, onChange, type }: IProps) => {
  const years = getYears(data);
  const yearMonths = getValidMonths(data, monthYear.year);

  // Como el historial del IPC comienza en marzo de 1928, si pasamos, por
  // ejemplo, de febrero de 1930 a 1928, el mes seleccionado va a cambiarse
  // automáticamente a marzo, que es la primera entrada de ese año. Algo análogo
  // sucede cuando el año seleccionado es el año en curso, al cual le van a
  // faltar meses al final
  useEffect(() => {
    if (
      type === 'start' &&
      !yearMonths.some(({ value }) => value === monthYear.month)
    ) {
      onChange({ ...monthYear, month: yearMonths[0].value });
    } else if (
      type === 'end' &&
      !yearMonths.some(({ value }) => value === monthYear.month)
    ) {
      onChange({
        ...monthYear,
        month: yearMonths[yearMonths.length - 1].value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthYear.year]);

  return (
    <div className='flex space-x-2'>
      <Listbox
        options={yearMonths}
        selected={monthYear.month}
        setSelected={(month) => onChange({ ...monthYear, month })}
        width='large'
      />
      <Listbox
        options={years}
        selected={monthYear.year}
        setSelected={(year) => onChange({ ...monthYear, year })}
        width='small'
      />
    </div>
  );
};
