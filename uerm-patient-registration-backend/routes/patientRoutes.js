const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');

router.post('/register', PatientController.register);
router.post('/link', PatientController.linkPatient);
router.post('/send-data', PatientController.sendDataInfo);
router.put('/details', PatientController.updateDetails);
router.put('/approve', PatientController.approvePatient);
router.put('/disapprove', PatientController.disapprovePatient);

router.get('/inpatient', PatientController.fetchInpatient);
router.get('/outpatient', PatientController.fetchOutpatient);
router.get('/doctors', PatientController.getDoctors);
router.get('/hmo', PatientController.getHMO);

router.get('/search-inpatient', PatientController.searchInpatient);
router.get('/search-outpatient', PatientController.searchOutpatient);
router.get('/search-finance', PatientController.searchFinance);
router.get('/search-finance-approval', PatientController.searchFinanceApproval);
router.get('/assessment-details/:caseno', PatientController.fetchAssessmentDetails);

router.get('/check/:id', PatientController.checkExists);
router.get('/signature/:id', PatientController.getSignature);
router.get('/', PatientController.fetchAll);

router.get('/:id', PatientController.getById);


router.post('/send-to-credit', PatientController.sendToCredit);

module.exports = router;