"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableBlock = void 0;
const Block_1 = require("./Block");
class TableBlock extends Block_1.Block {
    isEndingBlock(line) {
        var _a;
        const matchPattern = /^\s*\|.+\|/;
        return [!((_a = line.match(matchPattern)) === null || _a === void 0 ? void 0 : _a.length), false];
    }
}
exports.TableBlock = TableBlock;
TableBlock.priotity = 100;
TableBlock.isMultiLine = () => true;
TableBlock.canProcess = (line) => { var _a; return !!((_a = line.match(/^\s*\|.+\|/)) === null || _a === void 0 ? void 0 : _a.length); };
TableBlock.createBlock = () => new TableBlock();
TableBlock.getBlocksToRegister = () => [TableBlockContent];
class TableBlockContent extends Block_1.Block {
    constructor() {
        super(...arguments);
        this.content = "";
    }
    parse(line) {
        this.content += line;
        return true;
    }
    canBeMerged() { return false; }
}
TableBlockContent.priotity = 0;
TableBlockContent.isMultiLine = () => false;
TableBlockContent.canProcess = (line) => { var _a; return !!((_a = line.match(/^\s*\|.+\|/)) === null || _a === void 0 ? void 0 : _a.length); };
TableBlockContent.createBlock = () => new TableBlockContent();
TableBlockContent.getBlocksToRegister = () => [];
