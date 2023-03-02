import { Block } from "./Block";

export class RootBlock extends Block {}
RootBlock.priotity            = -1;
RootBlock.createBlock         = () => new RootBlock();
RootBlock.isMultiLine         = () => true;
RootBlock.canProcess          = (line: string) => true;
RootBlock.getBlocksToRegister = () => [];
