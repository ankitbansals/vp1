import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import {
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import { cache, JSX } from 'react';
import Link from 'next/link';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { GetLinksAndSectionsQuery, LayoutQuery } from '~/app/[locale]/(default)/page-data';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { readFragment } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { logoTransformer } from '~/data-transformers/logo-transformer';
import { SiteFooter as FooterSection } from '~/lib/makeswift/components/site-footer/site-footer';

import { FooterFragment, FooterSectionsFragment } from './fragment';
import { AmazonIcon } from './payment-icons/amazon';
import { AmericanExpressIcon } from './payment-icons/american-express';
import { ApplePayIcon } from './payment-icons/apple-pay';
import { MastercardIcon } from './payment-icons/mastercard';
import { PayPalIcon } from './payment-icons/paypal';
import { VisaIcon } from './payment-icons/visa';
import { NewsletterForm } from './NewsletterForm';

const paymentIcons = [
  { name: 'Visa', icon: <VisaIcon key="visa" className="h-6 w-auto" /> },
  { name: 'Mastercard', icon: <MastercardIcon key="mastercard" className="h-6 w-auto" /> },
  { name: 'American Express', icon: <AmericanExpressIcon key="americanExpress" className="h-6 w-auto" /> },
  { name: 'PayPal', icon: <PayPalIcon key="paypal" className="h-6 w-auto" /> },
  { name: 'Apple Pay', icon: <ApplePayIcon key="apple" className="h-6 w-auto" /> },
  { name: 'Amazon Pay', icon: <AmazonIcon key="amazon" className="h-6 w-auto" /> },
] as const;

interface SocialIcon {
  name: string;
  href: string;
  icon: JSX.Element;
}

const socialIcons: Record<string, SocialIcon> = {
  Facebook: { 
    name: 'Facebook', 
    href: 'https://facebook.com',
    icon: <span className="w-5 h-5 flex items-center justify-center">FB</span> 
  },
  Instagram: { 
    name: 'Instagram', 
    href: 'https://instagram.com',
    icon: <span className="w-5 h-5 flex items-center justify-center">IG</span>
  },
  Twitter: { 
    name: 'Twitter', 
    href: 'https://twitter.com',
    icon: <span className="w-5 h-5 flex items-center justify-center">TW</span>
  },
  YouTube: { 
    name: 'YouTube', 
    href: 'https://youtube.com',
    icon: <span className="w-5 h-5 flex items-center justify-center">YT</span>
  },
  LinkedIn: { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com',
    icon: <span className="w-5 h-5 flex items-center justify-center">IN</span>
  }
} as const;

const getFooterSections = cache(async (customerAccessToken?: string) => {
  const { data: response } = await client.fetch({
    document: GetLinksAndSectionsQuery,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
  });

  return readFragment(FooterSectionsFragment, response).site;
});

const getFooterData = cache(async () => {
  const { data: response } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: { next: { revalidate } },
  });

  return readFragment(FooterFragment, response).site;
});

interface FooterTranslations {
  newsletter?: {
    title?: string;
    description?: string;
    placeholder?: string;
    button?: string;
    consent?: string;
  };
  title?: string;
  description?: string;
  placeholder?: string;
  button?: string;
  consent?: string;
  followUs?: string;
  copyright?: string;
}

interface FooterProps {
  translations?: FooterTranslations;
}

export const Footer = ({ translations = {} }: FooterProps) => {
  const socialMediaLinks = Object.values(socialIcons);
  const copyright = translations?.copyright || `© ${new Date().getFullYear()} Company Name. All Rights Reserved.`;

  const footerColumns = [
    {
      title: 'Shop',
      links: [
        { name: 'New Arrivals', href: '/new-arrivals' },
        { name: 'Best Sellers', href: '/best-sellers' },
        { name: 'Sale', href: '/sale' },
        { name: 'Gift Ideas', href: '/gift-ideas' },
        { name: 'Size Guide', href: '/size-guide' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Hire Purchase', href: '/hire-purchase' },
        { name: 'Installation', href: '/installation' },
        { name: 'Warranty', href: '/warranty' },
        { name: 'Gift Cards', href: '/gift-cards' },
        { name: 'Trade Account', href: '/trade-account' }
      ]
    }
  ];

  return (
    <footer className="w-full bg-[#FFFBFA] py-8 sm:py-12 md:py-16">
      {/* Newsletter Section */}
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12 mb-6 sm:mb-8">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-brand-900 mb-2">
              {translations?.newsletter?.title || 'Join our mailing list'}
            </h3>
            <p className="text-sm sm:text-base text-gray-900">
              {translations?.newsletter?.description || 'Be the first to hear about the latest products, projects and inspiration.'}
            </p>
          </div>
          <div className="flex-1 lg:max-w-xl">
            <NewsletterForm translations={translations?.newsletter} />
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="border-t border-brand-900">
          <div className="container mx-auto py-8 sm:py-12 md:py-16">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {/* Follow Us */}
              <div className="col-span-1 xs:col-span-2 sm:col-span-1">
                <h4 className="text-sm font-semibold text-brand-900 mb-3 sm:mb-4">
                  {translations?.followUs || 'Follow Us'}
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {socialMediaLinks.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-brand-900 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.icon}
                      <span className="whitespace-nowrap">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer Columns */}
              {footerColumns.map((column, index) => (
                <div key={index}>
                  <h4 className="text-sm font-semibold text-brand-900 mb-3 sm:mb-4">
                    {column.title}
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        className="block text-xs sm:text-sm text-gray-600 hover:text-brand-900 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Payment Methods */}
              <div className="col-span-1 xs:col-span-2 sm:col-span-3 lg:col-span-1">
                <h4 className="text-sm font-semibold text-brand-900 mb-3 sm:mb-4">We Accept</h4>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {paymentIcons.map((method, index) => (
                    <div key={index} className="flex items-center justify-center p-2 bg-white rounded">
                      <span className="sr-only">{method.name}</span>
                      {method.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-brand-900">
          <div className="container mx-auto py-3 sm:py-4">
            <div className="flex justify-end">
              <p className="text-[10px] sm:text-xs text-brand-900">
                {copyright}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
