'use client'

import { runtime } from '~/lib/makeswift/runtime'
import { Image, TextInput, Link, Checkbox, Style, Select, Group } from '@makeswift/runtime/controls'
import { PromoBanner } from '@/vibes/soul/sections/home-page-sections/promo-banner'

runtime.registerComponent(PromoBanner, {
  type: 'promo-banner',
  label: 'Sections / Promo Banner',
  icon: 'image',
  props: {
    className: Style(),
    title: TextInput({
      label: 'Title',
      defaultValue: 'Promo Banner'
    }),
    description: TextInput({
      label: 'Description',
      defaultValue: "Limited time offers on our most popular products. Don't miss out!"
    }),
    ctaLabel: TextInput({
      label: 'CTA Label',
      defaultValue: 'Join Now'
    }),
    ctaReference: Link({
      label: 'CTA Link'
    }),
    image: Group({
      label: 'Image',
      props: {
        media: Group({
          label: 'Media',
          props: {
            file: Image({ label: 'Image' }),
            title: TextInput({
              label: 'Image Title',
              defaultValue: 'Promo Image'
            })
          }
        })
      }
    }),
    showNewBadge: Checkbox({
      label: 'Show New Badge',
      defaultValue: true
    }),
    badgeLabel: TextInput({
      label: 'Badge Text',
      defaultValue: 'New'
    }),
    badgeVariant: Select({
      label: 'Badge Variant',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' }
      ],
      defaultValue: 'primary'
    }),
    variant: Select({
      label: 'Banner Variant',
      options: [
        { label: 'Simple', value: 'simple' },
        { label: 'Standard', value: 'standard' }
      ],
      defaultValue: 'standard'
    })
  }
})
