import { factories } from '@strapi/strapi';

export default () => ({
    async generateSitemap() {
        const baseUrl = process.env.WEBSITE_URL || 'https://creatymu.org';
        const articles = await strapi.entityService.findMany('api::article.article', {
            filters: { publishedAt: { $notNull: true } },
            sort: { updatedAt: 'desc' },
        });

        const staticPages = [
            { url: '/', priority: '1.0' },
            { url: '/blog', priority: '0.8' },
            { url: '/news', priority: '0.8' },
            { url: '/legal', priority: '0.5' },
        ];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Static pages
        staticPages.forEach((page) => {
            xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
        });

        // Dynamic articles
        articles.forEach((article: any) => {
            xml += `
  <url>
    <loc>${baseUrl}/blog?slug=${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        xml += `
</urlset>`;

        return xml;
    },

    async generateRSS() {
        const baseUrl = process.env.WEBSITE_URL || 'https://creatymu.org';
        const articles = await strapi.entityService.findMany('api::article.article', {
            filters: { publishedAt: { $notNull: true } },
            sort: { publishedAt: 'desc' },
            limit: 20,
        });

        let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Creaty Blog</title>
  <link>${baseUrl}/blog</link>
  <description>Latest insights and strategies from Creaty</description>
  <language>fr</language>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`;

        articles.forEach((article: any) => {
            xml += `
  <item>
    <title>${this.escapeXml(article.title)}</title>
    <link>${baseUrl}/blog/${article.slug}</link>
    <description>${this.escapeXml(article.description || '')}</description>
    <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    <guid>${baseUrl}/blog/${article.slug}</guid>
  </item>`;
        });

        xml += `
</channel>
</rss>`;

        return xml;
    },

    escapeXml(unsafe: string) {
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    },
});
