/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require('tailwindcss/plugin');

export default {
  darkMode: 'selector',
  content: [
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./composables/**/*.{js,ts}`,
    `./plugins/**/*.{js,ts}`,
    `./utils/**/*.{js,ts}`,
    `./App.{js,ts,vue}`,
    `./app.{js,ts,vue}`,
    `./Error.{js,ts,vue}`,
    `./error.{js,ts,vue}`,
    `./app.config.{js,ts}`
  ],
  theme: {
    extend: {
      // https://www.hyperui.dev/blog/text-shadow-with-tailwindcss
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        outline: '2px 2px 0 var(--tw-shadow-color), 2px -2px 0 var(--tw-shadow-color), -2px 2px 0 var(--tw-shadow-color), -2px -2px 0 var(--tw-shadow-color), 2px 0px 0 var(--tw-shadow-color), 0px 2px 0 var(--tw-shadow-color), -2px 0px 0 var(--tw-shadow-color), 0px -2px 0 var(--tw-shadow-color), 2px 2px 20px rgba(255, 165, 0, 0)',
      },
      colors: {
        // Light
        primary1: "#0060B9",
        primary2: "#193EBD",
        secondary1: "#E5F0FF",
        secondary2: "#D9E3F2",
        accent1: "#AFD8F5",
        accent2: "#9DC4F5",
        neutral1: "#FFFFFF",
        neutral2: "#141A22",
        gray1: "#A7A7A7",
        gray2: "#D2D2D2",

        // Dark
        darkPrimary1Dark: "#0077E5",
        darkPrimary2Dark: "#004F98",
        darkSecondary1Dark: "#E5F0FF",
        darkSecondary2Dark: "#BBBBBB",
        darkAccent1Dark: "#2F3D50",
        darkAccent2Dark: "#546D90",
        darkNeutral1: "#141A22",
        darkNeutral2: "#FFFFFF",
        current: colors.current,
        inherit: colors.inherit,
        transparent: colors.transparent,
      }
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      )
    }),
  ],
}