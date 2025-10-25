const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Fix: Load .env from parent directory (backend folder)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DsaProblem = require('../models/DsaProblem');

async function seedDatabase() {
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env file!');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📡 Connected to MongoDB');

    // Clear existing data
    await DsaProblem.deleteMany({});
    console.log('🗑️  Cleared existing problems');

    // Import LeetCode problems with NEW enriched format
    const leetcodePath = path.join(__dirname, '..', 'data', 'leetcode_dsa_enriched.json');
    const leetcodeData = JSON.parse(await fs.readFile(leetcodePath, 'utf8'));

    const leetcodeResult = await DsaProblem.insertMany(leetcodeData, { ordered: false });
    console.log(`✅ Imported ${leetcodeResult.length} LeetCode problems with enriched data`);

    // Import company problems (if you have them)
    let companyCount = 0;
    const companies = ['amazon', 'google', 'infosys', 'tcs'];
    
    for (const company of companies) {
      try {
        const filePath = path.join(__dirname, '..', 'data', 'company_questions', `${company}_questions.json`);
        const companyData = JSON.parse(await fs.readFile(filePath, 'utf8'));
        
        const result = await DsaProblem.insertMany(companyData, { ordered: false });
        companyCount += result.length;
        console.log(`✅ Imported ${result.length} ${company} problems`);
      } catch (err) {
        console.log(`⚠️  No ${company} data found, skipping...`);
      }
    }

    // Show final statistics
    const totalCount = await DsaProblem.countDocuments();
    console.log('\n📊 Final Statistics:');
    console.log(`Total problems in database: ${totalCount}`);
    console.log(`LeetCode problems: ${leetcodeResult.length}`);
    console.log(`Company problems: ${companyCount}`);

    await mongoose.disconnect();
    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate key error - problem IDs must be unique!');
    }
    process.exit(1);
  }
}

seedDatabase();