abstract class Block {
  static priotity: number = 0;

  static get id() { return this.name; }

  abstract parse(doc: DocumentParser): boolean;

}

export class TextBlock extends Block {

  parse(doc: DocumentParser): boolean {
    throw new Error("Method not implemented.");
  }
  private _text: string = '';

  get text() { return this._text; }
  set text(value: string) { this._text = value; }
}

export class DocumentParser {
  protected blocks       : (typeof Block)[] = [];  // Array of blocks to use
  protected _text        : string           = '';  // Raw text to parse
  protected _textLines   : string[]         = [];  // Text to parse in lines
  protected _cursorIndex : number           = 0;   // Current cursor index

  /**
   * Register blocks to be used by the parser
   * @param blocks Array of blocks to register
   */
  registerBlocks(blocks: (typeof Block)[]) {
    this.blocks = this.blocks.concat(blocks);
    this.blocks.sort((a, b) => a.priotity - b.priotity);
    // remove duplicates relying on the static field name id
    this.blocks = this.blocks.filter((b, i, a) => a.findIndex(b2 => b2.id === b.id) === i);
  }

  unregisterBlocks(blocks: (typeof Block)[]) {
    this.blocks = this.blocks.filter(b => !blocks.includes(b));
  }

  setText(text: string) {
    this._text = text;
  }

  getFirstBlock(): Block {
    return this.blocks[0];
  }

  parse() {
    this._textLines = this._text.split('\n');
    this._cursorIndex = 0;
  }
}