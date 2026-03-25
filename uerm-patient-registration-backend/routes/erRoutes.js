const express = require('express');
const router = express.Router();
const ErController = require('../controllers/erController');

router.post('/triage', ErController.registerTriage);
router.post('/case', ErController.generateCaseNumber); 
router.put('/triage', ErController.updateTriage); 
router.put('/admit', ErController.admitErPatient);
router.get('/patients', ErController.fetchErPatients);
router.get('/finance', ErController.fetchErPatientsForFinance);
router.get('/admitted', ErController.fetchAdmitErPatient);
router.get('/search', ErController.searchErPatient);

module.exports = router;