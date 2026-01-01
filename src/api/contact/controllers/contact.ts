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

            const brevoApiKey = process.env.BREVO_API_KEY;
            if (!brevoApiKey) {
                strapi.log.error('BREVO_API_KEY is not defined in environment variables');
                return ctx.internalServerError('Email configuration error: API Key missing');
            }

            const emailData = {
                sender: { name: 'Creaty Site Contact', email: 'support@creatymu.org' },
                to: [{ email: 'support@creatymu.org' }],
                replyTo: { email: email, name: name },
                subject: `New contact message from ${name}`,
                htmlContent: `
<h3>New contact message from ${name}</h3>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Service:</strong> ${service || 'Not specified'}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
                `,
                textContent: `
Name: ${name}
Email: ${email}
Service: ${service || 'Not specified'}

Message:
${message}
                `,
            };

            strapi.log.info(`Attempting to send contact email via Brevo API...`);

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
                throw new Error(`Brevo API returned ${response.status}: ${errorBody}`);
            }

            strapi.log.info('Email sent successfully via Brevo API.');

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
