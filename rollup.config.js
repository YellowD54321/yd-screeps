import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import clear from 'rollup-plugin-clear';
import fs from 'fs';
import path from 'path';

// 自定義插件：複製到私人伺服器
const copyToPrivateServer = () => {
  return {
    name: 'copy-to-private-server',
    writeBundle: async () => {
      const targetDir = '/Users/yellowd/Library/Application Support/Screeps/scripts/127_0_0_1___21025/default';
      const sourceFile = 'dist/main.js';
      const sourceMapFile = 'dist/main.js.map';

      // 確保目標目錄存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 複製 main.js
      fs.copyFileSync(sourceFile, path.join(targetDir, 'main.js'));
      
      // 複製 source map（如果存在）
      if (fs.existsSync(sourceMapFile)) {
        fs.copyFileSync(sourceMapFile, path.join(targetDir, 'main.js.map'));
      }
      
      console.log('Files copied to private server directory successfully!');
    }
  };
};

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    clear({ targets: ['dist'] }),
    resolve({ rootDir: 'src' }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    copyToPrivateServer()
  ]
}; 