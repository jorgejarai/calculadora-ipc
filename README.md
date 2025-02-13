# Calculadora IPC

Esta pequeña _app_ permite calcular la variación del valor del peso chileno (CLP) utilizando información del Índice de Precios al Consumidor (IPC). Esta información es obtenida desde la propia [aplicación](https://calculadoraipc.ine.cl/) del Instituto Nacional de Estadísticas, quien está a cargo de computar este índice todos los meses.

Decidí crear esta aplicación porque, aunque la que ofrece el INE es totalmente funcional, pensé que sería una buena idea crear una versión propia, además de la aplicación no necesita llamar a una API cada vez que se quiere calcular una variación, pues los valores se descargan localmente cuando carga la página.

## Cómo funciona

La _app_ está hecha con Next.js, que obtiene la variación mensual del IPC a partir de una tabla de Google Sheets, la cual es alimentada mediante un script Python a partir de la misma API que usa la calculadora del INE. Esta información es incrustada de forma estática en la página mediante SSR con una frecuencia de 6 horas, para reducir la cantidad de consultas a servicios externos.

La tabla de Google contiene la variación de cada mes desde marzo de 1928, calculada desde la API como la variación de $ 1000 millones de un mes al otro, para así rescatar la tasa con un buen número de decimales. El formato en la hoja de cálculo es el siguiente:

```
   |   A   |   B   |   C
---+-------+-------+--------
 1 | <año> | <mes> | <tasa>
 2 | <año> | <mes> | <tasa>
 3 | <año> | <mes> | <tasa>
 4 | <año> | <mes> | <tasa>
 5 |  ...  |  ...  |   ...
```

## Variables de entorno

- `PROJECT_ID`, `PRIVATE_KEY`, `CLIENT_EMAIL`, `CLIENT_ID`: parámetros de credenciales de Google Cloud, usadas para acceder a la planilla de cálculos. Pueden extraerse del archivo JSON que Google Cloud genera al crear una cuenta de servicio, la cual tiene que tener acceso a la API de Google Sheets.
- `CREDENTIAL_TYPE`: Si se utiliza una cuenta de servicio para acceder a la API de Google, debe tener el valor `service_account`.
- `SPREADSHEET_ID`: ID de la planilla de cálculo. Se puede extraer de la URL en el editor de Google Sheets.
- `SHEET_NAME`: El nombre de la hoja donde están los valores almacenados.
