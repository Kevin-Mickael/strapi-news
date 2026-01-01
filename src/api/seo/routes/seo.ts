export default {
    routes: [
        {
            method: 'GET',
            path: '/sitemap.xml',
            handler: 'seo.getSitemap',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/rss.xml',
            handler: 'seo.getRSS',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/feed.xml',
            handler: 'seo.getRSS',
            config: {
                auth: false,
            },
        },
    ],
};
