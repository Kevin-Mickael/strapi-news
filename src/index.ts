import type { Core } from '@strapi/strapi';

export default {
  register() { },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    console.log('--- Creaty Bootstrap Started ---');
    try {
      // Give public permissions for Articles and Comments
      // @ts-ignore
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' }, populate: ['permissions'] });

      if (publicRole) {
        console.log('Found Public Role, checking permissions...');
        const actionsToGrant = [
          'api::article.article.find',
          'api::article.article.findOne',
          'api::comment.comment.find',
          'api::comment.comment.create'
        ];

        // @ts-ignore
        const existingActions = publicRole.permissions.map((p: any) => p.action);

        for (const action of actionsToGrant) {
          if (!existingActions.includes(action)) {
            console.log(`Granting ${action} to Public...`);
            // @ts-ignore
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: publicRole.id
              }
            });
          }
        }
        console.log('Permissions check completed.');
      } else {
        console.warn('Public role not found. Permissions not granted.');
      }
    } catch (err) {
      console.error('Error in Creaty Bootstrap:', err);
    }
    console.log('--- Creaty Bootstrap Finished ---');
  },
};
