'use client';

import { useState } from 'react';

interface NewsletterFormProps {
  translations?: {
    placeholder?: string;
    button?: string;
    consent?: string;
  };
}

export const NewsletterForm = ({ translations = {} }: NewsletterFormProps) => {
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
    setIsChecked(false);
  };

  return (
    <form onSubmit={handleSubscribe} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={translations?.placeholder || 'Enter your email'}
          className="flex-1 min-w-0 px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-900"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#AA050E] rounded hover:bg-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-900 focus:ring-offset-1"
        >
          {translations?.button || 'Subscribe'}
        </button>
      </div>
      <div className="flex items-start">
        <input
          type="checkbox"
          id="consent"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="mt-1 mr-2"
          required
        />
        <label htmlFor="consent" className="text-xs text-gray-600">
          {translations?.consent || 'I agree to receive marketing communications'}
        </label>
      </div>
    </form>
  );
};
