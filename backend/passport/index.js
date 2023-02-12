const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const {JWT_SECRET} = require('./secret');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const UserCtrl = require('../routes/api/users/users.controller');
const Users = require('../routes/api/users/users.model');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
    new BasicStrategy(async (username, passwd, done) => {
        try {
            const user = await UserCtrl.login(username, passwd);
            return done(null, user, {
                message: 'Logged In Successfully',
            });
        } catch (err) {
            return done(err, null);
        }
    })
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        },
        async ({userName,role}, done) => {
            try {
                if(userName == process.env.DISPOSABLE_LOGIN_UNAME && role == "admin"){
                    const users = {userName:"root",role:"admin"}
                    return done(null, users);
                }
                else{
                    return done(err, null);
                }
                // const users = await Users.findOne({
                //     username,
                // }).populate('roles');
                // console.log(userName)
                // return done(null, users);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
module.exports = passport;
