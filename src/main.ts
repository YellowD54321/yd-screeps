import { loop } from './loop';
import { log } from './utils/logger';

// Game 對象會在遊戲環境中被注入
export const TICK_START = Game.time;

// 輸出為 CommonJS 格式
module.exports.loop = function (): void {
  log('Loop started');
  loop();
};
