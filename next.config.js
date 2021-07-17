const withPWA = require('next-pwa');

const isProd = process.env.NODE_ENV === 'production';

module.exports = withPWA({
  i18n: {
    locales: ['es-CL'],
    defaultLocale: 'es-CL',
  },
  pwa: {
    disable: !isProd,
    dest: 'public',
  },
});
