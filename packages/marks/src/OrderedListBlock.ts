import { Block } from "./Block";

export class OrderedListBlock extends Block {
  isEndingBlock(line: string) { 
    if (!line.match(/^\s*#\.\s/)?.length && !line.match(/^\s*\d+\.\s/)?.length) {
      return [true, true];
    }

    return [false, false];
   }
}

OrderedListBlock.priotity    = 100;
OrderedListBlock.createBlock = () => new OrderedListBlock();
OrderedListBlock.isMultiLine = () => true;
OrderedListBlock.canProcess  = (line: string) => {
  // format should be : 
  // * XXXX   <- start with * plus one space
  // 0. XXXX  <- start line with one digit plus one space
  return !!line.match(/^\s*#\.\s/)?.length || !!line.match(/^\s*\d+\.\s/)?.length;
}
OrderedListBlock.getBlocksToRegister = () => [OrderedListBlockBeginBlock];

class OrderedListBlockBeginBlock extends Block {
  parse(line: string): boolean {
    this.text = line;
    return true;
  }
  private _text: string = '';

  get text() { return this._text; }
  set text(value: string) { this._text = value; }

  canBeMerged(): boolean {
    return false;
  }

  isEndingBlock(line: string) { return [false, false]; }
}

OrderedListBlockBeginBlock.priotity    = 1;
OrderedListBlockBeginBlock.createBlock = () => new OrderedListBlockBeginBlock();
OrderedListBlockBeginBlock.isMultiLine = () => false;
OrderedListBlockBeginBlock.canProcess  = (line: string) => {
  return !!line.match(/^\s*#\.\s/)?.length || !!line.match(/^\s*\d+\.\s/)?.length;
}