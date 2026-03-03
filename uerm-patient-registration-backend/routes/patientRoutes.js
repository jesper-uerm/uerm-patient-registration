const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');

router.post('/register', PatientController.register);
router.put('/details', PatientController.updateDetails);
router.post('/link', PatientController.linkPatient);
router.post('/send-data', PatientController.sendDataInfo);

router.get('/inpatient', PatientController.fetchInpatient);
router.get('/outpatient', PatientController.fetchOutpatient);

router.get('/search-inpatient', PatientController.searchInpatient);
router.get('/search-outpatient', PatientController.searchOutpatient);
router.get('/search-finance', PatientController.searchFinance);

router.get('/check/:id', PatientController.checkExists);
router.get('/signature/:id', PatientController.getSignature);
router.get('/', PatientController.fetchAll);

router.get('/:id', PatientController.getById);

router.post('/send-to-credit', PatientController.sendToCredit);

module.exports = router;