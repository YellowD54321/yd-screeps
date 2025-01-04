import { interpret } from 'xstate';
import { creepMachine } from '../creepMachine';

describe('CreepMachine', () => {
  it('should initialize in idle state', () => {
    const service = interpret(creepMachine).start();
    expect(service.getSnapshot().value).toBe('idle');
    service.stop();
  });

  it('should transition from idle to harvesting', () => {
    const service = interpret(creepMachine).start();
    service.send({ type: 'HARVEST' });
    expect(service.getSnapshot().value).toBe('harvesting');
    service.stop();
  });

  it('should transition from harvesting to transferring when full', () => {
    const service = interpret(creepMachine).start();
    service.send({ type: 'HARVEST' });
    service.send({ type: 'FULL' });
    expect(service.getSnapshot().value).toBe('transferring');
    service.stop();
  });

  it('should return to idle when task is done', () => {
    const service = interpret(creepMachine).start();
    service.send({ type: 'HARVEST' });
    service.send({ type: 'DONE' });
    expect(service.getSnapshot().value).toBe('idle');
    service.stop();
  });
});
