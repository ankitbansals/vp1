import { runtime } from '~/lib/makeswift/runtime';
import { Checkbox, Image, Link, Select, TextInput } from '@makeswift/runtime/controls';
import { ImageBanner } from '@/vibes/soul/sections/home-page-sections/image-banner';

runtime.registerComponent(ImageBanner, {
  type: 'section-banner',
  label: 'Sections / Image Banner',
  props: {
    title: TextInput({ label: 'Title', defaultValue: 'Featured Banner' }),
    description: TextInput({ label: 'Description', defaultValue: 'Explore our latest collection with exclusive discounts on premium products.' }),
    ctaLabel: TextInput({ label: 'CTA Label', defaultValue: 'Learn More' }),
    ctaReference: Link({ label: 'CTA Link'}),
    imageSrc: Image({ label: 'Image' }),
    imageAlt: TextInput({ label: 'Image Alt/Title' }),
    showNewBadge: Checkbox({ label: 'Show Badge', defaultValue: true }),
    badgeLabel: TextInput({ label: 'Badge Label', defaultValue: 'New' }),
    badgeVariant: Select({
      label: 'Badge Variant',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' },
      ],
      defaultValue: 'primary',
    }),
    variant: Select({
      label: 'Variant',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Simple', value: 'simple' },
      ],
      defaultValue: 'standard',
    }),
    className: TextInput({ label: 'Custom CSS Classes' }),
  },
});

