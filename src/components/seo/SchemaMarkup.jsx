/**
 * SchemaMarkup.jsx — JSON-LD Structured Data Component for Aguaa
 *
 * Renders <script type="application/ld+json"> tags for rich results.
 * Supports: FAQPage, BreadcrumbList, Organization, LocalBusiness,
 *           AggregateRating, Review, Offer, SoftwareApplication
 */

import { useEffect } from 'react';

/**
 * Injects a JSON-LD script into <head>
 */
function SchemaMarkup({ id, schema }) {
  useEffect(() => {
    if (!schema || !id) return;

    // Remove existing
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    // Create new
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [id, JSON.stringify(schema)]);

  return null;
}

export default SchemaMarkup;


/**
 * Pre-built schema components for common use cases
 */

/** FAQ Schema — triggers Google FAQ rich results */
export function FAQSchema({ faqs }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
  return <SchemaMarkup id="schema-faq" schema={schema} />;
}

/** Breadcrumb Schema — triggers breadcrumb rich results */
export function BreadcrumbSchema({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <SchemaMarkup id="schema-breadcrumb" schema={schema} />;
}

/** Review / AggregateRating Schema */
export function ReviewSchema({ ratingValue = '4.9', reviewCount = '10000' }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Aguaa — Marriage Biodata Platform',
    description:
      "India's trusted online marriage biodata maker for Bihar, UP, Jharkhand families.",
    image: 'https://aguaa.in/logo.png',
    brand: {
      '@type': 'Brand',
      name: 'Aguaa',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      bestRating: '5',
      worstRating: '1',
      reviewCount,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://aguaa.in/pricing',
    },
  };
  return <SchemaMarkup id="schema-review" schema={schema} />;
}

/** Pricing / Offer Schema */
export function OfferSchema({ plans }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Aguaa Pricing Plans',
    description: 'Marriage biodata platform plans — free and premium options',
    itemListElement: plans.map((plan, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Offer',
        name: plan.name,
        description: plan.description,
        price: plan.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: 'https://aguaa.in/pricing',
      },
    })),
  };
  return <SchemaMarkup id="schema-offers" schema={schema} />;
}
