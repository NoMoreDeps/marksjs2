"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentParser = exports.RootBlock = exports.TextBlock = void 0;
class Block {
    constructor() {
        this._nestedBlocks = [];
    }
    static get id() { return this.name; }
    static canProcess(line) { return false; }
    static isMultiLine() { return false; }
    isEndingBlock(line) { return [false, false]; }
    static getBlocksToRegister() { return [TextBlock]; }
    addNestedBlock(block) {
        this._nestedBlocks.push(block);
    }
    get nestedBlocks() { return this._nestedBlocks; }
    static createBlock() { return undefined; }
}
Block.priotity = 0;
class TextBlock extends Block {
    constructor() {
        super(...arguments);
        this._text = '';
    }
    parse(line) {
        this.text = line;
        return true;
    }
    get text() { return this._text; }
    set text(value) { this._text = value; }
    isEndingBlock(line) { return [true, true]; }
}
exports.TextBlock = TextBlock;
TextBlock.priotity = 0;
TextBlock.createBlock = () => new TextBlock();
TextBlock.canProcess = (line) => true;
TextBlock.isMultiLine = () => false;
class RootBlock extends Block {
    parse(line) {
        return true;
    }
}
exports.RootBlock = RootBlock;
class DocumentParser {
    constructor() {
        this.blocks = [];
        this._text = '';
        this._textLines = [];
        this._cursorIndex = 0;
        this._currentType = "ROOT";
        this._parsingContextStack = [];
    }
    registerBlocks(blocks) {
        this.blocks = this.blocks.concat(blocks);
        this.blocks.sort((a, b) => a.priotity - b.priotity);
        this.blocks = this.blocks.filter((b, i, a) => a.findIndex(b2 => b2.id === b.id) === i);
    }
    unregisterBlocks(blocks) {
        this.blocks = this.blocks.filter(b => !blocks.includes(b));
    }
    setText(text) {
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
        this._parsingContextStack = [{
                type: this._currentType,
                blockType: RootBlock,
                block: new RootBlock(),
                startIndex: this._cursorIndex,
                contextBlocks: this.blocks
            }];
        while (this._cursorIndex < this._textLines.length) {
            const _blocks = this.getCurrentContextBlocks();
            const [isEnding, consumeToken] = this.getContextBlock().isEndingBlock(this._textLines[this._cursorIndex]);
            if (isEnding) {
                if (this._currentType === "ROOT") {
                    throw new Error("Unexpected end of document");
                }
                const context = this.popContext();
                this.getContextBlock().addNestedBlock(context.block);
                consumeToken && this._cursorIndex++;
                continue;
            }
            if (_blocks.length === 0) {
                if (this._currentType === "ROOT") {
                    throw new Error("document cannot find a valid parser for the current line");
                }
                const context = this.popContext();
                this.getCurrentContextBlocks().pop();
                this._cursorIndex = context.startIndex;
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
    pushContext(blockType) {
        const _blockType = this.blocks.find(b => b.id === blockType);
        this._parsingContextStack.push({
            type: this._currentType,
            blockType: _blockType,
            block: _blockType.createBlock(),
            startIndex: this._cursorIndex,
            contextBlocks: _blockType.getBlocksToRegister()
        });
        this._currentType = blockType;
    }
    popContext() {
        let context = this._parsingContextStack.pop();
        if (this._parsingContextStack.length === 0) {
            this._currentType = "ROOT";
        }
        else {
            this._currentType = this._parsingContextStack[this._parsingContextStack.length - 1].type;
        }
        return context;
    }
}
exports.DocumentParser = DocumentParser;
