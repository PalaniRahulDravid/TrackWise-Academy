require('dotenv').config();
const mongoose = require('mongoose');
const DsaQuestion = require('../models/DsaQuestion');
const data = require('../data/dsaSheet.json');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await DsaQuestion.deleteMany();
  let arr = [];
  Object.values(data).forEach(stageArr => arr.push(...stageArr));
  await DsaQuestion.insertMany(arr);
  console.log('Seeded DSA questions!');
  mongoose.disconnect();
};

run();
