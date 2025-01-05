import { SpawnController } from '@/structures/spawn/SpawnController';
import { CreepController } from '@/creeps/CreepController';

export function runGame(): void {
  console.log(`Current game tick: ${Game.time}`);

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    const spawnController = new SpawnController(room);
    spawnController.run();
  }

  const creepController = new CreepController();
  creepController.run();
}
