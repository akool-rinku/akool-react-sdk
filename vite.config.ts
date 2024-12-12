
import { resolve } from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'

import * as packageJson from './package.json'
// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/App.tsx', 'src/main.tsx'],
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.tsx',
      name: 'AkoolReactSDK',
      fileName: 'akool-react-sdk'
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
}))