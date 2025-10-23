const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const DsaProblem = require('../models/DsaProblem');

async function manageDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Show current count
    const currentCount = await DsaProblem.countDocuments();
    console.log(`Current problems in database: ${currentCount}`);

    // Ask for confirmation before clearing
    if (process.argv.includes('--clear')) {
      console.log('Clearing existing problems...');
      await DsaProblem.deleteMany({});
      console.log('Database cleared successfully!');
    }

    // Import problems if requested
    if (process.argv.includes('--import')) {
      // Import LeetCode problems
      const leetcodePath = path.join(__dirname, '..', 'data', 'leetcode_dsa_enriched.json');
      const leetcodeData = JSON.parse(await fs.readFile(leetcodePath, 'utf8'));
      const leetcodeResult = await DsaProblem.insertMany(leetcodeData);
      console.log(`Imported ${leetcodeResult.length} LeetCode problems`);

      // Import company problems
      const companies = ['amazon', 'google', 'infosys', 'tcs'];
      for (const company of companies) {
        const filePath = path.join(__dirname, '..', 'data', 'company_questions', `${company}_questions.json`);
        const companyData = JSON.parse(await fs.readFile(filePath, 'utf8'));
        const result = await DsaProblem.insertMany(companyData);
        console.log(`Imported ${result.length} problems from ${company}`);
      }
    }

    // Show final count
    const finalCount = await DsaProblem.countDocuments();
    console.log(`Total problems in database: ${finalCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

manageDatabase();