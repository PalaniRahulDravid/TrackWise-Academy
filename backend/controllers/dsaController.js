exports.getProblemsByLevel = (req, res) => {
  const { level } = req.query;
  const { allProblems } = req.app.locals.dataCache || {};
  if (!allProblems) return res.status(500).json({ error: 'Problems not loaded yet' });

  let filtered;
  if (level === 'beginner') {
    filtered = allProblems.filter(q => q.difficulty === 'Easy');
  } else if (level === 'intermediate') {
    filtered = allProblems.filter(q => q.difficulty === 'Medium');
  } else {
    filtered = allProblems; // fallback
  }

  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const start = (page - 1) * limit;
  res.json({
    total: filtered.length,
    page,
    problems: filtered.slice(start, start + limit)
  });
};

exports.getProblemById = (req, res) => {
  const { id } = req.params;
  const { allProblems } = req.app.locals.dataCache || {};
  const problem = allProblems.find(q => q.id == id);
  if (!problem) return res.status(404).json({ error: 'Problem not found' });
  res.json(problem);
};
