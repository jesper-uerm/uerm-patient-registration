const { sql, poolPromise } = require('../config/sqlHelper');

const DashboardModel = {

    getDashboardStats: async () => {
        try {
            const pool = await poolPromise; 
            const result = await pool.request().query(`
                SELECT 
                    SUM(CASE WHEN ISADMITTED = 0 THEN 1 ELSE 0 END) AS forAdmission,
                    SUM(CASE WHEN PATIENTTYPE = 'Outpatient' THEN 1 ELSE 0 END) AS outpatient,
                    SUM(CASE WHEN PATIENTTYPE = 'Emergency' AND ISADMITTED IS NULL THEN 1 ELSE 0 END) AS emergency
                FROM PATIENTREG
            `);
            return result.recordset[0];
        } catch (err) {
            console.error("Model Error (getDashboardStats):", err);
            throw new Error(err.message);
        }
},

getPaymentTypeCounts: async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                paymentType, 
                COUNT(*) AS total
            FROM (
                SELECT 
                    CASE 
                        WHEN HMO IS NOT NULL AND LTRIM(RTRIM(HMO)) NOT IN ('', 'N/A') THEN 'HMO'
                        WHEN INFIRMARY IS NOT NULL AND LTRIM(RTRIM(INFIRMARY)) NOT IN ('', 'N/A') THEN 'Infirmary'
                        ELSE 'Cash'
                    END AS paymentType
                FROM PATIENTREG
            ) AS PaymentData
            GROUP BY paymentType
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
                
                SUM(CASE WHEN PATIENTTYPE IN ('Emergency', 'ER') THEN 1 ELSE 0 END) AS er_total,
                
                SUM(CASE WHEN PATIENTTYPE IN ('Outpatient', 'OPD') THEN 1 ELSE 0 END) AS opd_total,
                
                SUM(CASE WHEN PATIENTTYPE IN ('Inpatient', 'Admitted') THEN 1 ELSE 0 END) AS admitted_total

            FROM PATIENTREG
            WHERE CREATEDAT IS NOT NULL
            GROUP BY FORMAT(CREATEDAT, 'yyyy-MM')
            ORDER BY period ASC
        `);
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
}
};

module.exports = DashboardModel;