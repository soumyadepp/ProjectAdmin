const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'sbdbznaeatagpp',
    host: 'ec2-34-250-92-138.eu-west-1.compute.amazonaws.com',
    database: 'dfaepnmck6hm7s',
    password: 'c13c13f082a1266c66b62c08c3b18d4b5f32842adc031bdd60356ea6ca6ee555',
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

module.exports = pool;