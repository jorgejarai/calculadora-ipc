interface IProps {
  amount: number;
  variation: number;
}

export const AdjustedAmount = ({ amount, variation }: IProps) => (
  <div className='mx-4 mt-8 w-11/12 md:w-96 h-36 flex flex-col items-center justify-center rounded-lg bg-white shadow-md space-y-2'>
    <div className='text-xl'>El valor ajustado es:</div>
    <div className='text-3xl'>
      {amount.toFixed(0).length > 13
        ? `\$${amount.toExponential(10).replace('.', ',')}`
        : amount.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
          })}
    </div>
    <div className='text-lg'>
      {variation === 1
        ? `Sin variación`
        : `Variación: ${(variation - 1).toLocaleString('es-CL', {
            style: 'percent',
            minimumFractionDigits: 1,
          })}`}
    </div>
  </div>
);
