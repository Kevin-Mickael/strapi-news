export default {
    async getSitemap(ctx) {
        try {
            const xml = await strapi.service('api::seo.seo').generateSitemap();
            ctx.set('Content-Type', 'application/xml');
            ctx.body = xml;
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    async getRSS(ctx) {
        try {
            const xml = await strapi.service('api::seo.seo').generateRSS();
            ctx.set('Content-Type', 'application/xml');
            ctx.body = xml;
        } catch (err) {
            ctx.throw(500, err);
        }
    },
};
