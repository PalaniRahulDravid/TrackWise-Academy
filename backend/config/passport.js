const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 Google OAuth - Profile received:', {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName
        });

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log('✅ Existing Google user found:', user.email);
          return done(null, user);
        }

        // Check if user exists with this email (linking accounts)
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email provided by Google'), null);
        }

        user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
          // Link Google account to existing user
          console.log('🔗 Linking Google account to existing user:', user.email);
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.isVerified = true; // Google accounts are pre-verified
          await user.save();
          return done(null, user);
        }

        // Create new user with Google account
        console.log('➕ Creating new user from Google profile');
        user = new User({
          name: profile.displayName || 'Google User',
          email: email.toLowerCase(),
          googleId: profile.id,
          authProvider: 'google',
          isVerified: true, // Google accounts are pre-verified
          password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12) // Random password (not used)
        });

        await user.save();
        console.log('✅ New Google user created:', user.email);
        return done(null, user);

      } catch (error) {
        console.error('❌ Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
