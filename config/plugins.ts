export default ({ env }) => ({
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'smtp-relay.brevo.com'),
                port: env.int('SMTP_PORT', 587),
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                // For port 465 (SMTPS), we must set secure: true
                // For port 587 (STARTTLS), we must set secure: false
                secure: env.bool('SMTP_SECURE', env.int('SMTP_PORT') === 465),
                tls: {
                    rejectUnauthorized: false,
                    // minVersion: 'TLSv1.2'
                },
                connectionTimeout: 10000, // 10 seconds timeout
            },
            settings: {
                defaultFrom: env('SMTP_FROM', 'support@creatymu.org'),
                defaultReplyTo: env('SMTP_REPLY_TO', 'support@creatymu.org'),
            },
        },
    },
});

// Diagnostic logging - help debug Railway env issues
const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
const port = process.env.SMTP_PORT || '587';
const secure = process.env.SMTP_SECURE || (port === '465' ? 'true' : 'false');
const user = process.env.SMTP_USERNAME ? '(set)' : '(not set)';

console.log(`[EMAIL CONFIG] Host: ${host} | Port: ${port} | Secure: ${secure} | User: ${user}`);


