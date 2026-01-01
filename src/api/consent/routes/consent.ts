export default {
    routes: [
        {
            method: 'POST',
            path: '/consent/accept',
            handler: 'consent.accept',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/consent/check',
            handler: 'consent.check',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/consent/decline',
            handler: 'consent.decline',
            config: {
                auth: false,
            },
        },
    ],
};
