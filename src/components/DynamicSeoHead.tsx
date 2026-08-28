import React, { useEffect } from 'react';
import { SEO_SERVICE_PAGES, SEO_GUIDES, SeoServicePage, SeoGuideArticle } from '../data/seoPages';
import { TRUST_PAGES, TrustPage } from '../data/trustPages';

interface DynamicSeoHeadProps {
  currentPath: string; // e.g. '/', '/aadhaar-pvc-card', '/guides/what-is-pvc-card', '/about-us'
}

export const DynamicSeoHead: React.FC<DynamicSeoHeadProps> = ({ currentPath }) => {
  // Determine current page metadata
  let title = 'PVC Card Order Online – ₹49 | Aadhaar, PAN, Voter ID PVC Card | GoPVC';
  let description =
    'Order PVC cards online from GoPVC. Print Aadhaar, PAN, Voter ID, Driving Licence, Ayushman Bharat and other PVC cards from ₹49 with free doorstep delivery across India.';
  let keywords =
    'PVC Card Printing, PVC Card Printing Online, Aadhaar PVC Card, PAN PVC Card, Voter ID PVC Card, Driving Licence PVC Card, Ayushman Bharat PVC Card, ABHA PVC Card, Ration Card PVC, Smart PVC Card, PVC Card India, PVC Card Home Delivery, Print PVC Card Online, PVC Card Order, PVC Card Order Online, PVC Card Printing Online, Order PVC Card Online, Aadhaar PVC Card Order, PAN PVC Card Order, Voter ID PVC Card Order, Driving Licence PVC Card, PVC Card Printing Price, PVC Card ₹29, PVC Card Home Delivery, ration card order, ayusman card order';
  let canonicalUrl = `https://gopvc.in${currentPath === '/' ? '' : currentPath}`;
  let ogType = 'website';
  let schemaData: any[] = [];

  // Base Organization Schema (Clean, legitimate, no fake rating spam)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GoPVC',
    alternateName: 'GoPVC Print Hub',
    url: 'https://gopvc.in/',
    logo: 'https://gopvc.in/logo.png',
    description: 'Specialized high-definition PVC card printing service in India for e-Aadhaar, e-PAN, Voter ID, Driving Licence, Health IDs, and custom plastic cards.',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-8700160926',
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Bengali'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'GoPvc Print Hub, Unit 4, Plot 88',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700091',
      addressCountry: 'IN',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GoPVC',
    url: 'https://gopvc.in/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gopvc.in/#search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  // Check if currentPath matches a service page
  const cleanPath = currentPath.replace(/\/$/, '') || '/';
  const serviceMatch = SEO_SERVICE_PAGES.find((s) => s.path === cleanPath || `/${s.slug}` === cleanPath);
  const guideMatch = SEO_GUIDES.find((g) => g.path === cleanPath || `/guides/${g.slug}` === cleanPath);
  const trustKey = cleanPath.replace(/^\//, '');
  const trustMatch = TRUST_PAGES[trustKey];

  if (serviceMatch) {
    title = serviceMatch.title;
    description = serviceMatch.metaDescription;
    ogType = 'product';

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: serviceMatch.h1,
      serviceType: 'PVC Card Printing Service',
      description: serviceMatch.summary,
      provider: {
        '@type': 'Organization',
        name: 'GoPVC',
        url: 'https://gopvc.in',
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: '35',
        highPrice: '65',
        offerCount: '4',
      },
    };

    const breadcrumbs = {
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
          name: 'PVC Card Printing',
          item: 'https://gopvc.in/#services',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: serviceMatch.h1,
          item: `https://gopvc.in${serviceMatch.path}`,
        },
      ],
    };

    schemaData = [organizationSchema, websiteSchema, serviceSchema, breadcrumbs];
  } else if (guideMatch) {
    title = guideMatch.title;
    description = guideMatch.metaDescription;
    ogType = 'article';

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guideMatch.h1,
      description: guideMatch.excerpt,
      datePublished: guideMatch.publishedDate,
      dateModified: '2026-08-24',
      author: {
        '@type': 'Organization',
        name: 'GoPVC Editorial & Technical Print Team',
        url: 'https://gopvc.in/about-us',
      },
      publisher: {
        '@type': 'Organization',
        name: 'GoPVC',
        logo: {
          '@type': 'ImageObject',
          url: 'https://gopvc.in/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://gopvc.in${guideMatch.path}`,
      },
    };

    const breadcrumbs = {
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
          name: 'Guides & Knowledge Base',
          item: 'https://gopvc.in/guides',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: guideMatch.h1,
          item: `https://gopvc.in${guideMatch.path}`,
        },
      ],
    };

    schemaData = [organizationSchema, websiteSchema, articleSchema, breadcrumbs];
  } else if (trustMatch) {
    title = trustMatch.title;
    description = trustMatch.metaDescription;
    ogType = 'website';

    const webpageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: trustMatch.h1,
      description: trustMatch.metaDescription,
      url: `https://gopvc.in${trustMatch.path}`,
    };

    schemaData = [organizationSchema, websiteSchema, webpageSchema];
  } else {
    // Default Homepage Schema
    const serviceCatalog = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'PVC Card Printing Online India',
      serviceType: 'Digital Identity Card Printing',
      provider: {
        '@type': 'Organization',
        name: 'GoPVC',
        url: 'https://gopvc.in/',
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'PVC Card Types',
        itemListElement: SEO_SERVICE_PAGES.map((sp) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: sp.h1,
            url: `https://gopvc.in${sp.path}`,
          },
        })),
      },
    };

    schemaData = [organizationSchema, websiteSchema, serviceCatalog];
  }

  // Update DOM Title and Meta Tags on Client Side
  useEffect(() => {
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', description);
      document.head.appendChild(metaDesc);
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      metaKeywords.setAttribute('content', keywords);
      document.head.appendChild(metaKeywords);
    }

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonical);
    }

    // Update OpenGraph
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      }
    };

    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:url', canonicalUrl);
    setMeta('og:type', ogType);
  }, [title, description, canonicalUrl, ogType]);

  return (
    <>
      {schemaData.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};
