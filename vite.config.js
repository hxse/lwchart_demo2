import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      // todo 后面更新库文件路径
      // entry: path.resolve(__dirname, 'src/lib/index.js'),
      // name: 'MyChartLibrary',
      // fileName: (format) => `my-chart-library.${format}.js`,
    },
    rollupOptions: {
      external: ['svelte'], // 告诉 Rollup 不要打包 Svelte
      output: {
        globals: {
          svelte: 'Svelte',
        },
      },
    },
  },
})
