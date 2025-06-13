import { runtime } from '~/lib/makeswift/runtime';
import { Checkbox, Group, Image, Link, List, Number, Select, TextArea, TextInput } from '@makeswift/runtime/controls';
import { Slideshow } from '@/vibes/soul/sections/slideshow';

runtime.registerComponent(Slideshow, {
  type: 'section-slideshow',
  label: 'Sections / Custom Slideshow',
  icon: 'carousel',
  props: {
    slides: List({
      label: 'Slides',
      type: Group({
        props: {
          title: TextInput({ label: 'Title', defaultValue: 'Slide title' }),
          subtitle: TextInput({ label: 'Sub Title', defaultValue: 'Slide subtitle' }),
          showDiscount: Checkbox({ label: 'Show discount', defaultValue: true }),
          discount: TextArea({ label: 'Discount', defaultValue: '% OFF' }),
          subDescription: TextArea({ label: 'Sub description' }),
          imageSrc: Image({ format: Image.Format.URL }),
          imageAlt: TextInput({ label: 'Image alt', defaultValue: 'Slide image' }),
          showButton: Checkbox({ label: 'Show button', defaultValue: true }),
          ctaText: TextInput({ label: 'Button text', defaultValue: 'Shop all' }),
          ctaLink: Link({ label: 'Button link' }),
          tag: TextInput({ label: 'Tag text', defaultValue: '' }),
          tagDescription: TextInput({ label: 'Tag description', defaultValue: "We've just released a new feature" }),
          tagLink: Link({ label: 'tag link' }),
          buttonColor: Select({
            label: 'Button color',
            options: [
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'tertiary', label: 'Tertiary' },
              { value: 'ghost', label: 'Ghost' },
            ],
            defaultValue: 'primary',
          }),
        },
      }),
      getItemLabel(slide) {
        return slide?.title || 'Slide title';
      },
    }),
    autoPlay: Checkbox({ label: 'Autoplay', defaultValue: true }),
    autoPlayInterval: Number({ label: 'Duration', defaultValue: 8, suffix: 's' }),
  }
},);

