"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LineParser_1 = require("./LineParser");
const d = new LineParser_1.DocumentParser();
d.registerBlocks([LineParser_1.TextBlock]);
function safeExec(code) {
    return new Promise((resolve, reject) => {
        const workerCode = `
      const safeContext = new Function("${[
            "Worker",
            "WebSocket",
            "XMLHttpRequest",
            "eval",
            "fetch",
            "console",
            ...Object.keys(window)
        ].join(",")}",\`${code}\`);
      self.postMessage(safeContext());
    `;
        const blob = new Blob([workerCode], { type: "text/javascript" });
        const worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = function (event) {
            resolve(event.data);
        };
        worker.onerror = function (event) {
            reject(event);
        };
    });
}
