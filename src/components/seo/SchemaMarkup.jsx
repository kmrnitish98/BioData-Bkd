/**
 * SchemaMarkup.jsx — JSON-LD Structured Data Component for Aguaa
 *
 * Renders <script type="application/ld+json"> tags for rich results.
 * Supports: FAQPage, BreadcrumbList, ProfilePage (Person)
 *
 * ⚠️  NOTE: AggregateRating / ReviewSchema has been REMOVED.
 *     Google requires AggregateRating to be backed by real, verifiable
 *     reviews on your site. Fake review counts (e.g. 10,000) trigger
 *     a manual penalty. Use this only after collecting real reviews.
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

/**
 * ProfilePage (Person) Schema — used on individual /profile/:id pages.
 * Helps Google understand the profile is for a real person's marriage biodata.
 * Does NOT include AggregateRating (not applicable to individual profiles).
 *
 * @param {Object} biodata — the biodata object from the API
 */
export function PersonProfileSchema({ biodata }) {
  if (!biodata?.personalInfo?.fullName) return null;

  const { personalInfo = {}, educationInfo = {}, photoURL } = biodata;
  const name = personalInfo.fullName;
  const age  = personalInfo.age || '';
  const city = personalInfo.city || personalInfo.presentAddress || '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${name}'s Marriage Biodata`,
    description: `View ${name}'s verified marriage biodata on Aguaa${age ? ` (${age} years)` : ''}${city ? ` from ${city}` : ''}. Looking for a loving life partner.`,
    url: `https://aguaa.in/profile/${biodata._id}`,
    mainEntity: {
      '@type': 'Person',
      name,
      ...(age          ? { age }                                   : {}),
      ...(city         ? { homeLocation: { '@type': 'Place', name: city } } : {}),
      ...(educationInfo.highestQualification
                       ? { hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: educationInfo.highestQualification } }
                       : {}),
      ...(photoURL     ? { image: photoURL }                        : {}),
    },
  };

  return <SchemaMarkup id="schema-profile-person" schema={schema} />;
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
