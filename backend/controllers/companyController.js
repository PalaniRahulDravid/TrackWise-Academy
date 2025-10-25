exports.getCompanyQuestions = (req, res) => {
  try {
    const company = req.params.company.toLowerCase();
    const { companyProblems } = req.app.locals.dataCache || {};

    // Check if cache is loaded
    if (!companyProblems) {
      return res.status(500).json({ 
        error: 'Company data not loaded',
        message: 'Please try again later'
      });
    }

    // Check if company exists
    if (!companyProblems[company]) {
      const availableCompanies = Object.keys(companyProblems);
      return res.status(404).json({ 
        error: 'Company not found',
        availableCompanies,
        message: `Valid companies: ${availableCompanies.join(', ')}`
      });
    }

    const problems = companyProblems[company];

    // Handle pagination only if limit param provided
    if (req.query.limit) {
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return res.json({
        company: company.charAt(0).toUpperCase() + company.slice(1),
        total: problems.length,
        page,
        limit,
        totalPages: Math.ceil(problems.length / limit),
        problems: problems.slice(start, end)
      });
    } else {
      // NO limit => return ALL questions
      return res.json({
        company: company.charAt(0).toUpperCase() + company.slice(1),
        total: problems.length,
        problems
      });
    }
  } catch (error) {
    console.error('Error in getCompanyQuestions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
