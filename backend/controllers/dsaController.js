const DsaProblem = require('../models/DsaProblem');
const Submission = require('../models/Submission');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Execute Python code in a subprocess
async function executePython(code, testCase) {
  return new Promise(async (resolve) => {
    const startTime = Date.now();
    
    try {
      // Parse input and expected output
      const input = JSON.parse(testCase.input);
      const expectedOutput = JSON.parse(testCase.output);
      
      // Create temporary Python file
      const tempDir = path.join(__dirname, '../temp');
      await fs.mkdir(tempDir, { recursive: true });
      
      const tempFile = path.join(tempDir, `code_${uuidv4()}.py`);
      
      // Wrap user code with input/output handling
      const wrappedCode = `
import json
import sys

${code}

# Parse input from command line
input_data = json.loads(sys.argv[1])

# Execute solution
try:
    result = solution(input_data)
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
`;
      
      await fs.writeFile(tempFile, wrappedCode);
      
      // Execute Python script
      const python = spawn('python', [tempFile, JSON.stringify(input)], {
        timeout: 5000, // 5 second timeout
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      python.on('close', async (code) => {
        const runtime = Date.now() - startTime;
        
        // Clean up temp file
        try {
          await fs.unlink(tempFile);
        } catch {}
        
        if (code !== 0 || stderr) {
          resolve({
            passed: false,
            input: testCase.input,
            expectedOutput: JSON.stringify(expectedOutput),
            actualOutput: null,
            runtime,
            error: stderr || 'Runtime error'
          });
          return;
        }
        
        try {
          const actualOutput = JSON.parse(stdout.trim());
          const passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
          
          resolve({
            passed,
            input: testCase.input,
            expectedOutput: JSON.stringify(expectedOutput),
            actualOutput: JSON.stringify(actualOutput),
            runtime,
            error: null
          });
        } catch (parseError) {
          resolve({
            passed: false,
            input: testCase.input,
            expectedOutput: JSON.stringify(expectedOutput),
            actualOutput: stdout.trim(),
            runtime,
            error: 'Invalid output format'
          });
        }
      });
      
      python.on('error', async (err) => {
        // Clean up temp file
        try {
          await fs.unlink(tempFile);
        } catch {}
        
        resolve({
          passed: false,
          input: testCase.input,
          expectedOutput: JSON.stringify(expectedOutput),
          actualOutput: null,
          runtime: Date.now() - startTime,
          error: err.message
        });
      });
      
    } catch (error) {
      resolve({
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: null,
        runtime: Date.now() - startTime,
        error: error.message
      });
    }
  });
}

// Get all DSA problems with filters (FROM MONGODB)
exports.getProblems = async (req, res) => {
  try {
    const { difficulty, topic, search, limit = 50 } = req.query;

    let query = {};
    
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topics = topic;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const problems = await DsaProblem.find(query)
      .limit(parseInt(limit))
      .select('id title difficulty topics companies url');
    
    const total = await DsaProblem.countDocuments(query);

    res.json({
      problems,
      total
    });
  } catch (error) {
    console.error('Error in getProblems:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single problem by ID (FROM MONGODB)
exports.getProblemById = async (req, res) => {
  try {
    const problem = await DsaProblem.findOne({ id: req.params.id });
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const visibleTestCases = problem.testCases?.filter(tc => !tc.isHidden) || [];
    
    res.json({
      problem: {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description || `Solve the problem: ${problem.title}`,
        examples: problem.examples || [],
        constraints: problem.constraints || [],
        testCases: visibleTestCases,
        topics: problem.topics || [],
        companies: problem.companies || [],
        codeTemplates: problem.solution || {
          python: `def solution(input):\n    # Write your code here\n    return result`
        }
      }
    });
  } catch (error) {
    console.error('Error in getProblemById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Run code against visible test cases
exports.runCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    const problem = await DsaProblem.findOne({ id: req.params.id });
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (language !== 'python') {
      return res.status(400).json({ message: 'Only Python is supported' });
    }

    const visibleTests = problem.testCases?.filter(tc => !tc.isHidden) || [];
    
    if (visibleTests.length === 0) {
      return res.status(400).json({ message: 'No test cases available' });
    }

    // Execute all visible test cases
    const results = await Promise.all(
      visibleTests.map(tc => executePython(code, tc))
    );

    res.json({ results });
  } catch (error) {
    console.error('Error in runCode:', error);
    res.status(500).json({ message: error.message });
  }
};

// Submit solution (run all test cases including hidden)
exports.submitSolution = async (req, res) => {
  try {
    const { code, language, userId } = req.body;
    
    const problem = await DsaProblem.findOne({ id: req.params.id });
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (language !== 'python') {
      return res.status(400).json({ message: 'Only Python is supported' });
    }

    const allTests = problem.testCases || [];
    
    if (allTests.length === 0) {
      return res.status(400).json({ message: 'No test cases available' });
    }

    // Execute all test cases (visible + hidden)
    const results = await Promise.all(
      allTests.map(tc => executePython(code, tc))
    );

    const allPassed = results.every(r => r.passed);
    const passedCount = results.filter(r => r.passed).length;

    // Save to MongoDB
    try {
      const submission = await Submission.create({
        user: userId,
        problem: problem.id,
        code,
        language,
        result: allPassed ? 'Accepted' : 'Wrong Answer',
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        runtime: Math.max(...results.map(r => r.runtime || 0)),
        memory: 12,
        testCasesPassed: passedCount,
        totalTestCases: allTests.length,
        testCaseResults: results
      });

      res.json({
        success: allPassed,
        submissionId: submission._id,
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        message: allPassed 
          ? `All ${allTests.length} test cases passed! 🎉` 
          : `${passedCount}/${allTests.length} test cases passed.`,
        runtime: Math.max(...results.map(r => r.runtime || 0)),
        memory: 12,
        testCasesPassed: passedCount,
        totalTestCases: allTests.length,
        testCaseResults: results
      });
    } catch (dbError) {
      console.error('DB Error saving submission:', dbError);
      // Still return results even if DB save fails
      res.json({
        success: allPassed,
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        message: allPassed 
          ? `All ${allTests.length} test cases passed! 🎉` 
          : `${passedCount}/${allTests.length} test cases passed.`,
        testCasesPassed: passedCount,
        totalTestCases: allTests.length,
        testCaseResults: results
      });
    }
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: error.message });
  }
};
