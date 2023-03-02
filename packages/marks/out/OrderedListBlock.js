"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedListBlock = void 0;
const Block_1 = require("./Block");
class OrderedListBlock extends Block_1.Block {
    isEndingBlock(line) {
        var _a, _b;
        if (!((_a = line.match(/^\s*#\.\s/)) === null || _a === void 0 ? void 0 : _a.length) && !((_b = line.match(/^\s*\d+\.\s/)) === null || _b === void 0 ? void 0 : _b.length)) {
            return [true, true];
        }
        return [false, false];
    }
}
exports.OrderedListBlock = OrderedListBlock;
OrderedListBlock.priotity = 100;
OrderedListBlock.createBlock = () => new OrderedListBlock();
OrderedListBlock.isMultiLine = () => true;
OrderedListBlock.canProcess = (line) => {
    var _a, _b;
    return !!((_a = line.match(/^\s*#\.\s/)) === null || _a === void 0 ? void 0 : _a.length) || !!((_b = line.match(/^\s*\d+\.\s/)) === null || _b === void 0 ? void 0 : _b.length);
};
OrderedListBlock.getBlocksToRegister = () => [OrderedListBlockBeginBlock];
class OrderedListBlockBeginBlock extends Block_1.Block {
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
OrderedListBlockBeginBlock.priotity = 1;
OrderedListBlockBeginBlock.createBlock = () => new OrderedListBlockBeginBlock();
OrderedListBlockBeginBlock.isMultiLine = () => false;
OrderedListBlockBeginBlock.canProcess = (line) => {
    var _a, _b;
    return !!((_a = line.match(/^\s*#\.\s/)) === null || _a === void 0 ? void 0 : _a.length) || !!((_b = line.match(/^\s*\d+\.\s/)) === null || _b === void 0 ? void 0 : _b.length);
};
