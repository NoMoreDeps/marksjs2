"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentParser = void 0;
const RootBlock_1 = require("./RootBlock");
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
        this.blocks.sort((b, a) => a.priotity - b.priotity);
        this.blocks = this.blocks.filter((b, i, a) => a.findIndex(b2 => b2.id === b.id) === i);
    }
    unregisterBlocks(blocks) {
        this.blocks = this.blocks.filter(b => !blocks.includes(b));
    }
    setText(text) {
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
        }
        else {
            this._parsingContextStack[this._parsingContextStack.length - 1].contextBlocks = this._parsingContextStack[this._parsingContextStack.length - 1]
                .blockType.getBlocksToRegister().map(b => b);
        }
    }
    parse() {
        const startTimestamp = Date.now();
        this._textLines = this._text.split('\n');
        this._cursorIndex = 0;
        this._currentType = "RootBlock";
        this._parsingContextStack = [{
                type: this._currentType,
                blockType: RootBlock_1.RootBlock,
                block: new RootBlock_1.RootBlock(),
                startIndex: this._cursorIndex,
                contextBlocks: this.blocks.map(b => b)
            }];
        while (this._cursorIndex < this._textLines.length) {
            const _blocks = this.getCurrentContextBlocks();
            const [isEnding, consumeToken] = this.getContextBlock().isEndingBlock(this._textLines[this._cursorIndex]);
            if (isEnding) {
                if (this.getCurrentType() === "RootBlock") {
                    throw new Error("Unexpected end of document");
                }
                const context = this.popContext();
                this.getContextBlock().addNestedBlock(context.block);
                consumeToken && this._cursorIndex++;
                this.resetOriginalContextBlocks();
                continue;
            }
            if (_blocks.length === 0) {
                if (this.getCurrentType() === "RootBlock") {
                    throw new Error("document cannot find a valid parser for the current line");
                }
                const context = this.popContext();
                this.getCurrentContextBlocks().shift();
                this._cursorIndex = context.startIndex;
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
    pushContext(blockType) {
        const _blockType = this.blocks.find(b => b.id === blockType);
        this._currentType = blockType;
        this._parsingContextStack.push({
            type: this._currentType,
            blockType: _blockType,
            block: _blockType.createBlock(),
            startIndex: this._cursorIndex,
            contextBlocks: _blockType.getBlocksToRegister()
        });
    }
    popContext() {
        if (this._parsingContextStack.length > 1) {
            return this._parsingContextStack.pop();
        }
        else {
            return this._parsingContextStack[0];
        }
    }
}
exports.DocumentParser = DocumentParser;
