export default {
    async send(ctx) {
        const { name, email, message, service } = ctx.request.body;

        // Basic validation
        if (!name || !email || !message) {
            return ctx.badRequest('Missing required fields');
        }

        // Email validation
        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegExp.test(email)) {
            return ctx.badRequest('Invalid email format');
        }

        try {
            strapi.log.info(`Contact message received from: ${email}`);
            const emailOptions = {
                to: 'support@creatymu.org',
                from: process.env.SMTP_FROM || 'support@creatymu.org',
                replyTo: email,
                subject: `New contact message from ${name}`,
                text: `
Name: ${name}
Email: ${email}
Service: ${service || 'Not specified'}

Message:
${message}
                `,
                html: `
<h3>New contact message from ${name}</h3>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Service:</strong> ${service || 'Not specified'}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
                `,
            };

            strapi.log.info(`Attempting to send contact email to support@creatymu.org...`);
            await strapi.plugin('email').service('email').send(emailOptions);
            strapi.log.info('Email sent successfully via Strapi Email Plugin.');

            return { success: true };
        } catch (err) {
            strapi.log.error('Email sending failed in controller:');
            strapi.log.error(err);

            // Detailed error message for debugging
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            const errorStack = err instanceof Error ? err.stack : '';

            strapi.log.error(`Stack: ${errorStack}`);

            return ctx.internalServerError(`Failed to send email: ${errorMessage}. If this persists, check SMTP settings.`);
        }
    },
};
