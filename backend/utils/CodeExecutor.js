const { VM } = require('vm2');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class CodeExecutor {
  static async executeJavaScript(code, testCases) {
    const vm = new VM({
      timeout: 3000,
      sandbox: {
        console: {
          log: () => {} // Suppress console.log
        }
      }
    });

    try {
      // Wrap code in function if not already wrapped
      const wrappedCode = code.includes('function') ? code : `function solution() {${code}}`;
      vm.run(wrappedCode);
      
      const results = testCases.map(test => {
        const start = process.hrtime();
        const output = vm.run(`solution(${test.input})`);
        const [seconds, nanoseconds] = process.hrtime(start);
        const runtime = seconds * 1000 + nanoseconds / 1000000;

        return {
          passed: output.toString() === test.output.toString(),
          runtime,
          memory: process.memoryUsage().heapUsed / 1024 / 1024,
          input: test.input,
          expectedOutput: test.output,
          actualOutput: output
        };
      });

      return results;
    } catch (error) {
      throw new Error(`Execution Error: ${error.message}`);
    }
  }

  static async executePython(code, testCases) {
    // Implementation for Python execution using child_process
  }

  static async executeJava(code, testCases) {
    // Implementation for Java execution using child_process
  }
}

module.exports = CodeExecutor;