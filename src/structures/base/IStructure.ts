export interface IStructure {
  // 主要運行邏輯
  run(): void;

  // 獲取建築物資訊
  getId(): Id<Structure>;
  getPos(): RoomPosition;
  getRoom(): Room;
}
