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

  public abstract run(): void;

  public getId(): Id<Structure> {
    return this.id;
  }

  public getPos(): RoomPosition {
    return this.pos;
  }

  public getRoom(): Room {
    return this.room;
  }

  protected isActive(): boolean {
    return true;
  }

  protected getStructure<T extends Structure>(): T | null {
    return Game.getObjectById(this.id) as T | null;
  }
}
