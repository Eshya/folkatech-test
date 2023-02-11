const mongoose = require('mongoose');
const Promise = require('bluebird');
const redis = require('redis');
const util = require('util');
const fs = require('fs');

const files = fs.readdirSync(`${__dirname}/../routes/api`);
const PATH_REDIS_SPACE = 3;
const redisPATH = process.env.REDIS_PATH;

var client;
var getAsync;
if (process.env.REDISMODE == 1) {
    client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        legacyMode: true,
        retry_strategy: () => 1000,
    });
    client.select(redisPATH, function () {
        console.log(`select redis db ${redisPATH}`);
    });
    getAsync = util.promisify(client.hget).bind(client);
}

const exec = mongoose.Query.prototype.exec;
const execAgr = mongoose.Aggregate.prototype.exec;
const find = mongoose.Query.prototype.find;
const findOne = mongoose.Query.prototype.findOne;
const findById = mongoose.Query.prototype.findById;
const countDocuments = mongoose.Query.prototype.countDocuments;

mongoose.Query.prototype.find = function () {
    this.cmd = 0;
    return find.apply(this, arguments);
};

mongoose.Query.prototype.findOne = function () {
    this.cmd = 1;
    return findOne.apply(this, arguments);
};
mongoose.Query.prototype.findById = function () {
    this.cmd = 1;
    return findById.apply(this, arguments);
};
mongoose.Query.prototype.countDocuments = function () {
    this.cmd = 2;
    return countDocuments.apply(this, arguments);
};

mongoose.Query.prototype.cache = function (
    options = {time: process.env.REDIS_TIME}
) {
    this.useCache = true;
    this.time = options.time;
    this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache || process.env.REDISMODE != 1) {
        return await exec.apply(this, arguments);
    }
    if (this.cmd == 0) client.select(redisPATH);
    else if (this.cmd == 1)
        client.select(parseInt(redisPATH) + PATH_REDIS_SPACE);
    else if (this.cmd == 2)
        client.select(parseInt(redisPATH) + PATH_REDIS_SPACE * 2);
    else client.select(redisPATH);

    RegExp.prototype.toJSON = RegExp.prototype.toString;
    const key = JSON.stringify({
        ...this.getQuery(),
        ...this.getOptions(),
    });

    // const cacheValue = await client.HGETALL(this.hashKey, key);
    const cacheValue = await getAsync(this.hashKey, key);

    if (cacheValue !== null) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) ? arrayJson(doc) : keyExists(doc);
    }

    const result = await exec.apply(this, arguments);

    await client.hset(this.hashKey, key, JSON.stringify(result));

    await client.expire(this.hashKey, this.time);

    return result;
};

const keyExists = (obj) => {
    if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
        return obj; // quit revursive
    }
    /// convertData
    if (obj.hasOwnProperty('_id')) {
        if (mongoose.Types.ObjectId.isValid(obj['_id'])) {
            obj['_id'] = mongoose.Types.ObjectId(obj['_id']);
        }
    }

    if (obj.hasOwnProperty('createdAt')) {
        obj['createdAt'] =
            obj['createdAt'] !== null ? new Date(obj['createdAt']) : null;
    }

    /// recursive nested data
    files.forEach((endpoint) => {
        if (endpoint != 'index.js') {
            if (obj.hasOwnProperty(endpoint)) {
                if (Array.isArray(obj[endpoint])) {
                    obj[endpoint] = arrayJson(keyExists(obj[endpoint]));
                } else if (mongoose.Types.ObjectId.isValid(obj[endpoint])) {
                    obj[endpoint] = mongoose.Types.ObjectId(obj[endpoint]);
                } else {
                    obj[endpoint] = keyExists(obj[endpoint]);
                }
            }
        }
    });
    return obj;
};

function arrayJson(array) {
    let json = [];
    for (let i = 0; i < array.length; i++) {
        json.push(keyExists(array[i]));
    }
    return json;
}

module.exports = {
    clearKey(hashKey) {
        for (let i = 0; i < 4; i++) {
            if (i == 0) client.select(redisPATH);
            else if (i == 1)
                client.select(parseInt(redisPATH) + PATH_REDIS_SPACE);
            else if (i == 2)
                client.select(parseInt(redisPATH) + PATH_REDIS_SPACE * 2);
            client.del(JSON.stringify(hashKey));
        }
    },
};
