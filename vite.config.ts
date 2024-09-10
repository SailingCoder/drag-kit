import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  build: {
    lib: {
      entry: './src/drag/index.ts',
      name: 'DragKit',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        dir: 'lib',
      },
      plugins: [
        typescript({
          tsconfig: './tsconfig.json', // 确保 tsconfig.json 路径正确
          exclude: ['node_modules', '**/__tests__/**'], // 确保正确排除不必要的文件
        }),
      ],
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 删除 console
        pure_funcs: ['console.info', 'console.debug'], // 删除指定函数调用
      },
      mangle: {
        properties: {
          regex: /^_/, // 混淆以 _ 开头的私有属性
        },
      },
      // format: {
      //   comments: false, // 删除所有注释
      // },
      toplevel: true, // 混淆顶级作用域
      keep_fnames: false, // 不保留函数名
    },
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
