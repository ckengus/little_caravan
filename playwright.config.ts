import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({testDir:'tests/browser',use:{launchOptions:{executablePath:existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined},baseURL:'http://127.0.0.1:4173'},webServer:{command:'npm run preview -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:false},projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['Pixel 7']}}]});
