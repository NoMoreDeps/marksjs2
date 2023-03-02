import { Block } from "./Block";

export class TableBlock extends Block {
  isEndingBlock(line: string): [boolean, boolean] {
    // The test should care to have 2 | with at least one character or space between them like .+
    const matchPattern = /^\s*\|.+\|/;
    return [!line.match(matchPattern)?.length, false];
  }
}

TableBlock.priotity            = 100;
TableBlock.isMultiLine         = () => true;
TableBlock.canProcess          = (line: string) => !!line.match(/^\s*\|.+\|/)?.length;
TableBlock.createBlock         = () => new TableBlock();
TableBlock.getBlocksToRegister = () => [TableBlockContent];

class TableBlockContent extends Block {
  content: string = "";
  parse(line: string) {
    this.content += line; 
    return true;
  }
  canBeMerged(): boolean { return false; }
}

TableBlockContent.priotity            = 0;
TableBlockContent.isMultiLine         = () => false;
TableBlockContent.canProcess          = (line: string) => !!line.match(/^\s*\|.+\|/)?.length;
TableBlockContent.createBlock         = () => new TableBlockContent();
TableBlockContent.getBlocksToRegister = () => [];
