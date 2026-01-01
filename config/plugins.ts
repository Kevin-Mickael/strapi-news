export default ({ env }) => {
    const smtpHost = env('SMTP_HOST', 'smtp-relay.brevo.com');
    const smtpPort = env.int('SMTP_PORT', 587);
    const smtpUser = env('SMTP_USERNAME');
    const smtpPass = env('SMTP_PASSWORD');
    const smtpSecure = env.bool('SMTP_SECURE', smtpPort === 465);

    console.log(`[EMAIL CONFIG RUNTIME] Host: ${smtpHost} | Port: ${smtpPort} | Secure: ${smtpSecure} | User: ${smtpUser ? 'Set' : 'Not Set'}`);

    return {
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
                    host: smtpHost,
                    port: smtpPort,
                    auth: {
                        user: smtpUser,
                        pass: smtpPass,
                    },
                    secure: smtpSecure,
                    tls: {
                        rejectUnauthorized: false,
                    },
                    connectionTimeout: 20000, // 20 seconds
                    greetingTimeout: 20000,
                    socketTimeout: 20000,
                },
                settings: {
                    defaultFrom: env('SMTP_FROM', 'support@creatymu.org'),
                    defaultReplyTo: env('SMTP_REPLY_TO', 'support@creatymu.org'),
                },
            },
        },
    };
};

// Diagnostic logging - build time
console.log(`[EMAIL CONFIG BUILD TIME] SMTP_PORT: ${process.env.SMTP_PORT || 'Default 587'}`);



