import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        strictPort: true,
        watch: {
            interval: 100, // Increase the interval to 1 second
        },
    },
})
