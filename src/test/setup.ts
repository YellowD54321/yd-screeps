import { mockGame, mockMemory, MockRoomPosition } from '@/test/mockGame';

// Add mock game environment to global scope
Object.assign(global, mockGame);

// Add mock Memory object to global scope
(global as any).Memory = mockMemory;

// Add mock Game object to global scope
(global as any).Game = mockGame;

// Mock RoomPosition for tests (Screeps global not available in Node)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).RoomPosition = MockRoomPosition;
