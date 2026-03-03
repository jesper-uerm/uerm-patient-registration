const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

router.get('/pie-chart', DashboardController.fetchPieChartData);
router.get('/line-chart', DashboardController.fetchLineChartData);
router.get('/stats', DashboardController.fetchDashboardStats);

module.exports = router;