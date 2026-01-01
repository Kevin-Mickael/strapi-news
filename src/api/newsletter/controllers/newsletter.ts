export default {
    async subscribe(ctx) {
        const { email } = ctx.request.body;

        if (!email) {
            return ctx.badRequest('Email is required');
        }

        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegExp.test(email)) {
            return ctx.badRequest('Invalid email format');
        }

        try {
            strapi.log.info(`Newsletter subscription received for: ${email}`);

            const brevoApiKey = process.env.BREVO_API_KEY;
            if (!brevoApiKey) {
                strapi.log.error('BREVO_API_KEY is not defined in environment variables');
                return ctx.internalServerError('Email configuration error: API Key missing');
            }

            const emailData = {
                sender: { name: 'Creaty Newsletter', email: 'support@creatymu.org' },
                to: [{ email: 'support@creatymu.org' }],
                subject: `New Newsletter Subscription: ${email}`,
                htmlContent: `
<h3>New newsletter subscription</h3>
<p><strong>Email:</strong> ${email}</p>
<p>A new user has just subscribed to the newsletter from the website footer.</p>
                `,
                textContent: `
New newsletter subscription
Email: ${email}
A new user has just subscribed to the newsletter from the website footer.
                `,
            };

            strapi.log.info(`Attempting to send newsletter notification via Brevo API...`);

            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': brevoApiKey,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                strapi.log.error(`Brevo API Error (${response.status}): ${errorBody}`);
                throw new Error(`Brevo API returned ${response.status}`);
            }

            strapi.log.info('Newsletter notification sent successfully.');

            return { success: true, message: 'Thank you for subscribing!' };

        } catch (err) {
            strapi.log.error('Newsletter subscription failed:');
            strapi.log.error(err);
            return ctx.internalServerError('Failed to process subscription. Please try again later.');
        }
    },
};
