import axios from "axios";

// Ping the backend to wake it up (for Render.com free tier)
export const wakeUpServer = async () => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      return; // Skip wake-up call in development
    }

    const baseURL = "https://trackwise-academy.onrender.com";
    console.log('⏰ Waking up server...');
    
    const response = await axios.get(`${baseURL}/health`, {
      timeout: 5000,
    });
    
    if (response.status === 200) {
      console.log('✅ Server is awake!');
    }
  } catch (error) {
    console.log('⚠️ Server is waking up, this may take 30-50 seconds...');
  }
};

// Call this on app initialization
if (typeof window !== 'undefined') {
  wakeUpServer();
}
