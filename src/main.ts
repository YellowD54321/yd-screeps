import { runGame } from '@/gameRunner';
import { log } from '@/utils/logger';

export function loop(): void {
  runGame();
}
