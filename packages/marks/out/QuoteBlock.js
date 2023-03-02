"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteBlock = void 0;
const Block_1 = require("./Block");
class QuoteBlock extends Block_1.Block {
    isEndingBlock(line) {
        var _a;
        return [!((_a = line.match(/^\s*> /)) === null || _a === void 0 ? void 0 : _a.length), false];
    }
}
exports.QuoteBlock = QuoteBlock;
QuoteBlock.priotity = 100;
QuoteBlock.isMultiLine = () => true;
QuoteBlock.canProcess = (line) => { var _a; return !!((_a = line.match(/^\s*> /)) === null || _a === void 0 ? void 0 : _a.length); };
QuoteBlock.createBlock = () => new QuoteBlock();
QuoteBlock.getBlocksToRegister = () => [BlockQuoteContent];
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
