const { sql, poolPromise } = require('../config/sqlHelper');

const DashboardModel = {

    getDashboardStats: async () => {
        try {
            const pool = await poolPromise; 
            const result = await pool.request().query(`
                SELECT 
                    SUM(CASE WHEN PATIENTTYPE = 'Inpatient' THEN 1 ELSE 0 END) AS inpatient,
                    SUM(CASE WHEN PATIENTTYPE = 'Outpatient' THEN 1 ELSE 0 END) AS outpatient,
                    SUM(CASE WHEN PATIENTTYPE = 'Emergency' THEN 1 ELSE 0 END) AS emergency
                FROM PATIENTREG
            `);
            return result.recordset[0];
        } catch (err) {
            console.error("Model Error (getDashboardStats):", err);
            throw new Error(err.message);
        }
},

getPatientTypeCounts: async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                PATIENTTYPE, 
                COUNT(*) AS total
            FROM PATIENTREG
            WHERE PATIENTTYPE IS NOT NULL
            GROUP BY PATIENTTYPE
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
            FORMAT(CREATEDAT, 'yyyy-MM') AS period,
            PATIENTTYPE AS type,
            COUNT(*) AS total
        FROM PATIENTREG
        WHERE CREATEDAT IS NOT NULL
        GROUP BY FORMAT(CREATEDAT, 'yyyy-MM'), PATIENTTYPE
        ORDER BY period ASC
        `);
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
    }
};

module.exports = DashboardModel;