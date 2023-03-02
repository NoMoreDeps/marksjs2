"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
class Block {
    constructor() {
        this._nestedBlocks = [];
    }
    static get id() { return this.name; }
    static canProcess(line) { return false; }
    static isMultiLine() { return false; }
    isEndingBlock(line) { return [false, false]; }
    getType() { return this.constructor.name; }
    parse(line) { return false; }
    canBeMerged() { return false; }
    merge(block) { }
    static getBlocksToRegister() { return []; }
    addNestedBlock(block) {
        var _a;
        if (block.getType() === ((_a = this._nestedBlocks[this._nestedBlocks.length - 1]) === null || _a === void 0 ? void 0 : _a.getType()) && block.canBeMerged()) {
            this._nestedBlocks[this._nestedBlocks.length - 1].merge(block);
            return;
        }
        this._nestedBlocks.push(block);
    }
    get nestedBlocks() { return this._nestedBlocks; }
    static createBlock() { return undefined; }
}
exports.Block = Block;
Block.priotity = 0;
