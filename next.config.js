const isProd = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  disable: !isProd,
  dest: 'public',
});

module.exports = withPWA({
  i18n: {
    locales: ['es-CL'],
    defaultLocale: 'es-CL',
  },
});
