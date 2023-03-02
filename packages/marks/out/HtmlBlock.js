"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlBlock = void 0;
const Block_1 = require("./Block");
const TextBlock_1 = require("./TextBlock");
class HtmlBlock extends Block_1.Block {
    isEndingBlock(line) {
        var _a;
        if ((_a = line.match(/^\s*\}\}\s*/)) === null || _a === void 0 ? void 0 : _a.length) {
            return [true, true];
        }
        return [false, false];
    }
}
exports.HtmlBlock = HtmlBlock;
HtmlBlock.priotity = 100;
HtmlBlock.createBlock = () => new HtmlBlock();
HtmlBlock.isMultiLine = () => true;
HtmlBlock.canProcess = (line) => {
    var _a;
    return !!((_a = line.match(/^\[\s*html\s*\]\s*\{\{/)) === null || _a === void 0 ? void 0 : _a.length);
};
HtmlBlock.getBlocksToRegister = () => [HtmlBlockBeginBlock, TextBlock_1.TextBlock];
class HtmlBlockBeginBlock extends Block_1.Block {
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
HtmlBlockBeginBlock.priotity = 1;
HtmlBlockBeginBlock.createBlock = () => new HtmlBlockBeginBlock();
HtmlBlockBeginBlock.isMultiLine = () => false;
HtmlBlockBeginBlock.canProcess = (line) => {
    var _a;
    return !!((_a = line.match(/\[\s*html\s*\]\s*\{\{/)) === null || _a === void 0 ? void 0 : _a.length);
};
