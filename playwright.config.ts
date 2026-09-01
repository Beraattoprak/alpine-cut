import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Next optimiert die Salonfotos beim ersten Abruf on demand. Treffen mehrere
  // Worker gleichzeitig auf einen kalten Bildcache, laufen einzelne Tests in
  // den Timeout — mit einem Worker gehen dieselben Tests durch. Zwei Worker
  // sind der Kompromiss zwischen Laufzeit und Verlaesslichkeit auf dieser
  // Maschine.
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    { name: 'mobil', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
