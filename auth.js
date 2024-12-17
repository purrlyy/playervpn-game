const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

// Configure session
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Google strategy
passport.use(new GoogleStrategy({
    clientID: '887214131048-asrb17avqcufdtbtt78uj2fe4dut5313.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
    // Save or handle user profile (usually save to DB)
    return done(null, profile);
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/profile');
    });

app.get('/profile', (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
