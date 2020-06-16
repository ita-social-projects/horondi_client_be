const passport = require('passport');
require('dotenv').config();
const GooglePlusTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
require('dotenv').config();

const User = require('../models/User');

passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          password: profile.id,
          email: profile.emails[0].value,
          confirmedEmail: true,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (e) {
        done(e, false, e.message);
      }
    },
  ),
);

passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const searchBy = profile.emails[0].value || profile.id;
        const existingUser = await User.findOne({ email: searchBy });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          email: `${searchBy}`,
          confirmedEmail: true,
          password: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (e) {
        done(e, false, e.message);
      }
    },
  ),
);
