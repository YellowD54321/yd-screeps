import { createActor } from 'xstate';
import { creepMachine } from '@/creeps/creepMachine';

describe('CreepMachine', () => {
  it('should initialize in harvesting state for miner role', () => {
    const actor = createActor(creepMachine);
    actor.start();
    expect(actor.getSnapshot().value).toBe('harvesting');
  });

  it('should transition from harvesting to transferring when full', () => {
    const actor = createActor(creepMachine);
    actor.start();
    actor.send({ type: 'FULL' });
    expect(actor.getSnapshot().value).toBe('transferring');
  });

  it('should return to harvesting when transfer is done', () => {
    const actor = createActor(creepMachine);
    actor.start();
    actor.send({ type: 'FULL' });
    actor.send({ type: 'DONE' });
    expect(actor.getSnapshot().value).toBe('harvesting');
  });
});

describe('Miner role', () => {
  it('should start in harvesting state when spawned', () => {
    const actor = createActor(creepMachine);
    actor.start();
    expect(actor.getSnapshot().matches('harvesting')).toBe(true);
  });

  it('should transition from harvesting to transferring when energy is full', () => {
    const actor = createActor(creepMachine);
    actor.start();
    actor.send({ type: 'FULL' });
    expect(actor.getSnapshot().matches('transferring')).toBe(true);
  });

  it('should transition from transferring to harvesting when energy is empty', () => {
    const actor = createActor(creepMachine);
    actor.start();
    actor.send({ type: 'FULL' });
    actor.send({ type: 'NO_ENERGY' });
    expect(actor.getSnapshot().matches('harvesting')).toBe(true);
  });
});
