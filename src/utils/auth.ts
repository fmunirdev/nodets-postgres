import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import {
  Strategy as JWTstrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';

import { User } from '../models';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id: string, done) {
  User.findByPk(id, {
    attributes: { exclude: ['password'] },
  }).then((user) => {
    if (user) {
      done(null, user.get());
    }
  });
});

// Create a passport middleware to handle User login
passport.use(
  'local',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username: string, password: string, done) => {
      try {
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username or password',
          });
        }
        const validate = await user.comparePassowrd(password);
        if (!validate) {
          return done(null, false, {
            message: 'Incorrect username or password',
          });
        }
        return done(null, user, { message: 'Logged in successfully.' });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwt_payload, done) => {
      User.findByPk(jwt_payload.id)
        .then((user) => {
          return done(null, user || false);
        })
        .catch((error) => done(error));
    },
  ),
);
