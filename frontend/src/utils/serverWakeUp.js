import axios from "axios";

// Ping the backend to wake it up (for Render.com free tier)
export const wakeUpServer = async () => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('🏠 Running in development mode - skipping server wake-up');
      return;
    }

    const baseURL = "https://trackwise-academy.onrender.com";
    console.log('⏰ Pinging server to wake it up...');
    
    const startTime = Date.now();
    const response = await axios.get(`${baseURL}/health`, {
      timeout: 10000, // 10 seconds for health check
    });
    
    const elapsed = Date.now() - startTime;
    if (response.status === 200) {
      console.log(`✅ Server is awake! (${elapsed}ms)`);
      console.log('📊 Server status:', response.data);
    }
  } catch (error) {
    console.warn('⚠️ Server is still waking up (this is normal for free tier)');
    console.log('💡 First request may take 30-60 seconds');
  }
};

// Don't auto-call on import - let App.jsx control it
