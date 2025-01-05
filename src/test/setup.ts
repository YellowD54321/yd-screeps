import { mockGame, mockMemory } from './mockGame';

// Add mock game environment to global scope
Object.assign(global, mockGame);

// Add mock Memory object to global scope
(global as any).Memory = mockMemory;

// Add mock Game object to global scope
(global as any).Game = mockGame;
