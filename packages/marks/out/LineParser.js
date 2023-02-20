"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentParser = exports.TextBlock = void 0;
class Block {
    static get id() { return this.name; }
}
Block.priotity = 0;
class TextBlock extends Block {
    constructor() {
        super(...arguments);
        this._text = '';
    }
    parse(doc) {
        throw new Error("Method not implemented.");
    }
    get text() { return this._text; }
    set text(value) { this._text = value; }
}
exports.TextBlock = TextBlock;
class DocumentParser {
    constructor() {
        this.blocks = [];
        this._text = '';
        this._textLines = [];
        this._cursorIndex = 0;
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
    getFirstBlock() {
        return this.blocks[0];
    }
    parse() {
        this._textLines = this._text.split('\n');
        this._cursorIndex = 0;
    }
}
exports.DocumentParser = DocumentParser;
