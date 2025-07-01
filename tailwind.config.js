/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-100',
    'bg-green-100', 
    'bg-purple-100',
    'bg-orange-100',
    'bg-red-100',
    'bg-yellow-100',
    'text-blue-600',
    'text-green-600',
    'text-purple-600', 
    'text-orange-600',
    'text-red-600',
    'text-yellow-600',
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-orange-50',
    'bg-red-50',
    'bg-yellow-50',
    'bg-primary-50',
    'bg-primary-100',
    'text-primary-600',
    'text-primary-700',
    'border-primary-300'
  ]
}