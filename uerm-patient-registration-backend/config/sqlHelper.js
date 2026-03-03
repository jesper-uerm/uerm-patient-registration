const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Connected to SQL Server');
        return pool;
    })
    .catch(err => console.error('❌ Database Connection Failed:', err));

module.exports = {
    sql, 
    query: async (command, params) => {
        const pool = await poolPromise;
        const request = pool.request();

        if (params) {
            for (const key in params) {
                request.input(key, params[key]);
            }
        }

        const result = await request.query(command);
        return result.recordset;
    },
    dbConfig: dbConfig, 
    poolPromise: poolPromise 
};
