'use client';

import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type PropsWithChildren,
  type Ref,
  useContext,
} from 'react';

import { Footer } from '@/vibes/soul/sections/footer';

import { mergeSections } from '../../utils/merge-sections';

type FooterProps = ComponentPropsWithoutRef<typeof Footer>;

// MakeswiftFooter does not support streamable sections
type ContextProps = Omit<FooterProps, 'sections'> & {
  sections: Awaited<FooterProps['sections']>;
};

const defaultLogo = {
  src: '',
  alt: '',
  width: 0,
  height: 0,
};

const PropsContext = createContext<ContextProps>({
  sections: [],
  logo: defaultLogo,
  copyright: '',
});

export const PropsContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: ContextProps }>) => (
  <PropsContext.Provider value={value}>{children}</PropsContext.Provider>
);

interface Props {
  logo: {
    show: boolean;
    src?: string;
    width: number;
    height: number;
    alt: string;
  };
  sections: Array<{
    title: string;
    links: Array<{
      label: string;
      link: { href: string };
    }>;
  }>;
  copyright?: string;
}

function combineSections(
  passedSections: ContextProps['sections'],
  makeswiftSections: Props['sections'],
): ContextProps['sections'] {
  return mergeSections(
    passedSections,
    makeswiftSections.map(({ title, links }) => ({
      title,
      links: links.map(({ label, link }) => ({ label, href: link.href })),
    })),
    (left, right) => ({ ...left, links: [...left.links, ...right.links] }),
  );
}

export const MakeswiftFooter = forwardRef<HTMLDivElement, Props>(
  ({ logo, sections, copyright }, ref) => {
    const passedProps = useContext(PropsContext);
    const showLogo = logo?.show !== false; // Default to true if not specified
    
    // Create logo object with proper type for the Footer component
    const logoObject = logo?.src 
      ? { src: logo.src, alt: logo.alt || '' } 
      : passedProps.logo;

    const footerProps = {
      ...passedProps,
      copyright: copyright ?? passedProps.copyright,
      logo: showLogo ? logoObject : undefined,
      logoHeight: showLogo ? (logo?.height || 0) : 0,
      logoWidth: showLogo ? (logo?.width || 0) : 0,
      sections: combineSections(passedProps.sections, sections)
    };

    // Remove ref from footerProps since it's not a valid prop for Footer
    const { ref: _, ...restFooterProps } = footerProps as any;

    return (
      <div ref={ref}>
        <Footer {...restFooterProps} />
      </div>
    );
  },
);
