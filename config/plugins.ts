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
                host: env('SMTP_HOST', 'smtp.example.com'),
                port: env.int('SMTP_PORT', 587),
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                tls: {
                    rejectUnauthorized: false,
                },
                // secure: false for port 587 (STARTTLS), true for 465 (SSL)
                secure: env.bool('SMTP_SECURE', false),
            },
            settings: {
                defaultFrom: env('SMTP_FROM', 'no-reply@creatymu.org'),
                defaultReplyTo: env('SMTP_REPLY_TO', 'support@creatymu.org'),
            },
        },
    },
});

// Diagnostic logging
console.log('EMAIL CONFIG: Loading email provider config');
console.log('EMAIL CONFIG: Host:', process.env.SMTP_HOST);
console.log('EMAIL CONFIG: Port:', process.env.SMTP_PORT);
console.log('EMAIL CONFIG: User:', process.env.SMTP_USERNAME ? '(set)' : '(not set)');

