export default ({ env }) => {
    const smtpHost = env('SMTP_HOST', 'smtp-relay.brevo.com');
    const smtpPort = env.int('SMTP_PORT', 587);
    const smtpUser = env('SMTP_USERNAME');
    const smtpPass = env('SMTP_PASSWORD');

    // Explicitly check for 'true' or port 465
    const smtpSecure = env.bool('SMTP_SECURE', smtpPort === 465);

    console.log(`[EMAIL CONFIG] STARTUP CHECK:`);
    console.log(`- Host: ${smtpHost}`);
    console.log(`- Port: ${smtpPort} (type: ${typeof smtpPort})`);
    console.log(`- Secure: ${smtpSecure} (type: ${typeof smtpSecure})`);
    console.log(`- User: ${smtpUser ? 'Defined' : 'UNDEFINED'}`);

    return {
        upload: {
            config: {
                provider: 'cloudinary',
                providerOptions: {
                    cloud_name: env('CLOUDINARY_NAME'),
                    api_key: env('CLOUDINARY_KEY'),
                    api_secret: env('CLOUDINARY_SECRET'),
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
                        // Crucial for some cloud setups
                        rejectUnauthorized: false,
                        minVersion: 'TLSv1.2'
                    },
                    connectionTimeout: 30000, // 30 seconds
                    greetingTimeout: 30000,
                    socketTimeout: 30000,
                },
                settings: {
                    defaultFrom: env('SMTP_FROM', 'support@creatymu.org'),
                    defaultReplyTo: env('SMTP_REPLY_TO', 'support@creatymu.org'),
                },
            },
        },
    };
};




