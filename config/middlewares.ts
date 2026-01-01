export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://static.cloudflareinsights.com', 'https://*.strapi.io'],
          'script-src-elem': ["'self'", "'unsafe-inline'", 'https://static.cloudflareinsights.com', 'https://*.strapi.io'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'res.cloudinary.com',
            'strapi.io',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://creatymu.org', 'https://www.creatymu.org', 'http://localhost:5500', 'http://127.0.0.1:5500'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  {
    name: 'strapi::rateLimit',
    config: {
      interval: 60 * 1000, // 1 minute
      max: 100,            // 100 requêtes par IP par minute
      keyGenerator(ctx) {
        return ctx.ip; // Rate limit par adresse IP
      },
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
