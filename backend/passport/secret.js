const passport = require('passport');
exports.auth = passport.authenticate('jwt', {session: false});
exports.JWT_SECRET = process.env.JWT_SECRET;
