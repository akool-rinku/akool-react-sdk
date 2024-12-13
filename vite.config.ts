import react from '@vitejs/plugin-react'
import path from 'node:path'
import dts from 'vite-plugin-dts'
import tailwindcss from 'tailwindcss'
import { Plugin, UserConfigExport, defineConfig } from 'vite'
import { name } from './package.json'
import tsconfigPaths from 'vite-tsconfig-paths'
const app = async (): Promise<UserConfigExport> => {
  /**
   * Removes everything before the last
   * @octocat/library-repo -> library-repo
   * vite-component-library-template -> vite-component-library-template
   */
  const formattedName = name.match(/[^/]+$/)?.[0] ?? name

  return defineConfig({
    plugins: [
      react() as unknown as Plugin,
      dts({
        insertTypesEntry: true,
      }) as unknown as Plugin,
      tsconfigPaths() as unknown as Plugin,
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        name: formattedName,
        formats: ['es', 'umd'],
        fileName: (format) => `${formattedName}.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react/jsx-runtime', 'react-dom', 'tailwindcss'],
        output: {
          globals: {
            react: 'React',
            'react/jsx-runtime': 'react/jsx-runtime',
            'react-dom': 'ReactDOM',
            tailwindcss: 'tailwindcss',
          },
        },
      },
    },
  })
}
// https://vitejs.dev/config/
export default app