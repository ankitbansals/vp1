import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { BrandThemeProvider } from '~/theme/theme-provider';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <BrandThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </BrandThemeProvider>
  );
}

// Enable PPR (Progressive Partial Rendering)
export const experimental_ppr = true;
