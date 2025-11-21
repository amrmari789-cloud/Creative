import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if running in standalone mode
const isStandalone = process.env.VITE_STANDALONE !== 'false';

export default defineConfig({
    plugins: [
        // Only use Laravel plugin if not in standalone mode
        ...(isStandalone ? [] : [
            laravel({
                input: ['resources/css/app.css', 'resources/js/main.jsx'],
                refresh: true,
            })
        ]),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    server: {
        port: 5173,
        host: true,
        open: true,
        strictPort: false,
    },
    build: {
        outDir: 'dist',
        rollupOptions: isStandalone ? {
            input: path.resolve(__dirname, 'index.html'),
        } : undefined,
    },
    root: '.',
});

