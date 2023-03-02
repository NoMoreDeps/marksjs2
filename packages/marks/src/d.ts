import { DocumentParser } from "./LineParser";
import { TextBlock } from "./TextBlock";

const d = new DocumentParser();
d.registerBlocks([TextBlock]);
function safeExec(code: string) {
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
