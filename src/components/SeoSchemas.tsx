import React from 'react';

export const SeoSchemas: React.FC = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GoPVC',
    url: 'https://gopvc.in/',
    logo: 'https://gopvc.in/logo.png',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-8700160926',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Bengali'],
      },
    ],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'GoPVC - PVC Card Printing Service',
    image: 'https://gopvc.in/og-image.jpg',
    url: 'https://gopvc.in/',
    telephone: '+91-8700160926',
    priceRange: '₹35 - ₹65',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'GoPvc Print Hub, Unit 4, Plot 88',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700091',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.5726,
      longitude: 88.3639,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12500',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GoPVC',
    url: 'https://gopvc.in/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gopvc.in/#faqs?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'PVC Card Order Online – ₹49 | Aadhaar, PAN, Voter ID PVC Card | GoPVC',
    url: 'https://gopvc.in/',
    description:
      'Order PVC cards online from GoPVC. Print Aadhaar, PAN, Voter ID, Driving Licence, Ayushman Bharat and other PVC cards from ₹49 with free doorstep delivery across India.',
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'PVC Card Order Online in India',
    image: 'https://gopvc.in/og-image.jpg',
    description:
      'Order high-quality PVC cards online for Aadhaar, PAN Card, Voter ID, Driving Licence, Ayushman Bharat, ABHA and other ID cards with free delivery in India.',
    brand: {
      '@type': 'Brand',
      name: 'GoPVC',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '35',
      highPrice: '65',
      offerCount: '4',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12500',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'PVC Card Printing Service',
    provider: {
      '@type': 'Organization',
      name: 'GoPVC',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'PVC Card Types',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aadhaar PVC Card Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'PAN Card PVC Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Voter ID PVC Card Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Driving Licence PVC Card Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ayushman Bharat PVC Card Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ABHA PVC Card Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ration Card PVC Printing' } },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://gopvc.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'PVC Card Printing Online',
        item: 'https://gopvc.in/#available-cards',
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
};
