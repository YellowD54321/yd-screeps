import { creepActions } from '@/creeps/creepActions';
import { mockGame } from '@/test/mockGame';

describe('creepActions', () => {
  const moveTo = jest.fn();
  const harvest = jest.fn();
  const transfer = jest.fn();

  const find = jest.fn();

  const mockCreep = {
    moveTo,
    harvest,
    transfer,
    room: { find },
    store: {
      getUsedCapacity: jest.fn(),
      getFreeCapacity: jest.fn(),
    },
  } as unknown as Creep;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('harvestEnergy', () => {
    it('should move to source if not in range', () => {
      const mockSource = { id: 'source1' } as Source;
      find.mockReturnValue([mockSource]);
      harvest.mockReturnValue(mockGame.ERR_NOT_IN_RANGE);

      creepActions.harvestEnergy(mockCreep);

      expect(find).toHaveBeenCalledWith(FIND_SOURCES);
      expect(harvest).toHaveBeenCalledWith(mockSource);
      expect(moveTo).toHaveBeenCalledWith(mockSource);
    });

    it('should harvest if in range', () => {
      const mockSource = { id: 'source1' } as Source;
      find.mockReturnValue([mockSource]);
      harvest.mockReturnValue(mockGame.OK);

      creepActions.harvestEnergy(mockCreep);

      expect(find).toHaveBeenCalledWith(FIND_SOURCES);
      expect(harvest).toHaveBeenCalledWith(mockSource);
      expect(moveTo).not.toHaveBeenCalled();
    });

    it('should do nothing if no sources found', () => {
      find.mockReturnValue([]);

      creepActions.harvestEnergy(mockCreep);

      expect(find).toHaveBeenCalledWith(FIND_SOURCES);
      expect(harvest).not.toHaveBeenCalled();
      expect(moveTo).not.toHaveBeenCalled();
    });
  });

  describe('transferEnergy', () => {
    it('should move to spawn if not in range', () => {
      const mockSpawn = { id: 'spawn1' } as StructureSpawn;
      find.mockReturnValue([mockSpawn]);
      transfer.mockReturnValue(mockGame.ERR_NOT_IN_RANGE);

      creepActions.transferEnergy(mockCreep);

      expect(find).toHaveBeenCalledWith(FIND_MY_SPAWNS);
      expect(transfer).toHaveBeenCalledWith(mockSpawn, RESOURCE_ENERGY);
      expect(moveTo).toHaveBeenCalledWith(mockSpawn);
    });

    it('should transfer if in range', () => {
      const mockSpawn = { id: 'spawn1' } as StructureSpawn;
      find.mockReturnValue([mockSpawn]);
      transfer.mockReturnValue(mockGame.OK);

      creepActions.transferEnergy(mockCreep);

      expect(find).toHaveBeenCalledWith(FIND_MY_SPAWNS);
      expect(transfer).toHaveBeenCalledWith(mockSpawn, RESOURCE_ENERGY);
      expect(moveTo).not.toHaveBeenCalled();
    });

    it('should do nothing if no spawns found', () => {
      find.mockReturnValue([]);

      creepActions.transferEnergy(mockCreep);

      expect(find).toHaveBeenCalledWith(FIND_MY_SPAWNS);
      expect(transfer).not.toHaveBeenCalled();
      expect(moveTo).not.toHaveBeenCalled();
    });
  });
});
