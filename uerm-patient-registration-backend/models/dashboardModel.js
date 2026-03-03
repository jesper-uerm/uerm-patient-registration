const { sql, poolPromise } = require('../config/sqlHelper');

const DashboardModel = {

    getDashboardStats: async () => {
    try {
    const pool = await poolPromise; 
        const result = await pool.request().query(`
        SELECT 
            SUM(CASE WHEN patientType = 'Inpatient' THEN 1 ELSE 0 END) as inpatient,
            SUM(CASE WHEN patientType = 'Outpatient' THEN 1 ELSE 0 END) as outpatient,
            SUM(CASE WHEN patientType = 'Emergency' THEN 1 ELSE 0 END) as emergency
        FROM PatientRegistration
    `);
    return result.recordset[0];
    } catch (err) {
    throw new Error(err.message);
    }
},

    getPatientTypeCounts: async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
            patientType, 
            COUNT(*) as total
        FROM PatientRegistration
        WHERE patientType IS NOT NULL
        GROUP BY patientType
        `);
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
    },

    getMonthlyTrends: async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
            FORMAT(createdAt, 'yyyy-MM') as period,
            patientType as type,
            COUNT(*) as total
        FROM PatientRegistration
        WHERE createdAt IS NOT NULL
        GROUP BY FORMAT(createdAt, 'yyyy-MM'), patientType
        ORDER BY period ASC
        `);
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
    }
};

module.exports = DashboardModel;