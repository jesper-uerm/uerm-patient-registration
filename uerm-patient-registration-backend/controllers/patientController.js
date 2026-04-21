const PatientModel = require('../models/patientModel');

const PatientController = {

    register: async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ message: "Invalid Request: Body is missing." });
            }

            const body = req.body;
            
            const getValue = (val) => (typeof val === 'object' && val !== null ? val.name : val);

            let province = getValue(body.selectedProvince) || getValue(body.selectedProvinceOutpatient) || '';
            if (province === 'NCR' || province === 'N/A (NCR)') province = 'NCR';

            const patientData = {
                lastName: body.lastName || body.lastNameOutpatient,
                firstName: body.firstName || body.firstNameOutpatient,
                middleName: body.middleName || body.middleNameOutpatient,
                suffix: body.suffix || body.suffixOutpatient,
                age: body.age ?? body.ageOutpatient,
                gender: body.gender || body.genderOutpatient,
                civilStatus: body.civilStatus || body.civilStatusOutpatient,
                religion: body.religion || body.religionOutpatient,
                landline: body.landline || body.landlineOutpatient,
                mobile: body.mobile || body.mobileOutpatient,
                email: body.email,
                occupation: body.occupation || body.occupationOutpatient,
                birthdate: body.birthdate || body.birthdateOutpatient || null,        
                birthplace: body.birthplace || body.birthplaceOutpatient,
                nationality: body.nationality || body.nationalityOutpatient,
                
                street: body.streetName || body.streetNameOutpatient || '',
                barangay: getValue(body.selectedBarangay) || getValue(body.selectedBarangayOutpatient) || '',
                city: getValue(body.selectedCity) || getValue(body.selectedCityOutpatient) || '',
                region: getValue(body.selectedRegion) || getValue(body.selectedRegionOutpatient) || '',
                province: province,
                permanentAddress: body.permanentAddress || body.permanentAddressOutpatient,

                fathersName: body.fathersName,
                fathersAddress: body.fathersAddress,
                fatherContactNumber: body.fatherContactNumber,
                mothersName: body.mothersName,
                mothersAddress: body.mothersAddress,
                motherContactNumber: body.motherContactNumber,
                spouseName: body.spouseName,
                spouseOccupation: body.spouseOccupation,
                spouseEmployerName: body.spouseEmployerName,
                spouseEmployerAddress: body.spouseEmployerAddress,
                spouseEmployerContact: body.spouseEmployerContact,

                ptSourceIncome: body.sourceOfIncome,
                specificSourceOfIncome: body.specificSourceOfIncome,
                ptGrossIncome: body.pt_gross_income ? JSON.stringify(body.pt_gross_income) : null,
                ptHomeOwnership: body.pt_home_ownership ? JSON.stringify(body.pt_home_ownership) : null,
                ptYearsStay: body.pt_years_of_stay ? JSON.stringify(body.pt_years_of_stay) : null,
                ptCars: body.pthasCar,
                ptCarOwnership: body.carOwnership,
                
                seniorpwd: body.seniorpwd || body.scidnoOutpatient,
                sssgsis: body.sssgsis,
                philhealthId: body.philhealthId,
                tin: body.tin,
                others: body.others,

                cpName: body.contactPersonInpatient || body.contactPersonOutpatient,
                cpRelationship: body.contactPersonInpatientRelationship || body.contactPersonRelationshipOutpatient,
                cpLandline: body.contactPersonInpatientLandline || body.contactPersonLandlineOutpatient,
                cpMobile: body.cpNumber || body.contactPersonNumberOutpatient,
                cpEmail: body.contactPersonInpatientEmail,
                cpAddress: body.contactPersonInpatientAddress,
                cpOccupation: body.contactPersonInpatientOccupation,
                cpEmployerNumber: body.contactPersonInpatientEmployerNumber,
                
                cpIncomeSource: body.contactPersonInpatientIncome ? JSON.stringify(body.contactPersonInpatientIncome) : null,
                cpGrossIncome: body.contactPersonInpatientGross ? JSON.stringify(body.contactPersonInpatientGross) : null,
                cpHomeOwnership: body.contactPersonInpatientHome ? JSON.stringify(body.contactPersonInpatientHome) : null,
                cpHomeStay: body.contactPersonInpatientHomeStay ? JSON.stringify(body.contactPersonInpatientHomeStay) : null,
                cpHasCar: body.contactPersonInpatienthasCar,
                cpCarOwnership: body.contactPersonInpatientcarOwnership,
                cpNumberOfCars: body.contactPersonInpatientnumberOfCars,

                mop: body.mop,
                specificmop: body.specificmop,
                creditCard: body.creditCard,
                bank: body.bank,
                items: body.items ? JSON.stringify(body.items) : null,

                patientType: body.patientType || '',
                hmo: body.hmoOutpatient,
                scidnoOutpatient: body.scidnoOutpatient,
                philHealth: body.outpatientPhilHealth ? JSON.stringify(body.outpatientPhilHealth) : null,
                medicalProcedure: body.outpatientProcedure,
                physician: body.outpatientPhysician,
                
                signature: body.signature || body.signatureOutpatient
            };

            const result = await PatientModel.upsertPatient(patientData);

            res.status(200).json({
                message: result.status === 'UPDATED' ? "User record updated successfully" : "User registered successfully",
                patientId: result.patientId,
                action: result.status
            });

        } catch (err) {
            console.error("Register Error:", err);
            if (err.number === 2627) {
                return res.status(409).json({ message: "Database constraint error (Duplicate key)." });
            }
            res.status(500).json({ message: "Server error: " + err.message });
        }
},

    updateDetails: async (req, res) => {
        try {
            const { caseno, patientno, formData, reviewedBy } = req.body;

            if (!caseno || !patientno || !formData) {
                return res.status(400).json({
                    success: false,
                    message: "Missing CASENO, PATIENTNO or form data.",
                });
            }

            await PatientModel.upsertPatientCredit(caseno, patientno, formData, reviewedBy);

            res.status(200).json({
                success: true,
                message: "Patient credit details saved successfully.",
            });

        } catch (error) {
            console.error("Update Details Error:", error);
            res.status(500).json({
                success: false,
                message: "Server error while updating details.",
            });
        }
    },

    getById: async (req, res) => {
            try {
                const { id } = req.params;

                if (!id || id === 'undefined' || id === 'null') {
                    return res.status(400).json({ message: "Invalid Patient ID provided" });
                }

                const patient = await PatientModel.getPatientById(id);

                if (patient) {
                    return res.status(200).json(patient);
                } else {
                    return res.status(404).json({ message: "Patient not found" });
                }

            } catch (err) {
                console.error("Fetch Error:", err);
                if (err.number === 8115) {
                    return res.status(400).json({ message: "Error: The Patient ID is too large." });
                }
                res.status(500).json({ message: "Database error" });
            }
},

    checkExists: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || id === 'undefined' || id === 'null') {
                return res.status(400).json({ error: "Invalid Patient ID provided" });
            }

            const result = await PatientModel.checkPatientExists(id);

            return res.status(200).json(result);

        } catch (error) {
            console.error("Check Error:", error);
            return res.status(500).json({ error: 'Check failed' });
        }
},

    linkPatient: async (req, res) => {
        try {
            const { ID, patientno } = req.body;

            if (!ID || !patientno) {
                return res.status(400).json({ message: "Missing Patient ID or Matched Hospital No." });
            }

            await PatientModel.linkPatientRecord(ID, patientno);

            res.status(200).json({ 
                message: "Patient successfully linked. Data synchronized with descriptive values." 
            });

        } catch (err) {
            console.error("Link Error:", err);
            res.status(500).json({ message: "Linking failed", error: err.message });
        }
},

    sendDataInfo: async (req, res) => {
        try {
            const { ID, force } = req.body;

            if (!ID) {
                return res.status(400).json({ message: "Patient ID is required" });
            }

            const result = await PatientModel.transferPatientToLegacy(ID, force);

            if (result.status === 'NOT_FOUND') {
                return res.status(404).json({ message: "Patient not found in Registration records." });
            }

            if (result.status === 'DUPLICATE') {
                return res.status(409).json(result.matches); 
            }

            if (result.status === 'SUCCESS') {
                return res.status(200).json({ message: "Patient data successfully transferred and linked!" });
            }

        } catch (err) {
            console.error("Transfer Error:", err);
            if (err.number === 2627) {
                return res.status(409).json({ message: "Transfer Failed: Patient ID already exists in destination." });
            }
            res.status(500).json({ message: "Transfer failed", error: err.message });
        }
},

    searchInpatient: async (req, res) => {
        try {
            const { query } = req.query;

            if (!query || query.trim() === '') {
                return res.status(200).json([]);
            }

            const results = await PatientModel.searchInpatientRecords(query.trim());

            res.status(200).json(results);

        } catch (err) {
            console.error("Search Error:", err);
            res.status(500).json({ message: "Database error", error: err.message });
        }
},

    searchOutpatient: async (req, res) => {
        try {
            const { query } = req.query;

            if (!query || query.trim() === '') {
                return res.status(400).json({ message: "Search query required" });
            }

            const results = await PatientModel.searchOutpatientRecords(query.trim());

            res.status(200).json(results);

        } catch (err) {
            console.error("Search Error:", err);
            res.status(500).json({ message: "Database error", error: err.message });
        }
},

