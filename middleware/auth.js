const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findByPk(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            console.error(error);
            return done(error, false);
        }
    })
);

module.exports = passport;
