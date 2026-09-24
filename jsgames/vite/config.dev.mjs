import { defineConfig } from 'vite';

//  Config de desarrollo: puerto fijo y Phaser en su propio chunk (así el
//  recargado en caliente no re-procesa toda la librería).
export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        }
    },
    server: {
        port: 8080,
        open: false
    }
});
