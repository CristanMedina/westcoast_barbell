import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
        extend: {
          colors: {
            dark: "#252430",
            primary: "#42007b",
            accentPurple: "#5d03a5",
            accentGreen: "#56d722",
          },
        },
      },
    }),
  ],
})
