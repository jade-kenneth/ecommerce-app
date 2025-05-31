const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
import defaultTheme from 'tailwindcss/defaultTheme';
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    join(__dirname, 'src/**/*.{js,jsx,ts,tsx}'),
    join(__dirname, '../../libs/**/*.{js,jsx,ts,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      sans: ["'Inter'", ...defaultTheme.fontFamily.sans],
      mono: ["'Fira Code'", ...defaultTheme.fontFamily.mono],
      'open-sans': ["'Open Sans'", ...defaultTheme.fontFamily.sans],
    },
    colors: {
      black: '#000000',
      white: '#FFFFFF',
      unset: 'unset',
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
    },
    extend: {
      zIndex: {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        auto: 'auto',
        docked: '10',
        dropdown: '1000',
        sticky: '1100',
        banner: '1200',
        overlay: '1300',
        modal: '1400',
        popover: '1500',
        skipLink: '1600',
        toast: '1700',
        tooltip: '1800',
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        9.5: '2.375rem',
        13: '3.25rem',
        14: '3.5rem',
        xxs: '0.125rem',
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'collapse-in': {
          from: { height: '0' },
          to: { height: 'var(--height)' },
        },
        'collapse-out': {
          from: { height: 'var(--height)' },
          to: { height: '0' },
        },
        'collapse-x-in': {
          from: { width: '0' },
          to: { width: 'var(--width)' },
        },
        'collapse-x-out': {
          from: { width: 'var(--width)' },
          to: { width: '0' },
        },
        skeleton: {
          from: { 'background-position': '100% 0' },
          to: { 'background-position': '-100% 0' },
        },
        'dialog-in': {
          from: { transform: 'translateY(64px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'dialog-out': {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(64px)', opacity: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0%)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'fade-out': 'fade-out 200ms cubic-bezier(0.3, 0, 0.8, 0.15);',
        'collapse-in': 'collapse-in 250ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'collapse-out': 'collapse-out 200ms cubic-bezier(0.3, 0, 0.8, 0.15)',
        'collapse-x-in': 'collapse-x-in 250ms ease-in-out',
        'collapse-x-out': 'collapse-x-out 200ms ease-in-out',
        skeleton: 'skeleton 2s linear infinite',
        'backdrop-in': 'fade-in 250ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'backdrop-out': 'fade-out 200ms cubic-bezier(0.3, 0, 0.8, 0.15)',
        'dialog-in': 'dialog-in 400ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'dialog-out': 'dialog-out 200ms cubic-bezier(0.3, 0, 0.8, 0.15)',
        'drawer-in': 'slide-in-right 400ms cubic-bezier(0.05, 0.7, 0.1, 1)',
        'drawer-out': 'slide-out-right 200ms cubic-bezier(0.3, 0, 0.8, 0.15)',
      },
      aria: {
        asc: 'sort="ascending"',
        desc: 'sort="descending"',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-plugin-zag'),
  ],
};
