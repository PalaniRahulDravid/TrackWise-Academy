exports.getCompanyQuestions = (req, res) => {
  const company = req.params.company.toLowerCase();
  const { companyProblems } = req.app.locals.dataCache || {};

  if (!companyProblems[company]) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const problems = companyProblems[company];

  // Handle pagination only if limit param provided
  if (req.query.limit) {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const start = (page - 1) * limit;
    return res.json({
      total: problems.length,
      page,
      limit,
      problems: problems.slice(start, start + limit)
    });
  } else {
    // NO limit => return ALL questions
    return res.json({
      total: problems.length,
      problems
    });
  }
};
