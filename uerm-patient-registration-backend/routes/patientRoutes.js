const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');

router.post('/register', PatientController.register);
router.post('/link', PatientController.linkPatient);
router.post('/send-data', PatientController.sendDataInfo);
router.post('/send-to-credit', PatientController.sendToCredit);

router.put('/details', PatientController.updateDetails);
router.put('/approve', PatientController.approvePatient);
router.put('/disapprove', PatientController.disapprovePatient);

router.get('/returning', PatientController.searchReturning);
router.get('/inpatient', PatientController.fetchInpatient); 
router.get('/for-admission', PatientController.fetchErList); 
router.get('/outpatient', PatientController.fetchOutpatient);
router.get('/doctors', PatientController.getDoctors);
router.get('/service', PatientController.getServices);
router.get('/department', PatientController.getDepartment);
router.get('/hmo', PatientController.getHMO);
router.get('/rooms', PatientController.getRooms);

router.get('/region', PatientController.getRegion);
router.get('/provinces', PatientController.getProvince);
router.get('/cities', PatientController.getMunicipality);
// router.get('/barangays', PatientController.getBarangays);

router.get('/finance', PatientController.fetchPatientsForFinance);
router.get('/financeApproval', PatientController.fetchErPatientsForFinanceApproval);

router.get('/search-from-er', PatientController.searchERpatient);
router.get('/search-inpatient', PatientController.searchInpatient);
router.get('/search-outpatient', PatientController.searchOutpatient);
router.get('/search-finance', PatientController.searchFinance);
router.get('/search-finance-approval', PatientController.searchFinanceApproval);
router.get('/assessment-details/:patientno', PatientController.fetchAssessmentDetails);

router.get('/check/:id', PatientController.checkExists);
router.get('/signature/:id', PatientController.getSignature);
router.get('/', PatientController.fetchAll);

router.get('/:id', PatientController.getById);

module.exports = router;