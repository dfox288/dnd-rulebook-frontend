/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,tsx}',
    './app/components/**/*.stories.{js,ts,tsx}',
    // Include NuxtUI components so Tailwind scans them for classes
    './node_modules/@nuxt/ui/dist/runtime/components/**/*.{vue,js,ts,jsx,tsx}'
  ]
}
