const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const {JWT_SECRET} = require('./secret')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const UserCtrl = require('../routes/api/users/users.controller');
const Users = require('../routes/api/users/users.model');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new BasicStrategy(async (username, passwd, done) => {
    try {
        const user = await UserCtrl.login(username, passwd);
        return done(null, user, {
            message: 'Logged In Successfully'
        });
    } catch (err) {
        return done(err, null);
    }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, async ({
    username
}, done) => {
    try {
        const users = await Users.findOne({
            username
        }).populate('roles');
        return done(null, users);
    } catch (err) {
        return done(err, null);
    }
}));
module.exports = passport