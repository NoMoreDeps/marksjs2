"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockQuote = void 0;
const Block_1 = require("./Block");
class BlockQuote extends Block_1.Block {
    parse(line) { return null; }
    canBeMerged() { return false; }
    isEndingBlock(line) {
        var _a;
        return [!((_a = line.match(/^\s*> /)) === null || _a === void 0 ? void 0 : _a.length), false];
    }
}
exports.BlockQuote = BlockQuote;
BlockQuote.priotity = 100;
BlockQuote.isMultiLine = () => true;
BlockQuote.canProcess = (line) => { var _a; return !!((_a = line.match(/^\s*> /)) === null || _a === void 0 ? void 0 : _a.length); };
BlockQuote.createBlock = () => new BlockQuote();
BlockQuote.getBlocksToRegister = () => [BlockQuoteContent];
class BlockQuoteContent extends Block_1.Block {
    constructor() {
        super(...arguments);
        this.content = "";
    }
    parse(line) {
        this.content += line.replace(/^\s*> /, "");
        return true;
    }
    canBeMerged() { return false; }
}
BlockQuoteContent.priotity = 0;
BlockQuoteContent.isMultiLine = () => false;
BlockQuoteContent.canProcess = (line) => { var _a; return !!((_a = line.match(/^\s*> /)) === null || _a === void 0 ? void 0 : _a.length); };
BlockQuoteContent.createBlock = () => new BlockQuoteContent();
BlockQuoteContent.getBlocksToRegister = () => [];
