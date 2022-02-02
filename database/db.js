const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config('../.env');
var pool;
if (process.env.NODE_ENV == 'development') {
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'findmydorm',
        password: 'iamtherealhero',
        port: 5432,
    });
} else {
    pool = new Pool({
        user: 'ahbsolhivzvgal',
        host: 'ec2-52-214-125-106.eu-west-1.compute.amazonaws.com',
        database: 'd1nhbqs812rf82',
        password: 'f3adbb43159d048c6ca0e9c93fa5bee2206ff5849a4405959abfaac61e42a586',
        port: 5432,
        ssl: { rejectUnauthorized: false },
    });
}
module.exports = pool;