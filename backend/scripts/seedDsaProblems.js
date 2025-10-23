const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const DsaProblem = require('../models/DsaProblem');

// Helper function to normalize difficulty
function normalizeDifficulty(diff) {
    if (!diff) return 'Medium';
    diff = diff.toString().toLowerCase();
    if (diff.includes('easy')) return 'Easy';
    if (diff.includes('hard')) return 'Hard';
    return 'Medium';
}

async function importLeetCodeProblems() {
    const leetcodePath = path.join(__dirname, '..', 'data', 'leetcode_dsa_enriched.json');
    const leetcodeData = JSON.parse(await fs.readFile(leetcodePath, 'utf8'));

    const formattedProblems = leetcodeData.map(problem => ({
        id: problem.id || String(Math.random()),
        title: problem.title || 'LeetCode Problem',
        url: problem.url || '',
        difficulty: normalizeDifficulty(problem.difficulty),
        category: problem.category || problem.topics?.[0] || 'Algorithm',
        topics: Array.isArray(problem.topics) ? problem.topics : [],
        companies: Array.isArray(problem.companies) ? problem.companies : [],
        testCases: problem.test_cases || '',
        isPremium: problem.paid === 'Yes',
        acceptance: parseFloat(problem.acceptance_rate) || 0,
        submissions: 0,
        successfulSubmissions: 0,
        source: 'leetcode'
    }));

    const result = await DsaProblem.insertMany(formattedProblems, { ordered: false });
    console.log(`✅ Imported ${result.length} LeetCode problems`);
}

async function importCompanyProblems() {
    const companies = ['amazon', 'google', 'infosys', 'tcs'];
    let totalImported = 0;

    for (const company of companies) {
        const filePath = path.join(__dirname, '..', 'data', 'company_questions', `${company}_questions.json`);
        const problems = JSON.parse(await fs.readFile(filePath, 'utf8'));

        const formattedProblems = problems.map(problem => ({
            id: String(Math.random()),
            title: problem.title || problem.url.split('/').pop().replace(/-/g, ' ').trim(),
            url: problem.url,
            difficulty: normalizeDifficulty(problem.difficulty),
            category: 'Company Specific',
            topics: [],
            companies: [company.charAt(0).toUpperCase() + company.slice(1)],
            company: company.charAt(0).toUpperCase() + company.slice(1),
            testCases: '',
            isPremium: false,
            acceptance: 0,
            submissions: 0,
            successfulSubmissions: 0,
            source: 'company'
        }));

        const result = await DsaProblem.insertMany(formattedProblems, { ordered: false });
        totalImported += result.length;
        console.log(`✅ Imported ${result.length} ${company} problems`);
    }

    return totalImported;
}

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📡 Connected to MongoDB');

        // Clear existing data
        await DsaProblem.deleteMany({});
        console.log('🗑️ Cleared existing problems');

        // Import LeetCode problems
        await importLeetCodeProblems();

        // Import company problems
        const companyProblemsCount = await importCompanyProblems();

        // Show final statistics
        const totalCount = await DsaProblem.countDocuments();
        console.log('\n📊 Final Statistics:');
        console.log(`Total problems in database: ${totalCount}`);
        console.log(`Company problems: ${companyProblemsCount}`);
        console.log(`LeetCode problems: ${totalCount - companyProblemsCount}`);

        await mongoose.disconnect();
        console.log('\n✨ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();