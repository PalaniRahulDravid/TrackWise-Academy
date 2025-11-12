// Quick test of registration endpoint
const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration endpoint...');
    const startTime = Date.now();
    
    const response = await axios.post('https://trackwise-academy.onrender.com/api/auth/register', {
      name: 'Test User Speed',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    }, {
      timeout: 30000
    });
    
    const elapsed = Date.now() - startTime;
    console.log(`✅ Success! Response time: ${elapsed}ms`);
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testRegistration();
