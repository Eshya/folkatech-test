const createError = require('http-errors');
const {param, query, after} = require('./request.validation');
const {checkSchema} = require('express-validator');
const passport = require('passport');

exports.auth = passport.authenticate('jwt', {session: false});
exports.schemaCek = checkSchema;
exports.projectName = process.env.npm_package_name;
exports.paramCek = param;
exports.queryCek = query;
exports.after = after;

const parse = (sort) => {
    const keys = Object.keys(sort);
    if (keys.length) {
      keys.forEach((k) => {
        sort[k] = parseInt(sort[k]);
      });
    } else {
      sort = {};
    }
    return sort;
};
  
exports.parseQuery = (query) => {
    const limit = (query.limit === null || query.limit === undefined)? 50 : query.limit;
    const offset = query.offset || 0;
    const where = query.where? query.where : {};
    const sort = query.sort? sortParser.parse(query.sort) : {};
    const search = query.search || '';
    // console.log({ limit, offset, where, sort, search})
    return {limit, offset, where, sort, search};
};
exports.createError = createError;
