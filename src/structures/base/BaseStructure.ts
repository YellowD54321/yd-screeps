import { IStructure } from './IStructure';

export abstract class BaseStructure implements IStructure {
  protected id: Id<Structure>;
  protected pos: RoomPosition;
  protected room: Room;

  constructor(structure: Structure) {
    this.id = structure.id;
    this.pos = structure.pos;
    this.room = structure.room;
  }

  // 每個建築物都需要實現的主要運行邏輯
  public abstract run(): void;

  // Getter 方法
  public getId(): Id<Structure> {
    return this.id;
  }

  public getPos(): RoomPosition {
    return this.pos;
  }

  public getRoom(): Room {
    return this.room;
  }

  // 共用的工具方法
  protected isActive(): boolean {
    return true; // 基本實現，子類可以覆寫
  }

  protected getStructure<T extends Structure>(): T | null {
    return Game.getObjectById(this.id) as T | null;
  }
}
