const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const clear = require('rollup-plugin-clear');
const fs = require('fs');
const path = require('path');

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

module.exports = {
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