import {
  ensureExtensionConstructionSites,
  ensureRoadConstructionSites,
} from '@/structures/room/RoomPlanner';
import { SpawnController } from '@/structures/spawn/SpawnController';
import { CreepController } from '@/creeps/CreepController';

export function runGame(): void {
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    ensureExtensionConstructionSites(room);
    ensureRoadConstructionSites(room);
    const spawnController = new SpawnController(room);
    spawnController.run();
  }

  const creepController = new CreepController();
  creepController.run();
}
