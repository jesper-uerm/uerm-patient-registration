const ErModel = require('../models/erModel');

const ErController = {

    registerTriage: async (req, res) => {
        if (!req.body) {
            return res.status(400).json({ message: "Invalid Request: Body is missing." });
        }

        try {
            const patientId = await ErModel.registerTriage(req.body);

            res.status(201).json({ 
                message: "Triage assessment saved successfully", 
                patientId: patientId 
            });

        } catch (err) {
            console.error("Triage Save Error:", err);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    }, 

    updateTriage: async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ message: "Invalid Request: Body is missing." });
            }

            if (!req.body.patientId) {
                return res.status(400).json({ message: "Update failed: Patient Number (patientId) is missing." });
            }

            const result = await ErModel.updateTriage(req.body);

            res.status(200).json({ 
                message: "Triage data updated successfully",
                PATIENTNO: result.PATIENTNO,
                ID: result.ID
            });

        } catch (error) {
            console.error("Update Triage Error:", error);
            res.status(500).json({ message: "Server error: " + error.message });
        }
    },

    admitErPatient: async (req, res) => {
        const { ID } = req.body;

        if (!ID) {
            return res.status(400).json({ message: "Patient ID is required." });
        }

        try {
            const rowsAffected = await ErModel.admitPatient(ID);

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Patient not found." });
            }

            res.status(200).json({ message: "Patient successfully admitted." });

        } catch (err) {
            console.error("Admit Patient Error:", err);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    },

    fetchErPatients: async (req, res) => {
        try {
            const patients = await ErModel.getAllErPatients();

            res.status(200).json(patients);

        } catch (err) {
            console.error("Fetch Error:", err);
            res.status(500).json({ message: "Database error: " + err.message });
        }
    },

    fetchErPatientsForFinance: async (req, res) => {
        try {
            const patients = await ErModel.fetchErPatientsForFinance();

            res.status(200).json(patients);

        } catch (err) {
            console.error("Fetch Review Error:", err);
            res.status(500).json({ message: "Database error: " + err.message });
        }
    },

    fetchAdmitErPatient: async (req, res) => {
        try {
            const patients = await ErModel.getAdmittedPatients();

            res.status(200).json(patients);

        } catch (err) {
            console.error("Fetch Admitted Error:", err);
            res.status(500).json({ message: "Database error: " + err.message });
        }
    },

    searchErPatient: async (req, res) => {
        try {
            const { query } = req.query; 

            if (!query) {
                return res.status(400).json({ message: "Search query required" });
            }

            const patients = await ErModel.searchPatients(query);

            res.status(200).json(patients);

        } catch (err) {
            console.error("Search Error:", err);
            res.status(500).json({ message: "Database error: " + err.message });
        }
    },

    generateCaseNumber: async (req, res) => {
        try {
            const data = req.body;

            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ message: "Invalid Request: Payload is missing." });
            }

            if (!data.patientId) {
                return res.status(400).json({ message: "Update failed: Patient ID is missing." });
            }

            const result = await ErModel.generateCaseNumber(data);

            if (!result) {
                return res.status(404).json({ message: "Failed to update record. Patient ID may be invalid." });
            }

            return res.status(200).json({ 
                message: "Case number generated and record updated successfully!",
                PATIENTNO: result.PATIENTNO,
                ID: result.ID,
                // case_no: result.case_no // You might want to return the newly generated case number here too!
            });

        } catch (error) {
            console.error("Generate Case Number Error:", error);
            return res.status(500).json({ message: "Server error: " + error.message });
        }
    }
};

module.exports = ErController;