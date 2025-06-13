# Theme System Documentation

## Overview
The theme system provides a flexible way to manage multiple brand themes in your Next.js application. It uses CSS variables for theming and supports dynamic theme switching based on the URL path.

## Core Concepts

### 1. Brand-Based Theming
- Each brand (e.g., Vinod Patel, Home & Living) has its own color scheme and styling
- Themes are applied based on the URL path (e.g., `/vinod-patel/*`, `/home-living/*`)
- Fallback to default theme when no brand is specified
- Seamless integration with Tailwind CSS for utility-first styling

### 2. CSS Variables & Tailwind Integration
- All theme values are exposed as CSS custom properties
- Tailwind is configured to use these CSS variables
- Brand-specific colors are automatically available as Tailwind classes
- Supports dark mode and other Tailwind features

## File Structure

```
core/theme/
├── theme.config.ts     # Theme configuration and types
├── themeProcessor.ts   # Theme processing logic
├── theme-provider.tsx  # React context provider for theming
└── themes/             # Brand-specific theme files
    ├── vinod-patel.css
    ├── home-living.css
    └── neutral.css
```

## Setup

### 1. Wrap Your Application

In your root layout or app component, wrap the application with the `BrandThemeProvider`:

```tsx
// app/layout.tsx
import { BrandThemeProvider } from '../core/theme/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BrandThemeProvider>
          {children}
        </BrandThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Define Your Themes

Each theme is defined in its own CSS file in the `themes` directory. For example:

```css
/* themes/vinod-patel.css */
:root {
  /* Brand colors */
  --color-primary: 24 95% 53%;
  --color-primary-foreground: 0 0% 100%;
  
  /* Component colors */
  --button-bg: var(--color-primary);
  --button-text: var(--color-primary-foreground);
}
```

## Usage

### Using Theme Variables in CSS

```css
.button {
  background-color: hsl(var(--button-bg));
  color: hsl(var(--button-text));
  border: 1px solid hsl(var(--border));
}
```

### Accessing Theme in Components

```tsx
'use client';

import { useBrandTheme } from '../core/theme/theme-provider';

export function ThemedButton() {
  const { brandId, theme } = useBrandTheme();
  
  return (
    <button 
      className="button"
      style={{
        backgroundColor: `hsl(${theme['--button-bg']})`,
        color: `hsl(${theme['--button-text']})`
      }}
    >
      {brandId} Button
    </button>
  );
}
```

### Dynamic Theme Switching

The theme automatically switches based on the URL path:
- `/vinod-patel/*` - Vinod Patel theme
- `/home-living/*` - Home & Living theme
- `/neutral/*` - Neutral theme
- `/*` - Default theme (Vinod Patel)

## Adding a New Theme

1. Create a new CSS file in `core/theme/themes/` (e.g., `new-brand.css`)
2. Define your theme variables:
   ```css
   :root {
     --color-primary: 120 60% 50%;
     --color-primary-foreground: 0 0% 100%;
     /* ... other variables ... */
   }
   ```
3. Update the theme processor to include your new theme

## Best Practices

1. **Use HSL for Colors**: 
   - Define colors in HSL format for better theming support
   - Use Tailwind's opacity modifiers (e.g., `bg-primary/80`)

2. **Variable Naming**: 
   - Follow the `--color-type-variant` naming convention
   - Keep variable names consistent across themes

3. **Tailwind Integration**:
   - Extend Tailwind's theme in `tailwind.config.js`
   - Use `@apply` for component styles that use theme variables
   - Leverage Tailwind's dark mode with theme variables

4. **Performance**:
   - Minimize the number of custom CSS variables
   - Use Tailwind's utility classes when possible
   - Avoid complex calculations in CSS variables

5. **Testing**:
   - Test themes in both light and dark modes
   - Verify contrast ratios for accessibility
   - Test on different devices and screen sizes

## Example: Branded Card Component

```jsx
import { useBrandTheme } from '../core/theme/theme-provider';

export function BrandedCard({ title, description }) {
  const { brandId } = useBrandTheme();
  
  return (
    <div className={`
      rounded-lg border border-border p-6 shadow-sm
      transition-all hover:shadow-md
      ${brandId === 'vinod-patel' ? 'hover:border-orange-300' : ''}
      ${brandId === 'home-living' ? 'hover:border-teal-300' : ''}
    `}>
      <h3 className="text-lg font-medium text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-muted-foreground">
        {description}
      </p>
      <button 
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded
                 hover:opacity-90 transition-opacity"
      >
        Learn More
      </button>
    </div>
  );
}
```

## Troubleshooting

### Theme Not Updating
- Ensure the `BrandThemeProvider` is properly wrapping your app
- Check the browser's dev tools to verify CSS variables are being applied
- Look for console errors in the browser

### Variables Not Working
- Make sure variables are defined in the correct theme file
- Verify variable names match exactly (case-sensitive)
- Check for typos in variable names

## Performance Considerations

- Theme styles are injected only when needed
- CSS variables provide excellent performance for theming
- No unnecessary re-renders when switching themes

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 is not supported (uses CSS Custom Properties)

## License

[Your License Here]

---

For more information or support, please contact [Your Support Contact].
