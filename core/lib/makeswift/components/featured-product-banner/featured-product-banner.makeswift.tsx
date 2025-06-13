'use client'

import { runtime } from '~/lib/makeswift/runtime'
import { Image, TextInput, Link, Checkbox, Style, Select } from '@makeswift/runtime/controls'
import FeaturedProductBanner from '@/vibes/soul/sections/home-page-sections/featured-product-banner'

runtime.registerComponent(FeaturedProductBanner, {
  type: 'featured-product-banner',
  label: 'Sections/Featured Product Banner',
  icon: 'layout',
  props: {
    className: Style(),
    title: TextInput({ 
      label: 'Title' 
    }),
    description: TextInput({
      label: 'Description',
    }),
    ctaLabel: TextInput({ 
      label: 'CTA Label' 
    }),
    ctaReference: Link({ 
      label: 'CTA Link' 
    }),
    showNewBadge: Checkbox({
      label: 'Show Badge'
    }),
    badgeLabel: TextInput({
      label: 'Badge Label'
    }),
    badgeVariant: Select({
      label: 'Badge Variant',
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'danger', label: 'Danger' },
        { value: 'warning', label: 'Warning' },
        { value: 'info', label: 'Info' }
      ]
    }),
    backgroundImage: Image({
      label: 'Background Image'
    })
  }
})
