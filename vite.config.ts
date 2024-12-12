
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
      copyDtsFiles: true,
      include: ['**/*.ts', '**/*.tsx', '**/*.js'],
      exclude: [
        'src/vite-env.d.ts',
        'src/App.tsx',
        'src/main.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/Demo.tsx',
        'node_modules',
        '__VLS_types.d.ts',
      ],
    }),
  ],
  
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'AkoolReactSDK',
      fileName: 'akool-react-sdk'
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
}))