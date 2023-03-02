
export abstract class Block {
  protected _nestedBlocks: Block[] = []; // Array of nested blocks
  static priotity: number = 0;
  static get id() { return this.name; }
  static canProcess(line: string) { return false; }
  static isMultiLine() { return false; }
  isEndingBlock(line: string) { return [false, false]; }
  getType() { return this.constructor.name; }
  parse(line: string): boolean { return false;}
  canBeMerged(): boolean { return false;}
  merge(block: this): void {}

  static getBlocksToRegister(): typeof Block[] { return []; } // used to register blocks when isMultiLine is true
  addNestedBlock(block: Block) {
    if (block.getType() === this._nestedBlocks[this._nestedBlocks.length - 1]?.getType() && block.canBeMerged()) {
      this._nestedBlocks[this._nestedBlocks.length - 1].merge(block as this);
      return;
    }
    this._nestedBlocks.push(block);
  }
  get nestedBlocks() { return this._nestedBlocks; }

  static createBlock() { return undefined as unknown as Block; }
}
