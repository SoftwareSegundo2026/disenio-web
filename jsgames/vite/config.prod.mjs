import { defineConfig } from 'vite';

//  Config de producción: minifica con terser y deja Phaser aparte.
export default defineConfig({
    base: './',
    logLevel: 'warn',
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            },
            mangle: true,
            format: {
                comments: false
            }
        }
    },
    server: {
        port: 8080
    }
});
