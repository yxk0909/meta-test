import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssPxtorem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssPxtorem({
          rootValue: 75, // 换算的基数 1rem = 75px
          selectorBlackList: [],
          propList: ['*']
        }),
        autoprefixer()
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      overlay: false
    }
  }
})
