import { Block } from "./Block";
import { TextBlock } from "./TextBlock";



export class HtmlBlock extends Block {
  isEndingBlock(line: string) { 
    if (line.match(/^\s*\}\}\s*/)?.length) {
      return [true, true];
    } 

    return [false, false];
   }
}
HtmlBlock.priotity = 100;
HtmlBlock.createBlock = () => new HtmlBlock();
HtmlBlock.isMultiLine = () => true;
HtmlBlock.canProcess = (line: string) => {
  return !!line.match(/^\[\s*html\s*\]\s*\{\{/)?.length;
};
HtmlBlock.getBlocksToRegister = () => [HtmlBlockBeginBlock, TextBlock];


class HtmlBlockBeginBlock extends Block {
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

HtmlBlockBeginBlock.priotity = 1;
HtmlBlockBeginBlock.createBlock = () => new HtmlBlockBeginBlock();
HtmlBlockBeginBlock.isMultiLine = () => false;
HtmlBlockBeginBlock.canProcess = (line: string) => {
  return !!line.match(/\[\s*html\s*\]\s*\{\{/)?.length;
};
