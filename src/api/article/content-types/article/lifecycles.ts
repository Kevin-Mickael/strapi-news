const { errors } = require('@strapi/utils');

export default {
    async beforeCreate(event: any) {
        const { data } = event.params;
        if (data.epingle === true) {
            const pinnedCount = await strapi.documents('api::article.article').count({
                filters: { epingle: true, status: 'published' } as any
            });

            if (pinnedCount >= 3) {
                throw new errors.ApplicationError('Vous ne pouvez pas épingler plus de 3 articles.');
            }
        }
    },

    async beforeUpdate(event: any) {
        const { data, where } = event.params;

        // Check if epingle is being updated to true
        if (data.epingle === true) {
            const pinnedArticles = await strapi.documents('api::article.article').findMany({
                filters: { epingle: true, status: 'published' } as any
            });

            // Filter out the current article being updated
            const otherPinnedArticles = pinnedArticles.filter(art => art.documentId !== where.documentId);

            if (otherPinnedArticles.length >= 3) {
                throw new errors.ApplicationError('Vous ne pouvez pas épingler plus de 3 articles.');
            }
        }
    },
};

