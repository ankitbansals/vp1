/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './vibes/**/*.{ts,tsx}',
    '!./node_modules/**', // Exclude everything in node_modules to speed up builds
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    fontFamily: {
      sans: ['var(--font-family-inter)', 'system-ui', 'sans-serif'],
      serif: ['var(--font-family-dm-serif-text)', 'serif'],
      mono: ['var(--font-family-roboto-mono)', 'monospace'],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-heading)',
            },
            h2: {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-heading)',
            },
            h3: {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-heading)',
            },
            h4: {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-heading)',
            },
            h5: {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-heading)',
            },
            h6: {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-heading)',
            },
            p: {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-body)',
            },
            a: {
              color: 'color-mix(in oklab, hsl(var(--primary)), black 15%)',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            ul: {
              color: 'hsl(var(--contrast-500))',
              fontFamily: 'var(--font-family-body)',
            },
            ol: {
              color: 'hsl(var(--contrast-500))',
              fontFamily: 'var(--font-family-body)',
            },
            strong: {
              fontWeight: '600',
            },
            blockquote: {
              borderLeftColor: 'hsl(var(--contrast-300))',
              p: {
                color: 'hsl(var(--contrast-500))',
                fontStyle: 'normal',
                fontWeight: '400',
              },
            },
            code: {
              color: 'hsl(var(--contrast-500))',
              fontFamily: 'var(--font-family-mono)',
            },
            pre: {
              color: 'hsl(var(--background))',
              backgroundColor: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-family-mono)',
            },
          },
        },
      },
      colors: {
        brand: {
          50: '#f8f5f2',  
          900: '#88040B', 
          700: '#B70E03',
          600: '#E30613',
          200: '#FCE6E7',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          highlight: 'color-mix(in oklab, hsl(var(--primary)), white 75%)',
          shadow: 'color-mix(in oklab, hsl(var(--primary)), black 75%)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          highlight: 'color-mix(in oklab, hsl(var(--accent)), white 75%)',
          shadow: 'color-mix(in oklab, hsl(var(--accent)), black 75%)',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          highlight: 'color-mix(in oklab, hsl(var(--success)), white 75%)',
          shadow: 'color-mix(in oklab, hsl(var(--success)), black 75%)',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          highlight: 'color-mix(in oklab, hsl(var(--error)), white 75%)',
          shadow: 'color-mix(in oklab, hsl(var(--error)), black 75%)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          highlight: 'color-mix(in oklab, hsl(var(--warning)), white 75%)',
          shadow: 'color-mix(in oklab, hsl(var(--warning)), black 75%)',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          highlight: 'color-mix(in oklab, hsl(var(--info)), white 75%)',
          shadow: 'color-mix(in oklab, hsl(var(--info)), black 75%)',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        contrast: {
          100: 'hsl(var(--contrast-100))',
          200: 'hsl(var(--contrast-200))',
          300: 'hsl(var(--contrast-300))',
          400: 'hsl(var(--contrast-400))',
          500: 'hsl(var(--contrast-500))',
        },
      },
      fontFamily: {
        heading: [
          'var(--font-family-heading)',
          {
            fontFeatureSettings: 'var(--font-feature-settings-heading)',
            fontVariationSettings: 'var(--font-variation-settings-heading)',
          },
        ],
        body: [
          'var(--font-family-body)',
          {
            fontFeatureSettings: 'var(--font-feature-settings-body)',
            fontVariationSettings: 'var(--font-variation-settings-body)',
          },
        ],
        mono: [
          'var(--font-family-mono)',
          {
            fontFeatureSettings: 'var(--font-feature-settings-mono)',
            fontVariationSettings: 'var(--font-variation-settings-mono)',
          },
        ],
        inter:['Inter']
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: 'var(--font-size-xl, 1.25rem)',
        '2xl': 'var(--font-size-2xl, 1.5rem)',
        '3xl': 'var(--font-size-3xl, 1.875rem)',
        '4xl': 'var(--font-size-4xl, 2.25rem)',
        '5xl': 'var(--font-size-5xl, 3rem)',
        '6xl': 'var(--font-size-6xl, 3.75rem)',
        '7xl': 'var(--font-size-7xl, 4.5rem)',
        '8xl': 'var(--font-size-8xl, 6rem)',
        '9xl': 'var(--font-size-9xl, 8rem)',
      },
      shadows: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-base)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      keyframes: {
        collapse: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        expand: {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'marching-ants': {
          to: {
            'background-position':
              '0 0, 0 -1px, calc(100% + 1px) 0, 100% calc(100% + 1px), -1px 100%',
          },
        },
        rotateFade: {
          from: { opacity: '1', transform: 'rotateZ(0deg) translate3d(-50%,-50%,0)' },
          '35%': { opacity: '0' },
          '70%': { opacity: '0' },
          to: { opacity: '1', transform: 'rotateZ(360deg) translate3d(-50%,-50%,0)' },
        },
        rotate: {
          from: {
            transform: 'rotateZ(0deg) translate3d(-50%,-50%,0)',
          },
          to: {
            transform: 'rotateZ(360deg) translate3d(-50%,-50%,0)',
          },
        },
        scroll: {
          to: { backgroundPosition: '5px 0' },
        },
        dotScrollSmall: {
          to: { backgroundPosition: '-6px -6px, -12px -12px' },
        },
        dotScrollLarge: {
          to: { backgroundPosition: '-8px -8px, -16px -16px' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(1px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-2px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(2px, 0, 0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        collapse: 'collapse 400ms cubic-bezier(1, 0, 0.25, 1)',
        expand: 'expand 400ms cubic-bezier(1, 0, 0.25, 1)',
        marching: 'marching-ants 10s linear infinite',
        rotate: 'rotate 2000ms linear infinite',
        scroll: 'scroll 200ms infinite linear both',
        scrollLeft: 'scrollLeft var(--marquee-duration) linear infinite',
        shake: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        slideIn: 'slideIn 800ms cubic-bezier(0.25, 1, 0, 1)',
      },
    },
  },
  plugins: [
    // @ts-ignore
    require('tailwindcss-radix')(),
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
  ],
};

module.exports = config;
