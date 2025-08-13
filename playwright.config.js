import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '__tests__',
    webServer: {
        command: 'npm start',
        port: 8080,
        timeout: 180 * 1000,
        reuseExistingServer: !process.env.CI, // en local, si ya está abierto no lo levanta
    },
    use: {
        headless: true,
        baseURL: 'http://localhost:8080',
    },
});
