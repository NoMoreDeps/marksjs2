import { Block } from "./Block";
import { RootBlock } from "./RootBlock";

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
    this.blocks.sort((b, a) => a.priotity - b.priotity); 
    // remove duplicates relying on the static field name id
    this.blocks = this.blocks.filter((b, i, a) => a.findIndex(b2 => b2.id === b.id) === i);
  }

  unregisterBlocks(blocks: (typeof Block)[]) {  
    this.blocks = this.blocks.filter(b => !blocks.includes(b));
  }

  setText(text: string) {
    this._text = text;
  }

  getCurrentType() {
    return this._parsingContextStack[this._parsingContextStack.length - 1].type;
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

  resetOriginalContextBlocks() {
    const originalContext = this._parsingContextStack[this._parsingContextStack.length - 1];

    if (originalContext.type === "RootBlock") {
      this._parsingContextStack[this._parsingContextStack.length - 1].contextBlocks = this.blocks.map(b => b);
    } else {
    this._parsingContextStack[this._parsingContextStack.length - 1].contextBlocks = this._parsingContextStack[this._parsingContextStack.length - 1]
      .blockType.getBlocksToRegister().map(b => b);
    }
  }

  parse() {
    const startTimestamp = Date.now();
    this._textLines   = this._text.split('\n');
    this._cursorIndex = 0;
    this._currentType = "RootBlock";

    // initialize parsing context stack
    // this context cannot be removed
    this._parsingContextStack = [{
      type          : this._currentType,
      blockType     : RootBlock,
      block         : new RootBlock(),
      startIndex    : this._cursorIndex,
      contextBlocks : this.blocks.map(b => b)
    }];

    while (this._cursorIndex < this._textLines.length) {
      const _blocks = this.getCurrentContextBlocks();

      // Check if the current block is ending, if so, we go back to the previous context
      // and add the current block to the previous context. 
      // If the block is ending, we consume the token if needed
      const [isEnding, consumeToken] = this.getContextBlock().isEndingBlock(this._textLines[this._cursorIndex]);

      if (isEnding) {
        if (this.getCurrentType() === "RootBlock") { // Root should never end except at the end of the document
          throw new Error("Unexpected end of document");
        }
        // if the block is ending, we go back to the previous context
        const context = this.popContext();
        this.getContextBlock().addNestedBlock(context.block);
        consumeToken && this._cursorIndex++; // We consume the token if needed
        this.resetOriginalContextBlocks();
        continue;
      }

      // If there is no block to parse, we go to the next line
      if (_blocks.length === 0) {
        if (this.getCurrentType() === "RootBlock") { // Root should never end except at the end of the document
          throw new Error("document cannot find a valid parser for the current line");
        }

        // we revert to the previous block
        //console.log("Error no block, reverting", this._currentType);
        const context = this.popContext();
        this.getCurrentContextBlocks().shift(); // we remove the current block from the context as it is not a valid parser
        this._cursorIndex = context.startIndex; // we go back to the start of the block
        continue;
      }

      const _block = _blocks[0];
      if (!_block.canProcess(this._textLines[this._cursorIndex])) {
        this.getCurrentContextBlocks().shift();
        continue;
      }
      if (_block.isMultiLine()) {
        this.pushContext(_block.id);
        continue;
      }
      //console.log(_block.id);
      const _blockInstance = _block.createBlock();
      const parsingResult = _blockInstance.parse(this._textLines[this._cursorIndex]);

      switch (parsingResult) {
        case true:
          this._cursorIndex++;
          this._parsingContextStack[this._parsingContextStack.length - 1].block.addNestedBlock(_blockInstance);
          this.resetOriginalContextBlocks();
          break;
        case false:
          this._cursorIndex = this.popContext().startIndex;
          //console.log("popping", _block.id);
          break;
      }
    }

    while (this._parsingContextStack.length > 1) {
      const context = this.popContext();
      this.getContextBlock().addNestedBlock(context.block);
    }

    console.log("Parsing took", Date.now() - startTimestamp, "ms");
    return this._parsingContextStack[this._parsingContextStack.length - 1].block;
  }

  pushContext(blockType: string) {
    const _blockType = this.blocks.find(b => b.id === blockType)!;
    this._currentType = blockType;
    this._parsingContextStack.push({
      type          : this._currentType,
      blockType     : _blockType, 
      block         : _blockType.createBlock(),
      startIndex    : this._cursorIndex,
      contextBlocks : _blockType.getBlocksToRegister()
    });
    //console.log("pushing", _blockType.id);
  }

  popContext() {
    if (this._parsingContextStack.length > 1) {
      return this._parsingContextStack.pop()!;
    } else {
      return this._parsingContextStack[0];
    }
  }


}