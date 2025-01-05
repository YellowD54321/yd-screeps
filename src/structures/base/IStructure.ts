export interface IStructure {
  run(): void;
  getId(): Id<Structure>;
  getPos(): RoomPosition;
  getRoom(): Room;
}
