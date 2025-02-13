import { google } from 'googleapis';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import { AdjustedAmount } from 'src/components/AdjustedAmount';
import { Disclaimer } from 'src/components/Disclaimer';
import { InvalidInterval } from 'src/components/InvalidInterval';
import { MonthDayPicker, MonthYear } from 'src/components/MonthDayPicker';
import { calculateVariation, Variation } from 'src/variation';

interface IProps {
  ipcData: Variation[];
}

const Home = ({ ipcData }: IProps) => {
  const [amount, setAmount] = useState<number | null | undefined>();

  const { month: lastMonth, year: lastYear } = ipcData[ipcData.length - 1];

  let lastEntry: MonthYear;
  if (lastMonth === 12) {
    lastEntry = { month: 1, year: lastYear + 1 };
  } else {
    lastEntry = { month: lastMonth + 1, year: lastYear };
  }

  const [startDate, setStartDate] = useState<MonthYear>(lastEntry);
  const [endDate, setEndDate] = useState<MonthYear>(lastEntry);

  const variation = calculateVariation(ipcData, startDate, endDate);
  const calculatedAmount = amount ? variation * amount : 0;

  return (
    <div className='flex flex-col items-center justify-start min-h-screen py-8 bg-blue-50'>
      <Head>
        <title>Calculadora IPC</title>
        <link rel='icon' href='/favicon.ico' />

        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no'
        />
        <meta
          name='description'
          content='Calcula cuánto ha variado un monto en CLP a lo largo del tiempo'
        />
        <meta name='keywords' content='calculadora,ipc,chile,peso,clp' />
        <meta name='theme-color' content='#EFF6FF' />

        <link rel='apple-touch-icon' href='/images/apple-icon-192.png'></link>
        <link href='/manifest.json' rel='manifest'></link>
      </Head>

      <header>
        <h1 className='text-4xl mb-4'>Calculadora IPC</h1>
      </header>

      <div className='flex flex-col md:flex-row md:space-x-8'>
        <div className='flex flex-col space-y-1 items-center mt-2'>
          <span>Inicio</span>
          <MonthDayPicker
            data={ipcData}
            monthYear={startDate}
            onChange={setStartDate}
            type='start'
          />
        </div>
        <div className='flex flex-col space-y-1 items-center mt-2'>
          <span>Término</span>
          <MonthDayPicker
            data={ipcData}
            monthYear={endDate}
            onChange={setEndDate}
            type='end'
          />
        </div>
      </div>

      <div className='flex flex-col items-center mt-4 mx-14'>
        <label htmlFor='amount'>Monto</label>
        <div className='flex items-center space-x-2'>
          <span className='text-3xl'>$</span>
          <input
            name='amount'
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            maxLength={12}
            type='number'
            className='my-2 relative w-full md:w-60 bg-white py-2 pr-3 text-3xl text-right rounded-lg shadow-md'
          />
        </div>
      </div>

      {startDate.year > endDate.year ||
      (startDate.year === endDate.year && startDate.month > endDate.month) ? (
        <InvalidInterval />
      ) : (
        <AdjustedAmount amount={calculatedAmount} variation={variation} />
      )}

      <Disclaimer />

      <div className='my-5'>
        <a
          href='https://github.com/jorgejarai/calculadora-ipc'
          className='text-4xl'
        >
          <FaGithub />
        </a>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const auth = new google.auth.GoogleAuth({
    projectId: process.env.PROJECT_ID,
    credentials: {
      private_key: process.env.PRIVATE_KEY,
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      type: process.env.CREDENTIAL_TYPE,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  const range = `${process.env.SHEET_NAME}!A:C`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  });

  // Como la tabla está localizada en español, reemplazamos el separador
  // decimal (coma) por un punto
  const ipcData: Variation[] = response.data.values.map((entry) => ({
    year: parseInt(entry[0], 10),
    month: parseInt(entry[1], 10),
    variation: parseFloat(entry[2].replace(',', '.')),
  }));

  return {
    props: { ipcData },
    revalidate: 60 * 60 * 6, // 6 horas
  };
};

export default Home;
