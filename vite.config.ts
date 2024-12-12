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
      copyDtsFiles: true,
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'), 
      name: 'AkoolReactSDK',
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    },
  },
}))