"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarksBlock = void 0;
const Block_1 = require("./Block");
const TextBlock_1 = require("./TextBlock");
class MarksBlock extends Block_1.Block {
    isEndingBlock(line) {
        var _a;
        if ((_a = line.match(/^\s*\}\}\s*/)) === null || _a === void 0 ? void 0 : _a.length) {
            return [true, true];
        }
        return [false, false];
    }
}
exports.MarksBlock = MarksBlock;
MarksBlock.priotity = 100;
MarksBlock.createBlock = () => new MarksBlock();
MarksBlock.isMultiLine = () => true;
MarksBlock.canProcess = (line) => {
    var _a;
    return !!((_a = line.match(/^\[\s*marks\s*\]\s*\{\{/)) === null || _a === void 0 ? void 0 : _a.length);
};
MarksBlock.getBlocksToRegister = () => [MarksBlockBeginBlock, TextBlock_1.TextBlock];
class MarksBlockBeginBlock extends Block_1.Block {
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
        return false;
    }
    isEndingBlock(line) { return [false, false]; }
}
MarksBlockBeginBlock.priotity = 1;
MarksBlockBeginBlock.createBlock = () => new MarksBlockBeginBlock();
MarksBlockBeginBlock.isMultiLine = () => false;
MarksBlockBeginBlock.canProcess = (line) => {
    var _a;
    return !!((_a = line.match(/\[\s*marks\s*\]\s*\{\{/)) === null || _a === void 0 ? void 0 : _a.length);
};
