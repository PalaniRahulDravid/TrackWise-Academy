const DsaProblem = require('../models/DsaProblem');
const Submission = require('../models/Submission');
const CodeExecutor = require('../utils/codeExecutor');

exports.getProblems = async (req, res) => {
  try {
    const {
      difficulty,
      category,
      company,
      topic,
      search,
      page = 1,
      limit = 50,
      sortBy = 'acceptance'
    } = req.query;

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (company) query.companies = company;
    if (topic) query.topics = topic;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const [problems, total] = await Promise.all([
      DsaProblem.find(query)
        .select('id title difficulty acceptance submissions category companies source')
        .sort({ [sortBy]: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean(),
      DsaProblem.countDocuments(query)
    ]);

    const filters = {
      difficulties: ['Easy', 'Medium', 'Hard'],
      categories: await DsaProblem.distinct('category'),
      companies: await DsaProblem.distinct('companies'),
      topics: await DsaProblem.distinct('topics')
    };

    res.json({
      problems,
      filters,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await DsaProblem.findById(req.params.id)
      .select('-testCases.output -solution') // Don't send hidden test cases and solutions
      .lean();
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await DsaProblem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    let results;
    switch (language) {
      case 'javascript':
        results = await CodeExecutor.executeJavaScript(code, problem.testCases);
        break;
      case 'python':
        results = await CodeExecutor.executePython(code, problem.testCases);
        break;
      case 'java':
        results = await CodeExecutor.executeJava(code, problem.testCases);
        break;
      default:
        return res.status(400).json({ message: 'Unsupported language' });
    }

    const allPassed = results.every(r => r.passed);
    const runtime = Math.max(...results.map(r => r.runtime || 0));
    const memory = Math.max(...results.map(r => r.memory || 0));

    // Create submission record
    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      code,
      language,
      status: allPassed ? 'Accepted' : 'Wrong Answer',
      runtime,
      memory,
      testCasesPassed: results.filter(r => r.passed).length,
      totalTestCases: results.length
    });

    // Update problem statistics
    problem.submissions += 1;
    if (allPassed) problem.successfulSubmissions += 1;
    problem.acceptance = (problem.successfulSubmissions / problem.submissions) * 100;
    await problem.save();

    res.json({
      submissionId: submission._id,
      status: submission.status,
      runtime,
      memory,
      results: results.map(r => ({
        passed: r.passed,
        runtime: r.runtime,
        memory: r.memory,
        input: r.input,
        expectedOutput: r.expectedOutput,
        actualOutput: r.actualOutput,
        error: r.error
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};