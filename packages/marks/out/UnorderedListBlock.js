"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnorderedListBlock = void 0;
const Block_1 = require("./Block");
class UnorderedListBlock extends Block_1.Block {
    isEndingBlock(line) {
        var _a;
        if (!((_a = line.match(/^\s*\*\s/)) === null || _a === void 0 ? void 0 : _a.length)) {
            return [true, true];
        }
        return [false, false];
    }
}
exports.UnorderedListBlock = UnorderedListBlock;
UnorderedListBlock.priotity = 100;
UnorderedListBlock.createBlock = () => new UnorderedListBlock();
UnorderedListBlock.isMultiLine = () => true;
UnorderedListBlock.canProcess = (line) => {
    var _a;
    return !!((_a = line.match(/^\s*\*\s/)) === null || _a === void 0 ? void 0 : _a.length);
};
UnorderedListBlock.getBlocksToRegister = () => [UnorderedListBlockBeginBlock];
class UnorderedListBlockBeginBlock extends Block_1.Block {
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
UnorderedListBlockBeginBlock.priotity = 1;
UnorderedListBlockBeginBlock.createBlock = () => new UnorderedListBlockBeginBlock();
UnorderedListBlockBeginBlock.isMultiLine = () => false;
UnorderedListBlockBeginBlock.canProcess = (line) => {
    var _a;
    return !!((_a = line.match(/^\s*\*\s/)) === null || _a === void 0 ? void 0 : _a.length);
};
