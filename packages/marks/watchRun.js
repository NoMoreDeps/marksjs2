const fs = require('fs');
const { spawn } = require('child_process');

let childProcess = null;
let executionNumber = 0;

fs.watch('./index.js', {recursive: true}, (eventType, filename) => {
  if (eventType === 'change') {
    if (childProcess !== null) {
      console.log('Killing previous child process');
      childProcess.kill();
      console.clear();
    }
    console.clear();
    childProcess = spawn('node', ['./index.js'], {
      stdio: 'inherit',
    });
    childProcess.on('close', (code) => {
      console.log(`Ended at ${new Date().toLocaleTimeString()}, Execution number: ${++executionNumber}`);
    });
  }
});

console.log('Monitoring for changes');
