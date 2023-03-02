import { Block } from "./Block";
import { TextBlock } from "./TextBlock";



export class MarksBlock extends Block {
  isEndingBlock(line: string) { 
    if (line.match(/^\s*\}\}\s*/)?.length) {
      return [true, true];
    } 

    return [false, false];
   }
}
MarksBlock.priotity = 100;
MarksBlock.createBlock = () => new MarksBlock();
MarksBlock.isMultiLine = () => true;
MarksBlock.canProcess = (line: string) => {
  return !!line.match(/^\[\s*marks\s*\]\s*\{\{/)?.length;
};
MarksBlock.getBlocksToRegister = () => [MarksBlockBeginBlock, TextBlock];


class MarksBlockBeginBlock extends Block {
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

MarksBlockBeginBlock.priotity = 1;
MarksBlockBeginBlock.createBlock = () => new MarksBlockBeginBlock();
MarksBlockBeginBlock.isMultiLine = () => false;
MarksBlockBeginBlock.canProcess = (line: string) => {
  return !!line.match(/\[\s*marks\s*\]\s*\{\{/)?.length;
};
