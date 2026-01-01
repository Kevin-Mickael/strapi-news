export default ({ env }) => {
    // Diagnostic logs
    console.log(`[BREVO API CHECK] Key Defined: ${env('BREVO_API_KEY') ? 'Yes' : 'No'}`);
    console.log(`[UPLOAD CONFIG] Cloudinary Name: ${env('CLOUDINARY_NAME') ? 'Defined' : 'UNDEFINED'}`);

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
    };
    // Email is now handled via direct REST API in the contact controller
    // to bypass SMTP port blocking.
};
