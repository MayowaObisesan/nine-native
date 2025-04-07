const { hairlineWidth } = require('nativewind/theme');
const {BUTTON_THEME} = require("./lib/constants");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    fontFamily: {
      Assistant: ["Assistant", "sans-serif"],
      "Assistant-ExtraBold": ["Assistant-ExtraBold", "serif"],
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
        nine: {
          DEFAULT: BUTTON_THEME.light.primary,
          foreground: BUTTON_THEME.light.default,
        },
        "base-100": {
          DEFAULT: 'var(--base-100)',
          foreground: 'var(--base-100)',
        },
        "base-200": {
          DEFAULT: 'var(--base-200)',
          foreground: 'var(--base-200)',
        },
        "base-300": {
          DEFAULT: 'var(--base-300)',
          foreground: 'var(--base-300)',
        },
        info: {
            DEFAULT: 'var(--info)',
        },
        success: {
            DEFAULT: 'var(--success)',
        },
        warning: {
            DEFAULT: 'var(--warning)',
        },
        error: {
            DEFAULT: 'var(--error)',
        },
        default: {
            DEFAULT: 'var(--default)',
        },
        neutral: {
            DEFAULT: 'var(--neutral)',
        },
        "base-content": {
            DEFAULT: 'var(--base-content)',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
