import react from '@vitejs/plugin-react';
import { platform, tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [react()],
  build: { emptyOutDir: platform() !== 'win32' },
  cacheDir: join(tmpdir(), 'los-maestros-vite'),
  test: { environment: 'jsdom' },
});
