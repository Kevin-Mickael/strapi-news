/**
 * STRAPI PERMISSIONS CHECKLIST
 * Location: Admin Panel → Settings → Roles & Permissions
 * 
 * This file documents exactly what needs to be enabled for the public API to work.
 */

// ============================================
// PUBLIC ROLE - READ-ONLY PERMISSIONS
// ============================================
// Path: Settings > Roles & Permissions > Public

public_role_config = {
  // ========== ARTICLES COLLECTION ==========
  "api::article.article": {
    // Required: Allow fetching articles list
    "find": {
      enabled: true,
      description: "List all published articles (no auth required)"
    },
    
    // Required: Allow fetching single article by ID/slug
    "findOne": {
      enabled: true,
      description: "Get single article details"
    },
    
    // ❌ DENY: Creating articles from frontend
    "create": {
      enabled: false,
      description: "Only admins can create articles"
    },
    
    // ❌ DENY: Updating articles from frontend
    "update": {
      enabled: false,
      description: "Only admins can update articles"
    },
    
    // ❌ DENY: Deleting articles from frontend
    "delete": {
      enabled: false,
      description: "Only admins can delete articles"
    }
  },

  // ========== COMMENTS COLLECTION ==========
  "api::comment.comment": {
    // Required: Allow fetching comments for an article
    "find": {
      enabled: true,
      description: "List comments on articles"
    },
    
    // Required: Allow fetching single comment details (optional but good)
    "findOne": {
      enabled: true,
      description: "Get single comment details"
    },
    
    // Required: Allow visitors to post comments
    "create": {
      enabled: true,
      description: "Submit new comments (with moderation possible via lifecycle)"
    },
    
    // ❌ DENY: Users shouldn't edit other's comments
    "update": {
      enabled: false,
      description: "Only admins can edit comments"
    },
    
    // ❌ DENY: Users shouldn't delete other's comments
    "delete": {
      enabled: false,
      description: "Only admins can delete comments"
    }
  },

  // ========== CONTACT/NEWSLETTER (if used) ==========
  "api::contact.contact": {
    "create": {
      enabled: true,
      description: "Allow contact form submissions"
    },
    "find": false,
    "findOne": false,
    "update": false,
    "delete": false
  },

  "api::newsletter.newsletter": {
    "create": {
      enabled: true,
      description: "Allow newsletter subscriptions"
    },
    "find": false,
    "findOne": false,
    "update": false,
    "delete": false
  },

  "api::consent.consent": {
    "create": {
      enabled: true,
      description: "Allow consent tracking (GDPR)"
    },
    "find": false,
    "findOne": false,
    "update": false,
    "delete": false
  }
};

// ============================================
// VERIFIED CHECKLIST
// ============================================

/**
 * BEFORE DEPLOYING - RUN THIS CHECKLIST
 * 
 * In Strapi Admin Panel:
 * 1. Go to Settings → Roles & Permissions
 * 2. Click on "Public" role
 * 3. Expand "ARTICLES"
 *    ☑ "find" should be CHECKED (✓)
 *    ☑ "findOne" should be CHECKED (✓)
 *    ☐ "create" should be UNCHECKED
 *    ☐ "update" should be UNCHECKED
 *    ☐ "delete" should be UNCHECKED
 * 
 * 4. Expand "COMMENTS"
 *    ☑ "find" should be CHECKED (✓)
 *    ☑ "create" should be CHECKED (✓)  [allows comments]
 *    ☐ "update" should be UNCHECKED
 *    ☐ "delete" should be UNCHECKED
 * 
 * 5. Expand "CONTACT"
 *    ☑ "create" should be CHECKED (✓)
 *    ☐ "find", "findOne", "update", "delete" should be UNCHECKED
 * 
 * 6. Expand "NEWSLETTER"
 *    ☑ "create" should be CHECKED (✓)
 *    ☐ "find", "findOne", "update", "delete" should be UNCHECKED
 * 
 * 7. Click "Save"
 * 
 * 8. Go to Content Manager
 *    ☑ All articles should be "PUBLISHED" (not Draft)
 *    ☑ Check that articles have:
 *       - title (required)
 *       - slug (required, auto-generated from title)
 *       - content
 *       - image (optional)
 * 
 * 9. Test the API:
 *    curl "https://admin.creatymu.org/api/articles?filters[slug][\$eq]=digital-social-media-agency-mauritius-creaty"
 *    Should return: {"data":[...], "meta":{...}}
 */

// ============================================
// TROUBLESHOOTING
// ============================================

export const TROUBLESHOOT = {
  "HTTP 400 Bad Request": [
    "✗ Article slug doesn't match",
    "✓ Solution: Check exact slug in Strapi Content Manager",
    "✓ Make sure article is Published (not Draft)"
  ],

  "HTTP 403 Forbidden": [
    "✗ Public permissions not enabled for articles",
    "✓ Solution: Admin Panel → Settings → Roles → Public → Articles → find + findOne ✓",
    "✓ Click Save"
  ],

  "HTTP 404 Not Found": [
    "✗ Article with that slug doesn't exist",
    "✓ Solution: Create the article or check slug spelling",
    "✓ Remember to Publish it"
  ],

  "HTTP 429 Too Many Requests": [
    "✗ Rate limit exceeded (100 requests per IP per minute)",
    "✓ Solution: Wait 1 minute before making more requests",
    "✓ Check for infinite loops in frontend code"
  ],

  "Empty data array []": [
    "✗ Article found but marked as Draft",
    "✗ OR Permissions not fully enabled",
    "✓ Solution: Publish all articles in Content Manager",
    "✓ Verify Public role has 'find' permission"
  ]
};

// ============================================
// LIFECYCLE HOOKS (Optional)
// ============================================
// File: src/api/article/content-types/article/lifecycles.ts

export const article_lifecycle_example = {
  /**
   * Published hook - runs when article is published
   * Useful for: sending notifications, updating cache, etc.
   */
  async afterCreate(event) {
    const { result } = event;
    console.log("New article created:", result.slug);
  },

  /**
   * Auto-publish articles for authenticated users
   * (optional: only if you want admin creation to auto-publish)
   */
  async beforeUpdate(event) {
    const { data, where } = event;
    // Auto-publish if needed
    if (data.publishedAt === null) {
      data.publishedAt = new Date().toISOString();
    }
  }
};

// ============================================
// QUICK FIX SCRIPT
// ============================================
// If permissions keep failing, run this in Strapi CLI:

/*
// In strapi-blog/ directory:
npm run strapi admin:reset-user-password

// Then in Admin Panel:
1. Settings → Roles & Permissions
2. Click "Public"
3. Scroll to "ARTICLES"
4. Click checkbox for "find"
5. Click checkbox for "findOne"
6. Scroll to "COMMENTS"
7. Click checkbox for "find"
8. Click checkbox for "create"
9. Click "Save" at top right
10. Refresh browser and test API
*/

module.exports = {};
