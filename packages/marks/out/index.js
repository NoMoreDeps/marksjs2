"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LineParser_1 = require("./LineParser");
const doc = `
hello la terre
helle *italic* la terre

> hello
> hello

* hello
* hello

1. hello
2. hello

# hello
## hello

[hello](http://hello.com)

![hello](http://hello.com)

| hello | hello |
| ----- | ----- |
| hello | hello |

\`\`\`js

const hello = 'hello';

\`\`\`

\`\`\`js

const hello = 'hello';

\`\`\`


[marks]{{
  ::- alias:558744; class:ssj; test=oojkkj;
  ::- class=ssj; test=oojkkj;
}}

`;
const d = new LineParser_1.DocumentParser();
d.registerBlocks([LineParser_1.TextBlock]);
