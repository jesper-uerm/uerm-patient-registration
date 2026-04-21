const DashboardModel = require('../models/dashboardModel');

const DashboardController = {

fetchDashboardStats: async (req, res) => {
    try {
        const stats = await DashboardModel.getDashboardStats();
        
        res.status(200).json({
        forAdmission: stats.forAdmission || 0,
        outpatient: stats.outpatient || 0,
        emergency: stats.emergency || 0
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
},

fetchPieChartData: async (req, res) => {
    try {
        const rawData = await DashboardModel.getPaymentTypeCounts();

        const labels = rawData.map(row => row.paymentType);
        const series = rawData.map(row => row.total);

        res.status(200).json({ labels, series });

    } catch (err) {
        console.error("Pie Chart Error:", err);
        res.status(500).json({ message: "Database error: " + err.message });
    }
},

fetchLineChartData: async (req, res) => {
    try {
        const rawData = await DashboardModel.getMonthlyTrends();

        const periods = rawData.map(row => row.period);
        const admittedData = rawData.map(row => row.admitted_total);
        const opdData = rawData.map(row => row.opd_total);
        const erData = rawData.map(row => row.er_total);

        res.status(200).json({
            categories: periods, 
            series: [
                { name: 'Admitted', data: admittedData },
                { name: 'OPD',      data: opdData }, 
                { name: 'ER',       data: erData }
            ]
        });

    } catch (err) {
        console.error("Trend Error:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
    }
};

module.exports = DashboardController;