"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LineParser_1 = require("./LineParser");
const TextBlock_1 = require("./TextBlock");
const RootBlock_1 = require("./RootBlock");
const MarksBlock_1 = require("./MarksBlock");
const QuoteBlock_1 = require("./QuoteBlock");
const OrderedListBlock_1 = require("./OrderedListBlock");
const TableBlock_1 = require("./TableBlock");
const UnorderedListBlock_1 = require("./UnorderedListBlock");
const HtmlBlock_1 = require("./HtmlBlock");
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
#. 77

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
const parser = new LineParser_1.DocumentParser();
parser.registerBlocks([
    RootBlock_1.RootBlock,
    TextBlock_1.TextBlock,
    MarksBlock_1.MarksBlock,
    QuoteBlock_1.QuoteBlock,
    OrderedListBlock_1.OrderedListBlock,
    UnorderedListBlock_1.UnorderedListBlock,
    TableBlock_1.TableBlock,
    HtmlBlock_1.HtmlBlock
]);
parser.setText(doc);
let root = parser.parse();
console.dir(root, { depth: 5 });
