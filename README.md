# Calculadora IPC

Esta pequeña _app_ permite calcular la variación del valor del peso chileno (CLP) utilizando información del Índice de Precios al Consumidor, mejor conocido como IPC. Esta información es obtenida desde la propia [aplicación](https://calculadoraipc.ine.cl/) del Instituto Nacional de Estadísticas, quien está a cargo de computar este índice todos los meses.

Decidí crear esta aplicación porque, aunque la que ofrece el INE es totalmente funcional, pensé que sería una buena idea crear una versión propia con tecnologías más modernas.

## Cómo funciona

La _app_ está hecha con Next.js, que obtiene la variación mensual del IPC a partir de una tabla de Google Sheets, la cual es alimentada mediante un script Python a partir de la misma API que usa la calculadora del INE. Esta información es incrustada de forma estática en la página mediante SSR con una frecuencia de 86400 segundos (un día), para reducir consultas a API externas.

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
