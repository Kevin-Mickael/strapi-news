export default {
    async accept(ctx) {
        // Set a cookie that lasts 365 days
        ctx.cookies.set('cookie_consent', 'true', {
            httpOnly: true,
            path: '/',
            maxAge: 365 * 24 * 60 * 60 * 1000,
            secure: true, // Recommended for HTTPS
            sameSite: 'none', // Required for cross-site cookie usage
        });

        return { success: true, message: 'Consent recorded successfully' };
    },

    async check(ctx) {
        const consent = ctx.cookies.get('cookie_consent');
        return { consented: consent === 'true' };
    },

    async decline(ctx) {
        // Clear the cookie
        ctx.cookies.set('cookie_consent', null, {
            httpOnly: true,
            path: '/',
        });
        return { success: true };
    }
};
