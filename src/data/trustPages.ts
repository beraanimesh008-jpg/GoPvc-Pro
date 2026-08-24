/**
 * Trust, E-E-A-T & Compliance Pages for GoPVC (gopvc.in)
 * Clear, transparent, non-deceptive disclosures.
 */

export interface TrustPage {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  badge: string;
  lastUpdated: string;
  sections: {
    heading: string;
    content?: string;
    bullets?: string[];
  }[];
}

export const TRUST_PAGES: Record<string, TrustPage> = {
  'about-us': {
    slug: 'about-us',
    path: '/about-us',
    title: 'About GoPVC – India’s High-Definition PVC Card Printing Facility | GoPVC',
    metaDescription: 'Learn about GoPVC, our automated UV card printing facility in Kolkata, quality standards, 800-micron solid PVC substrates, and commitment to fast, secure card delivery.',
    h1: 'About GoPVC Print Hub',
    badge: 'Our Mission & Printing Facility',
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: 'Who We Are',
        content: 'GoPVC is an independent, specialized digital card printing facility based in Kolkata, West Bengal. We specialize in transforming digital PDF identity cards and custom documents into industrial-grade, 800-micron rigid plastic (PVC) cards. With state-of-the-art UV re-transfer printing systems and an automated cloud validation pipeline, we serve individual citizens, CSC center operators, educational institutions, and corporate enterprises across all 28 states and 8 union territories of India.',
      },
      {
        heading: 'Our Manufacturing & Quality Standards',
        content: 'Unlike small local print shops that rely on thin 500-micron sheets or cheap paper lamination that peels within months, GoPVC uses 100% virgin multi-layer Polyvinyl Chloride (PVC) conforming to the international ISO/IEC 7810 ID-1 standard (CR80). Every card produced in our facility measures 85.6 mm × 53.98 mm with a solid 800-micron thickness—the exact standard of bank credit cards.',
        bullets: [
          'High-Definition 300+ DPI UV Printing: Ensures micro-details, bar codes, and UIDAI QR codes scan cleanly.',
          '100% Waterproof & Washable: Impervious to water, humidity, and accidental spills.',
          'Scratch-Resistant Protective Seal: Prevents surface friction and fading for over 10 years of daily wallet carry.',
          'Strict Quality Inspection: Every card undergoes physical thickness measurement and optical scan verification before sealing.',
        ],
      },
      {
        heading: 'Important Legal & Independence Disclosure',
        content: 'GoPVC is a private print-on-demand manufacturing company. We are NOT an agency of the Government of India, UIDAI, Income Tax Department, Election Commission of India, Ministry of Road Transport, or the National Health Authority. We do not issue, modify, or authenticate citizen identity records. We strictly provide physical printing services for documents legally downloaded and uploaded by authorized individuals.',
      },
      {
        heading: 'Facility & Business Information',
        content: 'Operating Unit: GoPvc Print Hub, Unit 4, Plot 88, Kolkata, West Bengal - 700091, India. GSTIN: 19AABCG0123P1Z5. Support Helpline: +91 87001 60926. Email: support@gopvc.in.',
      },
    ],
  },
  'contact-us': {
    slug: 'contact-us',
    path: '/contact-us',
    title: 'Contact GoPVC Support – Phone, Email, Address & Live Order Help | GoPVC',
    metaDescription: 'Need help with your PVC card order or custom printing? Contact GoPVC support via helpline +91 87001 60926, email support@gopvc.in, or visit our Kolkata print hub.',
    h1: 'Contact GoPVC Customer Support',
    badge: 'We’re Here to Help',
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: 'Direct Customer Support Channels',
        content: 'Our dedicated customer service and production team is available from Monday to Saturday, 9:30 AM to 7:30 PM IST to assist you with order status, PDF upload questions, custom bulk inquiries, or tracking assistance.',
        bullets: [
          'Customer Care Phone / WhatsApp: +91 87001 60926',
          'Official Support Email: support@gopvc.in',
          'Corporate Inquiries: sales@gopvc.in',
          'Operating Facility: GoPvc Print Hub, Unit 4, Plot 88, Kolkata, WB - 700091',
        ],
      },
      {
        heading: 'Live Order Tracking',
        content: 'If you already placed an order, you can track its live status 24/7 without waiting for an agent by visiting our tracking portal with your 10-digit Order ID (e.g. GPVC000001) or your 10-digit phone number.',
      },
      {
        heading: 'Resolution Commitment',
        content: 'We strive to respond to all email inquiries within 2 business hours and resolve print or shipping inquiries within 24 business hours.',
      },
    ],
  },
  'privacy-policy': {
    slug: 'privacy-policy',
    path: '/privacy-policy',
    title: 'Privacy Policy & Citizen Data Protection | GoPVC India',
    metaDescription: 'Read GoPVC’s strict Privacy Policy. Learn how citizen documents and uploaded PDFs are protected with 256-bit SSL encryption and permanently deleted post-dispatch.',
    h1: 'Privacy Policy & Document Security',
    badge: '100% Data Confidentiality',
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Commitment to Citizen Privacy',
        content: 'At GoPVC (https://gopvc.in), we treat the security and confidentiality of your personal identification documents as our highest institutional responsibility. This Privacy Policy details how we collect, process, protect, and permanently purge your information.',
      },
      {
        heading: '2. Information We Collect',
        content: 'To fulfill your physical card order, we collect only the minimal data strictly necessary:',
        bullets: [
          'Contact & Shipping Information: Recipient Name, Mobile Number, Email Address, House/Street Details, City/Village, State, and PIN Code.',
          'Document Files for Printing: PDF documents (such as e-Aadhaar, e-PAN, Voter ID, Driving Licence, ABHA ID, or custom badge artwork) uploaded directly by you.',
          'Transaction Metadata: Order amount, payment reference IDs, and timestamp generated by authorized payment gateways (Cashfree / UPI). We never see or store your bank passwords, debit/credit card CVV, or UPI PINs.',
        ],
      },
      {
        heading: '3. How Uploaded Documents Are Handled & Purged',
        content: 'All file uploads are transmitted via 256-bit Transport Layer Security (TLS/SSL) directly to our isolated processing environment. Documents are rendered solely to create high-resolution printer raster files for physical card production. Once your order has passed quality check and is dispatched to the courier partner, our automated file sanitization engine permanently deletes all uploaded PDFs and raster caches from our active disks.',
      },
      {
        heading: '4. Zero Third-Party Sharing',
        content: 'We DO NOT sell, rent, license, or disclose your personal information or document contents to any marketing agencies, data brokers, or third parties under any circumstances. Shipping address details are shared solely with authorized courier logistics partners (e.g., India Post, BlueDart, DTDC) exclusively for physical parcel delivery.',
      },
      {
        heading: '5. Grievance Officer',
        content: 'For any privacy concerns or immediate data deletion requests, contact our designated Grievance Officer at privacy@gopvc.in or call +91 87001 60926.',
      },
    ],
  },
  'terms-and-conditions': {
    slug: 'terms-and-conditions',
    path: '/terms-and-conditions',
    title: 'Terms and Conditions | GoPVC Online Printing Service',
    metaDescription: 'Terms of service for GoPVC. Understanding our print-on-demand manufacturing terms, client document ownership, non-government disclaimer, and order policies.',
    h1: 'Terms and Conditions of Service',
    badge: 'Legal Agreement',
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Introduction & Acceptance',
        content: 'By accessing and utilizing the GoPVC platform (https://gopvc.in) or placing an order for custom PVC card printing, you agree to be bound by these Terms and Conditions.',
      },
      {
        heading: '2. Nature of Service & Independence Disclaimer',
        content: 'GoPVC operates strictly as a custom print-on-demand manufacturing provider. GoPVC is NOT affiliated with, authorized by, or associated with UIDAI, the Income Tax Department, the Election Commission of India, the Ministry of Road Transport, or any other government authority. We do not generate, issue, or modify official records. Customers are solely responsible for ensuring they possess legal rights to print the uploaded files.',
      },
      {
        heading: '3. User Representation & Authorization',
        content: 'By uploading any document to GoPVC, you expressly warrant that you are the lawful owner of the document or have received explicit consent from the document owner (in the case of family members or employer staff) to request physical card printing.',
      },
      {
        heading: '4. Pricing, Taxes & Payment',
        content: 'All prices listed on GoPVC include manufacturing, finishing, and standard doorstep delivery across India unless explicitly stated otherwise. Payments are processed through RBI-authorized payment aggregators.',
      },
      {
        heading: '5. Limitation of Liability',
        content: 'GoPVC is responsible for the physical quality, substrate specification (800 micron CR80 PVC), and timely dispatch of printed cards. We are not liable for typographical errors or outdated information present inside the original user-supplied PDF documents.',
      },
    ],
  },
  'refund-cancellation-policy': {
    slug: 'refund-cancellation-policy',
    path: '/refund-cancellation-policy',
    title: 'Refund & Cancellation Policy – 100% Quality Guarantee | GoPVC',
    metaDescription: 'Read GoPVC’s transparent refund and cancellation policy. Free re-print guarantee for defective cards or transit damage, with straightforward dispute resolution.',
    h1: 'Refund, Return & Cancellation Policy',
    badge: '100% Customer Satisfaction Guarantee',
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. 100% Quality & Print Guarantee',
        content: 'Every card printed by GoPVC is produced on genuine 800-micron virgin PVC plastic with 300+ DPI UV inks. We stand firmly behind the physical quality and durability of our craftsmanship.',
      },
      {
        heading: '2. Free Re-Print or Refund for Manufacturing Defects',
        content: 'If your card arrives with a physical manufacturing defect (e.g. broken card, surface scratch, unreadable QR code due to print error, or misalignment), we will immediately reprint and dispatch a fresh replacement free of cost, or issue a full refund to your original payment method.',
        bullets: [
          'To report an issue: Email support@gopvc.in or WhatsApp +91 87001 60926 within 7 days of delivery with a clear photograph of the defect and your Order ID.',
          'Replacement turnaround: Approved replacements are printed and dispatched within 24 business hours via priority courier.',
        ],
      },
      {
        heading: '3. Transit Damage & Lost Parcels',
        content: 'If your package is damaged in transit or declared lost by our courier partner, we dispatch a fresh order immediately at no extra charge.',
      },
      {
        heading: '4. Cancellation Window',
        content: 'Because orders are custom-manufactured to your specific PDF specifications, orders can only be cancelled prior to the commencement of the UV printing stage (typically within 1 hour of placing the order). Once a card has completed printing, cancellations cannot be processed.',
      },
    ],
  },
  'shipping-policy': {
    slug: 'shipping-policy',
    path: '/shipping-policy',
    title: 'Shipping and Delivery Policy – Free PAN-India Delivery | GoPVC',
    metaDescription: 'Learn about GoPVC’s express doorstep shipping. 100% free delivery across all Indian PIN codes, courier partners, dispatch timelines, and live parcel tracking.',
    h1: 'Shipping & Delivery Policy',
    badge: 'Free Nationwide Delivery',
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. 100% Free Doorstep Delivery',
        content: 'GoPVC provides free standard doorstep delivery across all serviceable PIN codes in India for all orders—whether you order a single card or bulk corporate batches. There are no hidden packaging or fuel surcharges at checkout.',
      },
      {
        heading: '2. Production & Dispatch Timeline',
        content: 'All orders are processed and printed within 24 business hours of payment confirmation. Orders placed on Sundays or national holidays are queued for first-priority production on the following business day.',
      },
      {
        heading: '3. Estimated Delivery Times',
        bullets: [
          'Metro Cities (Delhi, Mumbai, Kolkata, Bengaluru, Chennai, Hyderabad, Pune, Ahmedabad): 2 to 3 Business Days',
          'Tier-2 & Tier-3 Urban Centers: 3 to 5 Business Days',
          'Rural / Remote PIN Codes (Delivered via India Post Speed Post): 4 to 7 Business Days',
        ],
      },
      {
        heading: '4. Courier Partners & Tracking',
        content: 'We partner with leading logistics networks including India Post Speed Post, BlueDart, DTDC, and Delhivery. As soon as your order is handed over to the courier, you receive an automated SMS with your live tracking number (AWB) to track your parcel in real-time.',
      },
    ],
  },
  'data-deletion-policy': {
    slug: 'data-deletion-policy',
    path: '/data-deletion-policy',
    title: 'Data Deletion & Document Purge Policy | GoPVC Security Hub',
    metaDescription: 'Detailed technical overview of how GoPVC automatically purges uploaded citizen PDFs, cached images, and temporary buffers from our server disk within 24 hours.',
    h1: 'Document Security & Automated File Purge Policy',
    badge: 'Automated 24-Hour Disk Sanitization',
    lastUpdated: 'August 2026',
    sections: [
      {
        heading: '1. Automated File Lifecycle',
        content: 'When you upload an identity document PDF to GoPVC, the file enters a strictly isolated, encrypted directory accessible solely by our local print engine daemon.',
        bullets: [
          'Ingestion: The PDF is validated for dimensions, DPI, and page count.',
          'Print Queue: The file is rasterized to machine-level print code and transmitted directly to the UV printer.',
          'Sanitization: Following physical printing and packaging verification, an automated cron service permanently deletes the source PDF and temporary raster buffers from our server storage.',
        ],
      },
      {
        heading: '2. Manual Instant Deletion Requests',
        content: 'If you wish to request immediate manual file purging before the automated cycle, simply email privacy@gopvc.in with your Order ID, and our security administrators will execute immediate disk sanitization.',
      },
    ],
  },
};
