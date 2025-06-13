
'use client'

import { runtime } from '~/lib/makeswift/runtime'
import { Image, TextInput, Link, Checkbox, Style, List, Group } from '@makeswift/runtime/controls'
import { PromotionsSection } from '@/vibes/soul/sections/home-page-sections/promotions-section';

runtime.registerComponent(PromotionsSection, {
  type: 'promotions-section',
  label: 'Sections/Promotions Section',
  icon: 'layout',
  props: {
    className: Style(),
    promotions: List({
      label: 'Promotions',
      type: Group({
        props: {
          title: TextInput({ 
            label: 'Promotion Title' 
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
          image: Group({
            label: 'Image',
            props: {
              src: Image({ label: 'Image File' }),
              alt: TextInput({ label: 'Alt Text', defaultValue: 'Promotion image' }),
              sizes: TextInput({ label: 'Sizes', defaultValue: '100vw' }),
            },
          }),
          showNewBadge: Checkbox({
            label: 'Show New Badge'
          })
        }
      }),
      getItemLabel(promotion) {
        return promotion?.title || 'Promotion';
      }
    })
  }
})