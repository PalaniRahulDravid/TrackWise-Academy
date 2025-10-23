exports.getCompanyQuestions = (req, res) => {
  const company = req.params.company.toLowerCase();
  const { companyProblems } = req.app.locals.dataCache || {};
  if (!companyProblems[company]) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const start = (page - 1) * limit;
  const problems = companyProblems[company];

  res.json({
    total: problems.length,
    page,
    problems: problems.slice(start, start + limit)
  });
};
