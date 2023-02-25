abstract class Block {
  protected  _nestedBlocks: Block[] = []; // Array of nested blocks
  static priotity: number = 0;
  static get id() { return this.name; }
  static canProcess(line: string) { return false; }
  static isMultiLine() { return false; }
  isEndingBlock(line: string) { return [false, false]; }
  
  abstract parse(line: string): boolean | null;

  static getBlocksToRegister(): typeof Block[] { return [TextBlock]; } // used to register blocks when isMultiLine is true
  addNestedBlock(block: Block) { 
    this._nestedBlocks.push(block);
  }
  get nestedBlocks() { return this._nestedBlocks; }
  
  static createBlock() { return undefined as unknown as Block; }
}

export class TextBlock extends Block {

  parse(line: string): boolean {
    this.text = line;
    return true;
  }
  private _text: string = '';

  get text() { return this._text; }
  set text(value: string) { this._text = value; }

  isEndingBlock(line: string) { return [true, true]; }
}

TextBlock.priotity    = 0;
TextBlock.createBlock = () => new TextBlock();
TextBlock.canProcess  = (line: string) => true;
TextBlock.isMultiLine = () => false;

export class RootBlock extends Block {
  parse(line: string): boolean {
    return true;
  }
}

/**
 * Parsing context stack
 * Used to keep track of the current parsing context
 * and to be able to go back to the previous context
 * when a block is closed
 */
type TParsingContextStack = {
  type          : string;          // type of the block
  blockType     : typeof Block;    // Base class to use to get instance
  block         : Block;           // instance of the block
  startIndex    : number;          // index of the first line 
  contextBlocks : typeof Block[];  // Array of blocks to use for nested parsing
}

/**
 * Document parser
 */
export class DocumentParser {
  protected blocks               : (typeof Block)[]       = [];      // Array of blocks to use
  protected _text                : string                 = '';      // Raw text to parse
  protected _textLines           : string[]               = [];      // Text to parse in lines
  protected _cursorIndex         : number                 = 0;       // Current cursor index
  protected _currentType         : string                 = "ROOT";  // default Type
  protected _parsingContextStack : TParsingContextStack[] = [];      // Stack of parsing context

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

  getCompatibleBlocks() { 
    return this.blocks.filter(b => b.canProcess(this._textLines[this._cursorIndex]));
  }

  getCurrentContextBlocks() {
    return this._parsingContextStack[this._parsingContextStack.length - 1].contextBlocks;
  }

  getContextBlock() {
    return this._parsingContextStack[this._parsingContextStack.length - 1].block;
  }

  getOriginalContextBlocks() {
    this._parsingContextStack[this._parsingContextStack.length - 1].contextBlocks = this._parsingContextStack[this._parsingContextStack.length - 1]
      .blockType.getBlocksToRegister();
  }

  parse() {
    this._textLines = this._text.split('\n');
    this._cursorIndex = 0;
    this._currentType = "RootBlock";

    // initialize parsing context stack
    // this context cannot be removed
    this._parsingContextStack = [{
      type          : this._currentType,
      blockType     : RootBlock,
      block         : new RootBlock(),
      startIndex    : this._cursorIndex,
      contextBlocks : this.blocks
    }];

    while (this._cursorIndex < this._textLines.length) {
      const _blocks = this.getCurrentContextBlocks();

      // Check if the current block is ending, if so, we go back to the previous context
      // and add the current block to the previous context. 
      // If the block is ending, we consume the token if needed
      const [isEnding, consumeToken] = this.getContextBlock().isEndingBlock(this._textLines[this._cursorIndex]);

      if (isEnding) {
        if (this._currentType === "ROOT") { // Root should never end except at the end of the document
          throw new Error("Unexpected end of document");
        }
        // if the block is ending, we go back to the previous context
        const context = this.popContext();
        this.getContextBlock().addNestedBlock(context.block);
        consumeToken && this._cursorIndex++; // We consume the token if needed
        continue;
      }

      // If there is no block to parse, we go to the next line
      if (_blocks.length === 0) {
        if (this._currentType === "ROOT") { // Root should never end except at the end of the document
          throw new Error("document cannot find a valid parser for the current line");
        }

        // we revert to the previous block
        const context = this.popContext();
        this.getCurrentContextBlocks().pop(); // we remove the current block from the context as it is not a valid parser
        this._cursorIndex = context.startIndex; // we go back to the start of the block
        continue;
      }

      const _block = _blocks[0];
      if (_block.isMultiLine()) {
        this.pushContext(_block.id);
        continue;
      }
      const _blockInstance = _block.createBlock();
      const parsingResult = _blockInstance.parse(this._textLines[this._cursorIndex]);

      switch (parsingResult) {
        case true:
          this._cursorIndex++;
          this._parsingContextStack[this._parsingContextStack.length - 1].block.addNestedBlock(_blockInstance);
          break;
        case false:
          this._cursorIndex = this.popContext().startIndex;
          break;
      }


    }
  }

  pushContext(blockType: string) {
    const _blockType = this.blocks.find(b => b.id === blockType)!;
    this._parsingContextStack.push({
      type          : this._currentType,
      blockType     : _blockType,
      block         : _blockType.createBlock(),
      startIndex    : this._cursorIndex,
      contextBlocks : _blockType.getBlocksToRegister()
    });
    this._currentType = blockType;
  }

  popContext() {
    let context = this._parsingContextStack.pop()!;
    if (this._parsingContextStack.length === 0) {
      this._currentType = "ROOT";
    } else {
      this._currentType = this._parsingContextStack[this._parsingContextStack.length - 1].type;
    }
    return context;
  }


}