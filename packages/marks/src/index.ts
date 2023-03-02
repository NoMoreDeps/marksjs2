import { DocumentParser } from "./LineParser";
import { TextBlock } from "./TextBlock";
import { RootBlock } from "./RootBlock";
import { MarksBlock } from "./MarksBlock";
import { QuoteBlock } from "./QuoteBlock";
import { OrderedListBlock } from "./OrderedListBlock";
import { TableBlock } from "./TableBlock";
import { UnorderedListBlock } from "./UnorderedListBlock";
import { HtmlBlock } from "./HtmlBlock";

const doc = `
[marks]{{ ::- alias:558744; class:ssj; test=oojkkj; ::- class=ssj; test=oojkkj;

}}
 
hello la terre  
helle *italic* la terre
 
> hello
> hello  

[hello](http://hello.com) 
![hello](http://hello.com)
  
| hello | hello |
| ----- | ----- |
| hello | hello |

 
* 22
  * 33
* 44
#. 55
#. 66
#. 7

<span style="color:red">  
  This is an Html piece of code  
</span>

[html]{{
<span style="color:red">  
  This is an Html piece of code  
</span>
}}

1. sfds	


[marks]{{
  ::- alias:558744; class:ssj; test=oojkkj;
  ::- class=ssj; test=oojkkj; 
}}  
8 
56

,,
8--


| hello | hello |
| ----- | ----- |
| hello | @@256@@ |

`;

const parser = new DocumentParser();
parser.registerBlocks([
  RootBlock, 
  TextBlock, 
  MarksBlock, 
  QuoteBlock, 
  OrderedListBlock, 
  UnorderedListBlock, 
  TableBlock ,
  HtmlBlock
]);

parser.setText(doc); 
let root = parser.parse();

console.dir(root, { depth: 5 });