import { BaseStructure } from '../BaseStructure';

// 創建一個測試用的具體類別
class TestStructure extends BaseStructure {
  constructor(structure: Structure) {
    super(structure);
  }

  public run(): void {
    // 測試用實現
  }
}

describe('BaseStructure', () => {
  // 模擬 Structure 物件
  const mockStructure = {
    id: 'test_id' as Id<Structure>,
    pos: {
      x: 0,
      y: 0,
      roomName: 'test_room',
    } as RoomPosition,
    room: {} as Room,
  } as Structure;

  it('should correctly initialize with a structure', () => {
    const structure = new TestStructure(mockStructure);
    expect(structure).toBeDefined();
  });

  it('should have access to structure properties', () => {
    const structure = new TestStructure(mockStructure);
    expect(structure.getId()).toBe(mockStructure.id);
    expect(structure.getPos()).toBe(mockStructure.pos);
    expect(structure.getRoom()).toBe(mockStructure.room);
  });
});
