// In featured-brands.makeswift.tsx
import { runtime } from '~/lib/makeswift/runtime';
import { Image, Link, TextInput, List, Group } from '@makeswift/runtime/controls';
import { FeaturedBrands } from '@/vibes/soul/sections/featured-brands';

runtime.registerComponent(FeaturedBrands, {
  type: 'featured-brands',
  label: 'Sections / Featured Brands',
  props: {
    viewAllUrl: Link({ 
      label: 'View All Link',
    }),
    viewAllLabel: TextInput({ 
      label: 'View All Label',
      defaultValue: 'View all Brands' 
    }),
    brands: List({
      label: 'Brands',
      type: Group({
        label: 'Brand',
        props: {
          logo: Image({ 
            label: 'Logo',
          }),
          logoAlt: TextInput({ 
            label: 'Logo Alt',
            defaultValue: 'Brand logo'
          }),
          url: Link({ label: 'URL' }),
        },
      }),
    })
  }
});