'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import Image from 'next/image';

// Define types for our data
interface SocialMediaItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterLink {
  name: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Sample data for the footer
const footerColumns: FooterColumn[] = [
  {
    title: 'About Us',
    links: [
      { name: 'Our Story', href: '/our-story' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact Us', href: '/contact-us' }
    ]
  },
  {
    title: 'Shopping Help',
    links: [
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping & Delivery', href: '/shipping' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'Track Order', href: '/track-order' },
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

const paymentMethods = [
  { name: 'Visa', icon: 'https://www.vinodpatel.com.fj/cdn/shop/files/visa.png?v=1743112832' },
  { name: 'Mastercard', icon: 'https://www.vinodpatel.com.fj/cdn/shop/files/mastercard.png?v=1743112832' },
  { name: 'American Express', icon: 'https://www.vinodpatel.com.fj/cdn/shop/files/amex.png?v=1743112832' },
  { name: 'PayPal', icon: 'https://www.vinodpatel.com.fj/cdn/shop/files/paypal.png?v=1743112832' },
  { name: 'Apple Pay', icon: 'https://www.vinodpatel.com.fj/cdn/shop/files/apple-pay.png?v=1743112832' },
  { name: 'Google Pay', icon: 'https://www.vinodpatel.com.fj/cdn/shop/files/google-pay.png?v=1743112832' }
];

const socialMedia: SocialMediaItem[] = [
  { 
    name: 'Facebook', 
    href: 'https://facebook.com', 
    icon: <Facebook className="w-4 h-4" />
  },
  { 
    name: 'Instagram', 
    href: 'https://instagram.com', 
    icon: <Instagram className="w-4 h-4" />
  },
  { 
    name: 'Twitter', 
    href: 'https://twitter.com', 
    icon: <Twitter className="w-4 h-4" />
  },
  { 
    name: 'YouTube', 
    href: 'https://youtube.com', 
    icon: <Youtube className="w-4 h-4" />
  },
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com', 
    icon: <Linkedin className="w-4 h-4" />
  }
];

export function FooterV2() {
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
    setIsChecked(false);
  };

  return (
    <footer className="w-full bg-[#FFFBFA] text-gray-800">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <div className="lg:max-w-md">
            <h3 className="text-lg font-semibold mb-2">Join our mailing list</h3>
            <p className="text-sm">Be the first to hear about the latest products, projects and inspiration.</p>
          </div>
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSubscribe} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-sm hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy-policy"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="mt-1"
                  required
                />
                <label htmlFor="privacy-policy" className="text-xs">
                  I consent to receiving newsletters and updates from Vinod Patel in accordance with Vinod Patel's{' '}
                  <a href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-gray-300">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Follow Us */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {socialMedia.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    aria-label={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Columns */}
            {footerColumns.map((column, index) => (
              <div key={index} className="col-span-1">
                <h4 className="text-sm font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Payment Methods */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h4 className="text-sm font-semibold mb-4">We Accept</h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
                {paymentMethods.map((method, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-center p-2 bg-white border border-gray-200 rounded-sm"
                  >
                    <Image 
                      src={method.icon} 
                      alt={method.name}
                      className="h-5 w-auto object-contain"
                      loading="lazy"
                      width={40}
                      height={25}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Vinod Patel Group. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterV2;
