import { recordFrequentPath } from '@/utils/pathRecord';

describe('recordFrequentPath', () => {
  const createMockCreep = (pos: { x: number; y: number }, controllerLevel?: number) => {
    const roomMemory: Record<string, boolean> = {};
    const room = {
      name: 'W1N1',
      memory: roomMemory,
      controller: controllerLevel !== undefined ? { level: controllerLevel } : undefined,
    } as unknown as Room;

    return {
      pos: { x: pos.x, y: pos.y },
      room,
    } as unknown as Creep;
  };

  describe('RCL 1', () => {
    it('should record coordinates to frequentPaths', () => {
      const creep = createMockCreep({ x: 25, y: 30 }, 1);

      recordFrequentPath(creep);

      expect(creep.room.memory.frequentPaths).toEqual({ '25,30': true });
    });
  });

  describe('RCL 3', () => {
    it('should not record when RCL > 2', () => {
      const creep = createMockCreep({ x: 25, y: 30 }, 3);

      recordFrequentPath(creep);

      expect(creep.room.memory.frequentPaths).toBeUndefined();
    });
  });

  describe('duplicate coordinates', () => {
    it('should not overwrite or duplicate when coordinate already exists', () => {
      const creep = createMockCreep({ x: 25, y: 30 }, 1);
      creep.room.memory.frequentPaths = { '25,30': true };

      recordFrequentPath(creep);

      expect(creep.room.memory.frequentPaths).toEqual({ '25,30': true });
    });
  });

  describe('auto initialization', () => {
    it('should create frequentPaths object on first call', () => {
      const creep = createMockCreep({ x: 10, y: 20 }, 1);
      expect(creep.room.memory.frequentPaths).toBeUndefined();

      recordFrequentPath(creep);

      expect(creep.room.memory.frequentPaths).toBeDefined();
      expect(creep.room.memory.frequentPaths).toEqual({ '10,20': true });
    });
  });
});
