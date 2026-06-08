const PatientModel = require("../models/patientModel");

const PatientController = {

    register: async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({
                    message: "Invalid Request: Body is missing.",
                });
            }

            const body = req.body;

            const getValue = (val) => {
                if (typeof val === "object" && val !== null) {
                    return val.NAME || val.Name || val.name || val.DESCRIPTION || val.description || 
                            val.CODE || val.Code || val.code || val.value || "";
                }
                return val;
            };

            const rawProvince = body.selectedProvince || body.selectedProvinceOutpatient;
            let province = getValue(rawProvince) || "";

            if (province === "NCR" || province === "N/A (NCR)") {
                province = "NCR";
            }

            const determinedPatientType = body.patientType || 
                (body.lastNameOutpatient ? "OUTPATIENT" : "INPATIENT");

            let formattedPhilhealth = body.philhealth || body.outpatientPhilHealth || "";
            if (Array.isArray(formattedPhilhealth)) {
                formattedPhilhealth = formattedPhilhealth.join(", ");
            }

            const patientData = {
                empCode: body.empCode || null,
                patientNo: body.patientNo || body.patientNoOutpatient || null,
                
                lastName: body.lastName || body.lastNameOutpatient || "",
                firstName: body.firstName || body.firstNameOutpatient || "",
                middleName: body.middleName || body.middleNameOutpatient || "",
                suffix: body.suffix || body.suffixOutpatient || "",
                
                birthdate: body.birthdate || body.birthdateOutpatient || null,
                age: body.age || body.ageOutpatient || null,
                birthplace: body.birthplace || body.birthplaceOutpatient || "",
                gender: getValue(body.gender) || getValue(body.genderOutpatient) || "",
                civilStatus: getValue(body.civilStatus) || getValue(body.civilStatusOutpatient) || "",
                religion: getValue(body.religion) || getValue(body.religionOutpatient) || "",
                nationality: body.nationality || body.nationalityOutpatient || "",
                
                philhealthId: formattedPhilhealth, 
                govId: body.govId || body.hmoOutpatient || "", 
                seniorId: body.seniorId || body.scidnoOutpatient || "",
                pwdId: body.pwdId || "",
                pwdIdExp: body.pwdIdExp || null,
                
                street: body.streetName || body.streetNameOutpatient || "",
                region: getValue(body.selectedRegion) || getValue(body.selectedRegionOutpatient) || "",
                province: province,
                city: getValue(body.selectedCity) || getValue(body.selectedCityOutpatient) || "",
                barangay: getValue(body.selectedBarangay) || getValue(body.selectedBarangayOutpatient) || "",
                
                landline: body.landline || body.landlineOutpatient || "",
                mobile: body.mobile || body.mobileOutpatient || "",
                email: body.email || "",
                
                occupation: body.occupation || body.occupationOutpatient || "",
                employer: body.employer || "",
                employerAddress: body.employerAddress || "",
                employerContactNo: body.employerContactNo || "",
                
                father: body.fathersName || "",
                fatherAddress: body.fathersAddress || "",
                fatherContact: body.fatherContactNumber || "",
                mother: body.mothersName || "",
                motherAddress: body.mothersAddress || "",
                motherContact: body.motherContactNumber || "",
                sameAsFather: body.sameAsFather || false,
                
                spouseName: body.spouseName || "",
                spouseAddress: body.spouseAddress || "",
                spouseContact: body.spouseContact || "",
                spouseOccupation: body.spouseOccupation || "",
                
                cpName: body.contactPersonInpatient || body.contactPersonOutpatient || "",
                cpRelationship: getValue(body.contactPersonInpatientRelationship) || getValue(body.contactPersonRelationship) || "",
                cpAddress: body.contactPersonInpatientAddress || body.permanentAddressOutpatient || "",
                cpMobile: body.contactPersonInpatientMobile || body.contactPersonNumberOutpatient || "",
                
                procedure: body.outpatientProcedure || "",
                physician: body.outpatientPhysician || "",

                patientType: determinedPatientType,
                signature: body.signature || null,
            };

            if (!patientData.lastName?.trim()) {
                return res.status(400).json({
                    message: "Last name is required.",
                });
            }

            if (!patientData.firstName?.trim()) {
                return res.status(400).json({
                    message: "First name is required.",
                });
            }

            const result = await PatientModel.upsertPatient(patientData);

            res.status(200).json({
                message:
                    result.status === "UPDATED"
                        ? "User record updated successfully"
                        : "User registered successfully",
                patientId: result.patientId,
                action: result.status,
            });

        } catch (err) {
            console.error("Register Error:", err);

            if (err.number === 2627) {
                return res.status(409).json({
                    message: "Database constraint error (Duplicate key).",
                });
            }

            res.status(500).json({
                message: "Server error: " + err.message,
            });
        }
    },
    
    // updateDetails: async (req, res) => {
    //     try {
    //         const { caseno, patientno, formData, reviewedBy } = req.body;

    //         if (!caseno || !patientno || !formData) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Missing CASENO, PATIENTNO or form data.",
    //             });
    //         }

    //         await PatientModel.upsertPatientCredit(
    //             caseno,
    //             patientno,
    //             formData,
    //             reviewedBy,
    //         );

    //         res.status(200).json({
    //             success: true,
    //             message: "Patient credit details saved successfully.",
    //         });
    //     } catch (error) {
    //         console.error("Update Details Error:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: "Server error while updating details.",
    //         });
    //     }
    // },

    updateDetails: async (req, res) => {
    try {
        const { patientno, formData, reviewedBy } = req.body;

        if (!patientno || !formData) {
            return res.status(400).json({
                success: false,
                message: "Missing PATIENTNO or form data.",
            });
        }

        await PatientModel.upsertPatientCredit(
            patientno,
            formData,
            reviewedBy,
        );

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

            if (!id || id === "undefined" || id === "null") {
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
                return res
                    .status(400)
                    .json({ message: "Error: The Patient ID is too large." });
            }
            res.status(500).json({ message: "Database error" });
        }
    },

    checkExists: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || id === "undefined" || id === "null") {
                return res.status(400).json({ error: "Invalid Patient ID provided" });
            }

            const result = await PatientModel.checkPatientExists(id);

            return res.status(200).json(result);
        } catch (error) {
            console.error("Check Error:", error);
            return res.status(500).json({ error: "Check failed" });
        }
    },

    linkPatient: async (req, res) => {
        try {
            const { PATIENTREGID, patientno } = req.body;

            if (!PATIENTREGID || !patientno) {
                return res
                    .status(400)
                    .json({ message: "Missing Patient ID or Matched Hospital No." });
            }

            await PatientModel.linkPatientRecord(PATIENTREGID, patientno);

            res.status(200).json({
                message:
                    "Patient successfully linked.",
                position: "top",

            });
        } catch (err) {
            console.error("Link Error:", err);
            res.status(500).json({ message: "Linking failed", error: err.message });
        }
    },

    sendDataInfo: async (req, res) => {
        try {
            const { PATIENTREGID, force } = req.body;

            if (!PATIENTREGID) {
                return res.status(400).json({ message: "Patient ID is required" });
            }

            const result = await PatientModel.transferPatientInfo(
                PATIENTREGID,
                force,
            );

            if (result.status === "NOT_FOUND") {
                return res
                    .status(404)
                    .json({ message: "Patient not found in Registration records." });
            }

            if (result.status === "DUPLICATE") {
                return res.status(409).json(result.matches);
            }

            if (result.status === "SUCCESS") {
                return res.status(200).json({
                    message: "Patient data successfully transferred and linked!",
                });
            }
        } catch (err) {
            console.error("Transfer Error:", err);
            if (err.number === 2627) {
                return res.status(409).json({
                    message: "Transfer Failed: Patient ID already exists in destination.",
                });
            }
            res.status(500).json({ message: "Transfer failed", error: err.message });
        }
    },

    
    searchERpatient: async (req, res) => {
        try {
            const { query } = req.query;

            if (!query || query.trim() === "") {
                return res.status(200).json([]);
            }

            const results = await PatientModel.searchErRecords(query.trim());

            res.status(200).json(results);
        } catch (err) {
            console.error("Search Error:", err);
            res.status(500).json({ message: "Database error", error: err.message });
        }
    },

    searchInpatient: async (req, res) => {
        try {
            const { query } = req.query;

            if (!query || query.trim() === "") {
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

            if (!query || query.trim() === "") {
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
                error: err.message,
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
                error: err.message,
            });
        }
    },

    searchReturning: async (req, res) => {
        try {
            const { firstName, lastName, birthdate } = req.query;

            const results = await PatientModel.seachReturningRecords(
                firstName,
                lastName,
                birthdate,
            );

            res.status(200).json(results);
        } catch (err) {
            console.error("Fetch Inpatient Error:", err);
            res.status(500).json({ message: "Database error" });
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

    fetchErList: async (req, res) => {
        try {
            const results = await PatientModel.fetchErListRecords();

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

    
    fetchPatientsForFinance: async (req, res) => {
    try {
        const patients = await PatientModel.fetchPatientsForFinance();

        res.status(200).json(patients);
    } catch (err) {
        console.error("Fetch Review Error:", err);
        res.status(500).json({ message: "Database error: " + err.message });
    }
    },

    fetchErPatientsForFinanceApproval: async (req, res) => {
    try {
        const patients = await PatientModel.fetchErPatientsForFinanceApproval();

        res.status(200).json(patients);
    } catch (err) {
        console.error("Fetch Review Error:", err);
        res.status(500).json({ message: "Database error: " + err.message });
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
                const base64Signature = binaryData.toString("base64");

                let mimeType = "image/png";
                if (base64Signature.startsWith("/9j/")) {
                    mimeType = "image/jpeg";
                }

                const dataUrl = `data:${mimeType};base64,${base64Signature}`;

                return res.status(200).json({ signature: dataUrl });
            } else {
                return res
                    .status(404)
                    .json({ message: "No signature found for this Patient ID" });
            }
        } catch (err) {
            console.error("Signature Fetch Error:", err);
            res.status(500).json({ message: "Server Error" });
        }
    },

    sendToCredit: async (req, res) => {
        try {
            const { PATIENTREGID } = req.body;

            if (!PATIENTREGID) {
                return res.status(400).send("Patient ID is required");
            }

            await PatientModel.sendToCredit(PATIENTREGID);

            res.json({
                success: true,
                message: "Patient sent to Credit for review.",
            });
        } catch (error) {
            console.error("Controller Error:", error);
            res.status(500).send("Database Error");
        }
    },

    getDoctors: async (req, res) => {
        try {
            const doctors = await PatientModel.getDoctors();
            res.json(doctors || []);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            res.status(500).json({
                message: "Failed to fetch doctor list",
                error: error.message,
            });
        }
    },

    getServices: async (req, res) => {
        try {
            const service = await PatientModel.getServices();
            res.json(service || []);
        } catch (error) {
            console.error("Error fetching services:", error);
            res.status(500).json({
                message: "Failed to fetch service list",
                error: error.message,
            });
        }
    },

    getDepartment: async (req, res) => {
        try {
            const service = await PatientModel.getDepartment();
            res.json(service || []);
        } catch (error) {
            console.error("Error fetching department:", error);
            res.status(500).json({
                message: "Failed to fetch department list",
                error: error.message,
            });
        }
    },

    getHMO: async (req, res) => {
        try {
            const hmo = await PatientModel.getHMO();
            res.json(hmo || []);
        } catch (error) {
            console.error("Error fetching HMO:", error);
            res.status(500).json({
                message: "Failed to fetch HMO list",
                error: error.message,
            });
        }
    },

    getRooms: async (req, res) => {
        try {
            const room = await PatientModel.getRooms();
            res.json(room || []);
        } catch (error) {
            console.error("Error fetching Rooms:", error);
            res.status(500).json({
                message: "Failed to fetch Room list",
                error: error.message,
            });
        }
    },

    getRegion: async (req, res) => {
        try {
            const room = await PatientModel.getRegion();
            res.json(room || []);
        } catch (error) {
            console.error("Error fetching Region:", error);
            res.status(500).json({
                message: "Failed to fetch Region list",
                error: error.message,
            });
        }
    },

    getProvince: async (req, res) => {
        try {
            const { regionPrefix } = req.query; 
            if (!regionPrefix) {
                return res.status(400).json({ message: "regionPrefix query parameter is required" });
            }
            const provinces = await PatientModel.getProvince(regionPrefix);
            res.json(provinces || []);
        } catch (error) {
            console.error("Error fetching Province:", error);
            res.status(500).json({
                message: "Failed to fetch Province list",
                error: error.message,
            });
        }
    },

    getMunicipality: async (req, res) => {
        try {
            const { cityPrefix } = req.query; 
            if (!cityPrefix) {
                return res.status(400).json({ message: "cityPrefix query parameter is required" });
            }
            
            const cities = await PatientModel.getMunicipality(cityPrefix);
            res.json(cities || []);
        } catch (error) {
            console.error("Error fetching Cities/Municipalities:", error);
            res.status(500).json({
                message: "Failed to fetch City/Municipality list",
                error: error.message,
            });
        }
    },

//     getBarangays: async (req, res) => {
//     try {
//         const { search } = req.query;
//         if (!search) {
//             return res.status(400).json({ message: "Search parameter is required" });
//         }

//         const barangays = await PatientModel.getBarangays(search);
//         res.json(barangays || []);
//     } catch (error) {
//         console.error("Error searching Barangays:", error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// },

    // fetchAssessmentDetails: async (req, res) => {
    //     try {
    //         const { caseno } = req.params;

    //         if (!caseno) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Case number is required.",
    //             });
    //         }

    //         const patientDetails =
    //             await PatientModel.getAssessmentDetailsByCaseno(caseno);

    //         if (!patientDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Patient assessment details not found.",
    //             });
    //         }

    //         return res.status(200).json(patientDetails);
    //     } catch (error) {
    //         console.error("Error fetching assessment details:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: "Internal server error.",
    //             error: error.message,
    //         });
    //     }
    // },

    fetchAssessmentDetails: async (req, res) => {
    try {
        const { patientno } = req.params;

        if (!patientno) {
            return res.status(400).json({
                success: false,
                message: "Patient number is required.",
            });
        }

        const patientDetails =
            await PatientModel.getAssessmentDetailsByPatientno(patientno);

        if (!patientDetails) {
            return res.status(404).json({
                success: false,
                message: "Patient assessment details not found.",
            });
        }

        return res.status(200).json(patientDetails);
    } catch (error) {
        console.error("Error fetching assessment details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message,
        });
    }
},

    approvePatient: async (req, res) => {
        const { PATIENTNO, approvedBy } = req.body;

        if (!PATIENTNO || !approvedBy) {
            return res.status(400).json({
                message: "Patient Number and Approved By are required.",
            });
        }

        try {
            const rowsAffected = await PatientModel.approvePatient(
                PATIENTNO,
                approvedBy,
            );

            if (rowsAffected === 0) {
                return res
                    .status(404)
                    .json({ message: "Record with this Patient Number not found." });
            }

            res.status(200).json({ message: "Patient successfully admitted." });
        } catch (err) {
            console.error("Admit Patient Error:", err);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    },

    disapprovePatient: async (req, res) => {
        const { PATIENTNO } = req.body;

        if (!PATIENTNO) {
            return res
                .status(400)
                .json({ message: "Patient Number is required." });
        }

        try {
            const rowsAffected = await PatientModel.disapprovePatient(PATIENTNO);

            if (rowsAffected === 0) {
                return res
                    .status(404)
                    .json({ message: "Record with this Patient Number not found." });
            }

            res.status(200).json({ message: "Patient declined admission." });
        } catch (err) {
            console.error("Admit Patient Error:", err);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    },
};

module.exports = PatientController;
