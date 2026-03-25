const DashboardModel = require('../models/dashboardModel');

const DashboardController = {

fetchDashboardStats: async (req, res) => {
    try {
        const stats = await DashboardModel.getDashboardStats();
        
        res.status(200).json({
        inpatient: stats.inpatient || 0,
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
        const rawData = await DashboardModel.getPatientTypeCounts();

        const labels = rawData.map(row => row.PATIENTTYPE);
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
        const periods = Array.from(new Set(rawData.map(item => item.period))).sort();

        const seriesMap = {
            'Inpatient': new Array(periods.length).fill(0),
            'Outpatient': new Array(periods.length).fill(0), 
            'Emergency':  new Array(periods.length).fill(0)
    };

    rawData.forEach(row => {
        const periodIndex = periods.indexOf(row.period);
        if (seriesMap[row.type] !== undefined) {
            seriesMap[row.type][periodIndex] = row.total;
        }
    });

    res.status(200).json({
        categories: periods, 
        series: [
            { name: 'Admitted', data: seriesMap['Inpatient'] },
            { name: 'OPD',      data: seriesMap['Outpatient'] }, 
            { name: 'ER',       data: seriesMap['Emergency'] }
        ]
    });

    } catch (err) {
        console.error("Trend Error:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
    }
};

module.exports = DashboardController;