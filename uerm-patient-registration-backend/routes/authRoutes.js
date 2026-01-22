const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/registerTriage', authController.registerTriage);

router.put('/updateTriage', authController.updateTriage);

router.get('/searchInpatient', authController.searchInpatient);

router.get('/searchOutpatient', authController.searchOutpatient);

router.get('/searchErpatient', authController.searchErpatient);

router.get('/fetchInpatient', authController.fetchInpatient);

router.get('/fetchOutpatient', authController.fetchOutpatient);

router.get('/fetchErpatient', authController.fetchErpatient);

router.get('/fetchAdmitErpatient', authController.fetchAdmitErpatient);

router.get('/fetchPieChartData', authController.fetchPieChartData);

router.get('/fetchLineChartData', authController.fetchLineChartData);

router.get('/fetchAllPatient', authController.fetchAllPatient);

router.put('/updatePatientDetails', authController.updatePatientDetails);

router.get('/getPatient/:id', authController.getpatientById);

router.get('/getpatientSignature/:id', authController.getPatientSignature);

router.get('/getTpersonnelSignature/:id', authController.getTpersonnelSignature);

router.post('/sendDataInformation', authController.sendDataInformation);

router.get('/checkPatientExists/:id', authController.checkPatientExists);

router.post('/linkExistingPatientInfo', authController.linkExistingPatientInfo);

router.put('/admitErPatient', authController.admitErPatient);


module.exports = router;