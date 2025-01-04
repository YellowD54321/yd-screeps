import { runGame } from '@/gameRunner';
import { log } from '@/utils/logger';

// 遊戲的主循環函數
export function loop(): void {
  log('Loop started');
  runGame();
}
