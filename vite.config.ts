import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  build: {
    lib: {
      entry: './package/index.ts',
      name: 'DragKit',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
      },
      plugins: [
        typescript({
          tsconfig: './tsconfig.json', // 确保 tsconfig.json 路径正确
        }),
      ],
    },
    minify: 'terser',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  server: {
    port: 5173, // 确保端口号正确
    open: true, // 可选，是否自动打开浏览器
    proxy: {
      // 可选，配置代理
    }
  }
});
