"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBlock = void 0;
const Block_1 = require("./Block");
class TextBlock extends Block_1.Block {
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
    canBeMerged() {
        return true;
    }
    merge(block) {
        this.text += "\n" + block.text;
    }
    isEndingBlock(line) { return [true, true]; }
}
exports.TextBlock = TextBlock;
TextBlock.priotity = 0;
TextBlock.createBlock = () => new TextBlock();
TextBlock.canProcess = (line) => true;
TextBlock.isMultiLine = () => false;
