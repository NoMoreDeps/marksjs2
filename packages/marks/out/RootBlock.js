"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootBlock = void 0;
const Block_1 = require("./Block");
class RootBlock extends Block_1.Block {
}
exports.RootBlock = RootBlock;
RootBlock.priotity = -1;
RootBlock.createBlock = () => new RootBlock();
RootBlock.isMultiLine = () => true;
RootBlock.canProcess = (line) => true;
RootBlock.getBlocksToRegister = () => [];
