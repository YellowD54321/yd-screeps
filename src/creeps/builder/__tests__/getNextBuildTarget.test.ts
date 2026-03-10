import { getNextBuildTarget } from '@/creeps/builder/getNextBuildTarget';

describe('getNextBuildTarget', () => {
  const find = jest.fn();
  const mockCreep = {
    room: { find },
  } as unknown as Creep;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return extension over road when both exist', () => {
    const extensionSite = { id: 'ext1', structureType: STRUCTURE_EXTENSION } as ConstructionSite;
    const roadSite = { id: 'road1', structureType: STRUCTURE_ROAD } as ConstructionSite;
    find.mockReturnValue([roadSite, extensionSite]);

    const result = getNextBuildTarget(mockCreep);

    expect(result).toBe(extensionSite);
  });

  it('should return road when no extensions exist', () => {
    const roadSite = { id: 'road1', structureType: STRUCTURE_ROAD } as ConstructionSite;
    find.mockReturnValue([roadSite]);

    const result = getNextBuildTarget(mockCreep);

    expect(result).toBe(roadSite);
  });

  it('should return null when no construction sites exist', () => {
    find.mockReturnValue([]);

    const result = getNextBuildTarget(mockCreep);

    expect(result).toBeNull();
  });

  it('should return the first extension when multiple extensions exist', () => {
    const ext1 = { id: 'ext1', structureType: STRUCTURE_EXTENSION } as ConstructionSite;
    const ext2 = { id: 'ext2', structureType: STRUCTURE_EXTENSION } as ConstructionSite;
    find.mockReturnValue([ext1, ext2]);

    const result = getNextBuildTarget(mockCreep);

    expect(result).toBe(ext1);
  });

  it('should call find with FIND_CONSTRUCTION_SITES', () => {
    find.mockReturnValue([]);

    getNextBuildTarget(mockCreep);

    expect(find).toHaveBeenCalledWith(FIND_CONSTRUCTION_SITES);
  });
});
