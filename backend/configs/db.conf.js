const mongoose = require('mongoose');
const debug = require('debug')(`${process.env.npm_package_name}:mongoose`);
const chalk = require('chalk');
const dbName = process.env.DB_NAME || 'folakatech';
const mongoString = process.env.MONGO_CONNECTIONSTRING;
const db = mongoose.connection;
const options = {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    dbName,
};

let initialRetry = 0;

const handleError = (err) => {
    if (err) {
        const {name, errorLabels} = err;
        debug(`${name}: ${errorLabels}`);
        if (initialRetry < 3) {
            initialRetry++;
            debug(chalk.bgYellowBright(`${initialRetry} retry...`));
            setTimeout(() => {
                mongoose.connect(mongoString, options, handleError);
            }, 3000);
        } else if (initialRetry === 3) {
            debug(chalk.red(`Failed to connect 3 times`));
            mongoose.disconnect();
            process.exit(1);
        }
    } else {
        initialRetry = 0;
    }
};

db.once('open', () => {
    debug(chalk.green('Database connected!'));
});

exports.connect = () => {
    debug(chalk.gray('Initial db connection...'));
    mongoose.connect(mongoString, options, handleError);
};
exports.connection = db;
