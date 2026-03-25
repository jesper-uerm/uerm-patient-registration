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
        const { patientId, formData, reviewedBy } = req.body;

        if (!patientId || !formData) {
            return res.status(400).json({ success: false, message: "Missing patientId or form data." });
        }

        const ptData = formData.patientSourceOfIncome || {};
        const cpData = formData.ContactPersonSourceOfIncome || {};
        const hmo = formData.hmoForm || {};

        const updateData = {
            ptSourceIncome: ptData.sourceOfIncome,
            specificSourceOfIncome: ptData.sourceOfIncome === 'Others' ? ptData.specificSourceOfIncome : null,
            ptGrossIncome: ptData.pt_gross_income ? JSON.stringify(ptData.pt_gross_income) : null,
            ptHomeOwnership: ptData.pt_home_ownership ? JSON.stringify(ptData.pt_home_ownership) : null,
            ptYearsStay: ptData.pt_years_of_stay ? JSON.stringify(ptData.pt_years_of_stay) : null,
            ptCars: ptData.pthasCar,
            ptCarOwnership: ptData.pthasCar === 'yes' ? ptData.carOwnership : null,
            ptNumberOfCars: ptData.pthasCar === 'yes' ? String(ptData.numberOfCars) : null,

            cpIncomeSource: cpData.sourceOfIncomeContactPerson,
            cpSpecificSourceIncome: cpData.sourceOfIncomeContactPerson === 'Others' ? cpData.specificSourceOfIncomeContactPerson : null,
            cpGrossIncome: cpData.cp_gross_income ? JSON.stringify(cpData.cp_gross_income) : null,
            cpHomeOwnership: cpData.cp_home_ownership ? JSON.stringify(cpData.cp_home_ownership) : null,
            cpHomeStay: cpData.cp_years_of_stay ? JSON.stringify(cpData.cp_years_of_stay) : null,
            cpHasCar: cpData.cphasCar,
            cpCarOwnership: cpData.cphasCar === 'yes' ? cpData.cpcarOwnership : null,
            cpNumberOfCars: cpData.cphasCar === 'yes' ? String(cpData.cpnumberOfCars) : '0',

            modeOfPayment: ptData.mop,
            specificModeOfPayment: ptData.mop === 'Others' ? ptData.specificmop : null,
            creditCards: String(ptData.creditCard || 0),
            bankAffiliations: ptData.bank,

            hmoName: hmo.hmoName,
            hmoMemberId: hmo.hmomemberId,
            hmoValidityDate: hmo.hmovalidityDate || null,
            hmoStaffName: hmo.hmoStaff,
            hmoApprovalDate: hmo.hmoDateTime || null,
            desiredRoom: hmo.desiredRoom,
            informedIncrement: hmo.informedIncrement
        };

        await PatientModel.updatePatientDetails(patientId, updateData, reviewedBy);

        res.status(200).json({ success: true, message: "Patient details updated successfully." });

    } catch (error) {
        console.error("Update Details Error:", error);
        res.status(500).json({ success: false, message: "Server error while updating details." });
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

            if (!query || query.trim() === '') {
                return res.status(200).json([]);
            }

            const results = await PatientModel.searchFinanceRecord(query.trim());

            res.status(200).json(results);

        } catch (err) {
            console.error("Search Error:", err);
            res.status(500).json({ message: "Database error", error: err.message });
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

};

module.exports = PatientController;