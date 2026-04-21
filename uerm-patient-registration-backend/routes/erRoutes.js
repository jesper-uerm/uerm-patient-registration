const express = require('express');
const router = express.Router();
const ErController = require('../controllers/erController');

router.get('/patients', ErController.fetchErPatients);
router.get('/finance', ErController.fetchErPatientsForFinance);
router.get('/financeApproval', ErController.fetchErPatientsForFinanceApproval);
router.get('/admitted', ErController.fetchAdmitErPatient);
router.get('/search-admitted', ErController.searchAdmittedPatients);
router.get('/search', ErController.searchErPatient);

router.post('/triage', ErController.registerTriage);
router.post('/case', ErController.generateCaseNumber); 
router.put('/triage', ErController.updateTriage); 
router.put('/admit', ErController.admitErPatient);


router.get('/:PATIENTNO/records', ErController.fetchPatientRecords);

module.exports = router;