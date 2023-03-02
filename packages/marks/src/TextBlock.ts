import { Block } from "./Block";


export class TextBlock extends Block {

  parse(line: string): boolean {
    this.text = line;
    return true;
  }
  private _text: string = '';

  get text() { return this._text; }
  set text(value: string) { this._text = value; }

  canBeMerged(): boolean {
    return true;
  }

  merge(block: TextBlock): void {
    this.text += "\n" + block.text;
  }

  isEndingBlock(line: string) { return [true, true]; }
}
TextBlock.priotity    = 0;
TextBlock.createBlock = () => new TextBlock();
TextBlock.canProcess  = (line: string) => true;
TextBlock.isMultiLine = () => false;
