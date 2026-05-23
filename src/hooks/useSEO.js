/**
 * useSEO.js — Dynamic SEO hook for Aguaa
 *
 * Updates document <head> meta tags per-route for a React SPA.
 * Works with Google, Bing, and AI search crawlers.
 *
 * Usage:
 *   useSEO('/about')  — auto-looks up page config
 *   useSEO({ title, description, ... }) — custom override
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_SEO, SITE, generateBreadcrumbSchema } from '../utils/seo';

/**
 * Inject or update a <meta> tag in document.head
 */
function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Inject or update a <link> tag in document.head
 */
function setLink(rel, href, extra = {}) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
}

/**
 * Inject or update a JSON-LD <script> tag
 */
function setJsonLd(id, data) {
  if (!data) return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('id', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}

/**
 * Remove a JSON-LD script tag
 */
function removeJsonLd(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/**
 * Main useSEO hook
 * @param {string|object} pageOrConfig — route path string OR custom config object
 */
export function useSEO(pageOrConfig) {
  const location = useLocation();

  useEffect(() => {
    // Determine config
    let config;
    if (typeof pageOrConfig === 'string') {
      config = PAGE_SEO[pageOrConfig] || PAGE_SEO['/'];
    } else if (pageOrConfig && typeof pageOrConfig === 'object') {
      config = pageOrConfig;
    } else {
      config = PAGE_SEO[location.pathname] || PAGE_SEO['/'];
    }

    const {
      title,
      description,
      keywords,
      canonical,
      ogType = 'website',
      noIndex = false,
      breadcrumb,
      schema,
    } = config;

    // ── Title ──────────────────────────────────────────────
    if (title) document.title = title;

    // ── Robots ─────────────────────────────────────────────
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // ── Basic Meta ─────────────────────────────────────────
    if (description) setMeta('description', description);
    if (keywords)    setMeta('keywords', keywords);

    // ── Canonical ──────────────────────────────────────────
    if (canonical) setLink('canonical', canonical);

    // ── Open Graph ─────────────────────────────────────────
    setMeta('og:title',       title,                   'property');
    setMeta('og:description', description,             'property');
    setMeta('og:type',        ogType,                  'property');
    setMeta('og:url',         canonical || SITE.url,   'property');
    setMeta('og:image',       SITE.ogImage,            'property');
    setMeta('og:site_name',   SITE.name,               'property');
    setMeta('og:locale',      'en_IN',                 'property');

    // ── Twitter Card ───────────────────────────────────────
    setMeta('twitter:title',       title,       'name');
    setMeta('twitter:description', description, 'name');
    setMeta('twitter:image',       SITE.ogImage,'name');
    setMeta('twitter:card',        'summary_large_image', 'name');
    setMeta('twitter:site',        SITE.twitterHandle,    'name');

    // ── Breadcrumb JSON-LD ─────────────────────────────────
    if (breadcrumb && breadcrumb.length > 0) {
      setJsonLd('schema-breadcrumb', generateBreadcrumbSchema(breadcrumb));
    } else {
      removeJsonLd('schema-breadcrumb');
    }

  }, [pageOrConfig, location.pathname]);
}

export default useSEO;
