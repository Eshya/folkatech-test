const createError = require('http-errors');
const {param, query, after} = require('./request.validation');

const passport = require('passport');

exports.auth = passport.authenticate('jwt', {session: false});
exports.projectName = process.env.npm_package_name;
exports.paramCek = param;
exports.queryCek = query;
exports.after = after;
exports.createError = createError;
