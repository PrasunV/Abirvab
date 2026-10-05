import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateImageVariants } from './scripts/generate-image-variants.mjs'

// Builds responsive WebP/JPEG copies of public/assets/images on dev start and
// every build. Never fails the build: problems fall back to original images.
const imageVariants = () => ({
  name: 'abirvab-image-variants',
  async buildStart() {
    try {
      await generateImageVariants()
    } catch (err) {
      console.warn('[images] variant generation failed, serving originals:', err.message)
    }
  },
})

export default defineConfig({
  plugins: [react(), imageVariants()],
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    sourcemap: false,
  },
})