searchFinance: async (req, res) => {
    try {
        const { query } = req.query;

        const results = await PatientModel.searchFinanceRecord(query);

        res.status(200).json(results);
    } catch (err) {
        console.error("Search Error:", err); 
        res.status(500).json({ 
            message: "Database error during search.",
            error: err.message 
        });
    }
},

searchFinanceApproval: async (req, res) => {
    try {
        const { query } = req.query;

        const results = await PatientModel.searchFinanceRecordApproval(query);

        res.status(200).json(results);
    } catch (err) {
        console.error("Search Error:", err); 
        res.status(500).json({ 
            message: "Database error during search.",
            error: err.message 
        });
    }
},

    fetchInpatient: async (req, res) => {
        try {
            const results = await PatientModel.fetchInpatientRecords();

            res.status(200).json(results);

        } catch (err) {
            console.error("Fetch Inpatient Error:", err);
            res.status(500).json({ message: "Database error" });
        }
},

    fetchOutpatient: async (req, res) => {
        try {
            const results = await PatientModel.fetchOutpatientRecords();
            res.status(200).json(results);
        } catch (err) {
            console.error("Fetch Outpatient Error:", err);
            res.status(500).json({ message: "Database error" });
        }
},

    fetchAll: async (req, res) => {
        try {
            const results = await PatientModel.getAllPatients();
            res.status(200).json(results);
        } catch (err) {
            console.error("Fetch Error:", err);
            res.status(500).json({ message: "Database error" });
        }
},

    getSignature: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Patient ID is required" });
            }

            const signatureData = await PatientModel.getSignatureByPatientId(id);

            if (signatureData && signatureData.SIGNATURE) {
                const binaryData = signatureData.SIGNATURE;
                const base64Signature = binaryData.toString('base64');

                let mimeType = 'image/png';
                if (base64Signature.startsWith('/9j/')) {
                    mimeType = 'image/jpeg';
                }

                const dataUrl = `data:${mimeType};base64,${base64Signature}`;

                return res.status(200).json({ signature: dataUrl });
            } else {
                return res.status(404).json({ message: "No signature found for this Patient ID" });
            }

        } catch (err) {
            console.error("Signature Fetch Error:", err);
            res.status(500).json({ message: "Server Error" });
        }
},

    sendToCredit: async (req, res) => {
    try {
        const { ID } = req.body; 

        if (!ID) {
            return res.status(400).send('Patient ID is required');
        }

        await PatientModel.sendToCredit(ID);

        res.json({ success: true, message: 'Patient sent to Credit for review.' });

    } catch (error) {
        console.error('Controller Error:', error);
        res.status(500).send('Database Error');
    }
},
    getDoctors: async (req, res) => {
            try {
                const doctors = await PatientModel.getDoctors();
                res.json(doctors || []); 
            } catch (error) {
                console.error('Error fetching doctors:', error);
                res.status(500).json({
                    message: 'Failed to fetch doctor list',
                    error: error.message
                });
            }
},

    getHMO: async (req, res) => {
            try {
                const hmo = await PatientModel.getHMO();
                res.json(hmo || []); 
            } catch (error) {
                console.error('Error fetching HMO:', error);
                res.status(500).json({
                    message: 'Failed to fetch HMO list',
                    error: error.message
                });
            }
},

    fetchAssessmentDetails: async (req, res) => {
    try {
        const { caseno } = req.params;

        if (!caseno) {
            return res.status(400).json({ 
                success: false, 
                message: "Case number is required." 
            });
        }

        const patientDetails = await PatientModel.getAssessmentDetailsByCaseno(caseno);

        if (!patientDetails) {
            return res.status(404).json({ 
                success: false, 
                message: "Patient assessment details not found." 
            });
        }

        return res.status(200).json(patientDetails);

    } catch (error) {
        console.error("Error fetching assessment details:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error.", 
            error: error.message 
        });
    }
},

    approvePatient: async (req, res) => {
    // FIX: Destructure both fields from req.body
    const { CASENO, approvedBy } = req.body;

    // Check both to be safe
    if (!CASENO || !approvedBy) {
        return res.status(400).json({ 
            message: "Case Number (CASENO) and Approved By are required." 
        });
    }

    try {
        // FIX: Pass both arguments to your model
        const rowsAffected = await PatientModel.approvePatient(CASENO, approvedBy);

        if (rowsAffected === 0) {
            return res.status(404).json({ message: "Record with this Case Number not found." });
        }

        res.status(200).json({ message: "Patient successfully admitted." });
    } catch (err) {
        console.error("Admit Patient Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
    },
    disapprovePatient: async (req, res) => {
        const { CASENO } = req.body;

        if (!CASENO) {
            return res.status(400).json({ message: "Case Number (CASENO) is required." });
        }

        try {
            const rowsAffected = await PatientModel.disapprovePatient(CASENO);

            if (rowsAffected === 0) {
                return res.status(404).json({ message: "Record with this Case Number not found." });
            }

            res.status(200).json({ message: "Patient declined admission." });
        } catch (err) {
            console.error("Admit Patient Error:", err);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    },

};

module.exports = PatientController;