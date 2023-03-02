import { Block } from "./Block";

export class UnorderedListBlock extends Block {
  isEndingBlock(line: string) { 
    if (!line.match(/^\s*\*\s/)?.length) {
      return [true, true];
    }

    return [false, false];
   }
}

UnorderedListBlock.priotity    = 100;
UnorderedListBlock.createBlock = () => new UnorderedListBlock();
UnorderedListBlock.isMultiLine = () => true;
UnorderedListBlock.canProcess  = (line: string) => {
  // format should be : 
  // * XXXX   <- start with * plus one space
  // 0. XXXX  <- start line with one digit plus one space
  return !!line.match(/^\s*\*\s/)?.length;
}
UnorderedListBlock.getBlocksToRegister = () => [UnorderedListBlockBeginBlock];

class UnorderedListBlockBeginBlock extends Block {
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

UnorderedListBlockBeginBlock.priotity    = 1;
UnorderedListBlockBeginBlock.createBlock = () => new UnorderedListBlockBeginBlock();
UnorderedListBlockBeginBlock.isMultiLine = () => false;
UnorderedListBlockBeginBlock.canProcess  = (line: string) => {
  return !!line.match(/^\s*\*\s/)?.length;
}