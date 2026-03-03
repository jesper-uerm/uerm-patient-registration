const express = require('express');
const router = express.Router();
const ErController = require('../controllers/erController');

router.post('/triage', ErController.registerTriage);
router.put('/triage', ErController.updateTriage);
router.put('/admit', ErController.admitErPatient);
router.get('/patients', ErController.fetchErPatients);
router.get('/review', ErController.fetchErPatientsForReview);
router.get('/admitted', ErController.fetchAdmitErPatient);
router.get('/search', ErController.searchErPatient);

module.exports = router;