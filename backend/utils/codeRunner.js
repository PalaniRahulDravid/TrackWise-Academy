import axios from 'axios';

export async function runUserCode({ code, language, testCases }) {
  // Example: Piston API integration
  const results = [];
  for (const test of testCases) {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language,
      source: code,
      stdin: test.input
    });
    results.push({
      input: test.input,
      output: response.data.output,
      passed: response.data.output.trim() === test.output.trim()
    });
  }
  return results;
}
