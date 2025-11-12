const axios = require('axios');

// Test the optimized registration endpoint
async function testRegistration() {
  const testEmail = `test${Date.now()}@example.com`;
  
  console.log('🧪 Testing registration speed...');
  console.log('📧 Test email:', testEmail);
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: testEmail,
      password: 'test123456'
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n✅ Registration successful!');
    console.log('⏱️  Response time:', duration + 'ms');
    console.log('📊 Response:', response.data);
    
    if (duration < 3000) {
      console.log('🚀 FAST! Response under 3 seconds');
    } else {
      console.log('⚠️  Slow response. Check email service.');
    }
    
  } catch (error) {
    console.error('\n❌ Registration failed!');
    console.error('Error:', error.response?.data || error.message);
  }
}

testRegistration();
