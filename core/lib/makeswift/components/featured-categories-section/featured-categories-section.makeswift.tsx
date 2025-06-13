
'use client'

import { runtime } from '~/lib/makeswift/runtime'
import { Style, TextInput } from '@makeswift/runtime/controls'
import { FeaturedCategoriesSection } from '@/vibes/soul/sections/featured-category-section'

runtime.registerComponent(FeaturedCategoriesSection, {
  type: 'featured-categories-section',
  label: 'Sections/Featured Categories Section',
  icon: 'layout',
  props: {
    className: Style(),
    title: TextInput({
      label: 'Section Title'
    })
  }
})