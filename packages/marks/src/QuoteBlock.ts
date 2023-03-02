import { Block } from "./Block";

export class QuoteBlock extends Block {
  isEndingBlock(line: string): [boolean, boolean] {
    return [!line.match(/^\s*> /)?.length, false];
  }
}
  
QuoteBlock.priotity            = 100;
QuoteBlock.isMultiLine         = () => true;
QuoteBlock.canProcess          = (line: string) => !!line.match(/^\s*> /)?.length;
QuoteBlock.createBlock         = () => new QuoteBlock();
QuoteBlock.getBlocksToRegister = () => [BlockQuoteContent];

class BlockQuoteContent extends Block {
  content: string = "";
  parse(line: string) {
    this.content += line.replace(/^\s*> /, ""); 
    return true;
  }
  canBeMerged(): boolean { return false; }
}

BlockQuoteContent.priotity            = 0;
BlockQuoteContent.isMultiLine         = () => false;
BlockQuoteContent.canProcess          = (line: string) => !!line.match(/^\s*> /)?.length;
BlockQuoteContent.createBlock         = () => new BlockQuoteContent();
BlockQuoteContent.getBlocksToRegister = () => [];