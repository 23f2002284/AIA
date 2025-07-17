import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Define your popup and options page entries
        popup: 'index.html',
        options: 'options.html',

        // Define the service worker entry
        'service-worker': 'src/background/service-worker.js'
      },
      output: {
        // Define the output filenames
        entryFileNames: (chunkInfo) => {
          // Output service-worker.js to the root
          if (chunkInfo.name === 'service-worker') {
            return 'service-worker.js';
          }
          // Place other JS files in an 'assets' folder
          return 'assets/[name].js';
        }
      }
    }
  }
})