const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/registerTriage', authController.registerTriage);

router.get('/searchInpatient', authController.searchInpatient);

router.get('/searchOutpatient', authController.searchOutpatient);

router.get('/searchErpatient', authController.searchErpatient);

router.get('/fetchInpatient', authController.fetchInpatient);

router.get('/fetchOutpatient', authController.fetchOutpatient);

router.get('/fetchErpatient', authController.fetchErpatient);

router.get('/fetchPieChartData', authController.fetchPieChartData);

router.get('/fetchLineChartData', authController.fetchLineChartData);

router.get('/fetchLineChartData', authController.fetchLineChartData);

router.get('/fetchAllPatient', authController.fetchAllPatient);

router.put('/updatePatientDetails', authController.updatePatientDetails);

// router.get('/getInpatient/:id', authController.getInpatientById);



module.exports = router;