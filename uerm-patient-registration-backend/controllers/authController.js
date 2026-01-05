const { sql } = require('../config/db');

exports.register = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Invalid Request: Body is missing." });
    }
    const body = req.body;
    
    const getValue = (val) => (typeof val === 'object' && val !== null ? val.name : val);

    const street = body.streetName || body.streetNameOutpatient || '';
    const brgy   = getValue(body.selectedBarangay) || getValue(body.selectedBarangayOutpatient) || '';
    const city   = getValue(body.selectedCity)     || getValue(body.selectedCityOutpatient)     || '';
    const region = getValue(body.selectedRegion)   || getValue(body.selectedRegionOutpatient)   || '';
    
    let province = getValue(body.selectedProvince) || getValue(body.selectedProvinceOutpatient) || '';
    if (province === 'NCR' || province === 'N/A (NCR)') {
        province = '';
    }

    const fullPresentAddress = [street, brgy, city, province, region]
        .filter(Boolean)
        .join(', ')
        .toUpperCase();

    const p = {
        lastName: body.lastName || body.lastNameOutpatient,
        firstName: body.firstName || body.firstNameOutpatient,
        middleName: body.middleName || body.middleNameOutpatient,
        age: body.age ?? body.ageOutpatient,
        gender: body.gender || body.genderOutpatient,
        civilStatus: body.civilStatus || body.civilStatusOutpatient,
        religion: body.religion || body.religionOutpatient,
        landline: body.landline || body.landlineOutpatient,
        mobile: body.mobile || body.mobileOutpatient,
        birthdate: (body.birthdate || body.birthdateOutpatient) ? new Date(body.birthdate || body.birthdateOutpatient) : null,
        birthplace: body.birthplace || body.birthplaceOutpatient,
        nationality: body.nationality || body.nationalityOutpatient,
        permanentAddress: body.permanentAddress || body.permanentAddressOutpatient,
        cpName: body.contactPersonInpatient || body.contactPersonOutpatientOutpatient, 
        cpRelationship: body.contactPersonInpatientRelationship || body.contactPersonRelationshipOutpatient, 
        patientType: body.patientType || '',
        signature: body.signature || body.signatureOutpatient,
    };

    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        request
            .input('lastName', sql.NVarChar, p.lastName)
            .input('firstName', sql.NVarChar, p.firstName)
            .input('middleName', sql.NVarChar, p.middleName)
            .input('age', sql.Int, p.age)
            .input('gender', sql.NVarChar, p.gender)
            .input('civilStatus', sql.NVarChar, p.civilStatus)
            .input('religion', sql.NVarChar, p.religion)
            .input('landline', sql.NVarChar, p.landline)
            .input('mobile', sql.NVarChar, p.mobile)
            .input('email', sql.NVarChar, body.email)
            .input('birthdate', sql.Date, p.birthdate)      
            .input('birthplace', sql.NVarChar, p.birthplace)
            .input('nationality', sql.NVarChar, p.nationality)
            .input('presentAddress', sql.NVarChar, fullPresentAddress)
            .input('permanentAddress', sql.NVarChar, p.permanentAddress)
            
            .input('fathersName', sql.NVarChar, body.fathersName)
            .input('fathersAddress', sql.NVarChar, body.fathersAddress)
            .input('fatherContactNumber', sql.NVarChar, body.fatherContactNumber)
            .input('mothersName', sql.NVarChar, body.mothersName)
            .input('mothersAddress', sql.NVarChar, body.mothersAddress)
            .input('motherContactNumber', sql.NVarChar, body.motherContactNumber)
            
            .input('ptSourceIncome', sql.NVarChar, body.sourceOfIncome)
            .input('specificSourceOfIncome', sql.NVarChar, body.specificSourceOfIncome)
            .input('seniorpwd', sql.NVarChar, body.seniorpwd || body.scidnoOutpatient) 
            .input('sssgsis', sql.NVarChar, body.sssgsis)
            .input('philhealthId', sql.NVarChar, body.philhealthId)
            .input('tin', sql.NVarChar, body.tin)
            .input('others', sql.NVarChar, body.others)
            
            .input('ptGrossIncome', sql.NVarChar, body.pt_gross_income ? JSON.stringify(body.pt_gross_income) : null)
            .input('ptHomeOwnership', sql.NVarChar, body.pt_home_ownership ? JSON.stringify(body.pt_home_ownership) : null)
            .input('ptYearsStay', sql.NVarChar, body.pt_years_of_stay ? JSON.stringify(body.pt_years_of_stay) : null)
            .input('spouseName', sql.NVarChar, body.spouseName)
            .input('spouseOccupation', sql.NVarChar, body.spouseOccupation)
            .input('spouseEmployerContact', sql.NVarChar, body.spouseEmployerContact)
            .input('ptCars', sql.NVarChar, body.pthasCar)
            .input('ptCarOwnership', sql.NVarChar, body.carOwnership)

            .input('cpName', sql.NVarChar, p.cpName)
            .input('cpRelationship', sql.NVarChar, p.cpRelationship)
            .input('cpLandline', sql.NVarChar, body.contactPersonInpatientLandline)
            .input('cpMobile', sql.NVarChar, p.cpNumber) 
            .input('cpEmail', sql.NVarChar, body.contactPersonInpatientEmail)
            .input('cpAddress', sql.NVarChar, body.contactPersonInpatientAddress)
            .input('cpOccupation', sql.NVarChar, body.contactPersonInpatientOccupation)
            .input('cpEmployerNumber', sql.NVarChar, body.contactPersonInpatientEmployerNumber)
            .input('cpEmployerAddress', sql.NVarChar, body.contactPersonInpatientEmployerNameAddress)
            .input('cpIncomeSource', sql.NVarChar, body.contactPersonInpatientIncome ? JSON.stringify(body.contactPersonInpatientIncome) : null)
            .input('cpGrossIncome', sql.NVarChar, body.contactPersonInpatientGross ? JSON.stringify(body.contactPersonInpatientGross) : null)
            .input('cpHomeOwnership', sql.NVarChar, body.contactPersonInpatientHome ? JSON.stringify(body.contactPersonInpatientHome) : null)
            .input('cpHomeStay', sql.NVarChar, body.contactPersonInpatientHomeStay ? JSON.stringify(body.contactPersonInpatientHomeStay) : null)
            .input('cpHasCar', sql.NVarChar, body.contactPersonInpatienthasCar)
            .input('cpCarOwnership', sql.NVarChar, body.contactPersonInpatientcarOwnership)
            .input('cpNumberOfCars', sql.NVarChar, body.contactPersonInpatientnumberOfCars)

            .input('mop', sql.NVarChar, body.mop)
            .input('specificmop', sql.NVarChar, body.specificmop)
            .input('creditCard', sql.NVarChar, body.creditCard)
            .input('bank', sql.NVarChar, body.bank)
            .input('items', sql.NVarChar, body.items ? JSON.stringify(body.items) : null)

            .input('patientType', sql.NVarChar, p.patientType)
            .input('hmo', sql.NVarChar, body.hmoOutpatient)
            .input('scidnoOutpatient', sql.NVarChar, body.scidnoOutpatient)
            .input('philHealth', sql.NVarChar, body.outpatientPhilHealth ? JSON.stringify(body.outpatientPhilHealth) : null) 
            .input('medicalProcedure', sql.NVarChar, body.outpatientProcedure) 
            .input('physician', sql.NVarChar, body.outpatientPhysician);

        const patientResult = await request.query(`
            INSERT INTO PatientRegistration (
                lastName, firstName, middleName, birthdate, age, birthplace, sex, 
                civilStatus, religion, nationality, landline, mobile, email, 
                addressPresent, addressPermanent, ptFatherName, ptFatherAddress, 
                ptFatherContact, ptMotherMaidenNam, ptMotherAddress, ptMotherContact, 
                ptSourceIncome, specificSourceOfIncome, seniorId, philhealthId,
                sssgsisId, tinID, others, ptGrossIncome, ptHomeOwnership,
                ptYearsStay, spouseName, spouseOccupation,spouseEmployerContact, ptCars, 
                ptCarOwnership, cpName, cpRelationship, cpLandline, cpMobile, cpEmail,
                cpAddress, cpOccupation, cpEmployerNumber, cpEmployerNameAddress,
                cpIncomeSource, cpGrossIncome, cpHomeOwnership, cpHomeStay,
                cpHasCar, cpCarOwnership, cpNumberOfCars, modeOfPayment, specificModeOfPayment, creditCards, 
                bankAffiliations, itemsReceived, patientType, hmo, scidnoOutpatient, philHealth, medicalProcedure, physician
            )
            OUTPUT INSERTED.patient_id 
            VALUES (
                @lastName, @firstName, @middleName, @birthdate, @age, @birthplace, @gender,
                @civilStatus, @religion, @nationality, @landline, @mobile, @email,
                @presentAddress, @permanentAddress, @fathersName, @fathersAddress,
                @fatherContactNumber, @mothersName, @mothersAddress, @motherContactNumber,
                @ptSourceIncome, @specificSourceOfIncome, @seniorpwd, @philhealthId,
                @sssgsis, @tin, @others, @ptGrossIncome, @ptHomeOwnership,
                @ptYearsStay, @spouseName, @spouseOccupation,@spouseEmployerContact, @ptCars,
                @ptCarOwnership, @cpName, @cpRelationship, @cpLandline, @cpMobile, @cpEmail,
                @cpAddress, @cpOccupation, @cpEmployerNumber, @cpEmployerNameAddress,
                @cpIncomeSource, @cpGrossIncome, @cpHomeOwnership, @cpHomeStay, @cpHasCar, 
                @cpCarOwnership, @cpNumberOfCars, @mop, @specificmop, @creditCard, @bank, @items, @patientType, @hmo, @scidnoOutpatient, @philHealth, @medicalProcedure, @physician
            )
        `);

        const newPatientID = patientResult.recordset[0]?.patient_id;

        if (p.signature && newPatientID) {
            try {
                const cleanSignature = p.signature.replace(/^data:image\/\w+;base64,/, "");
                const finalSignatureBuffer = Buffer.from(cleanSignature, 'base64');
                
                const signRequest = new sql.Request(transaction); 
                signRequest.input('pId', sql.Int, newPatientID);
                signRequest.input('signData', sql.VarBinary(sql.MAX), finalSignatureBuffer);

                await signRequest.query(`
                    INSERT INTO ptSignature (patient_id, eSignature)
                    VALUES (@pId, @signData)
                `);
            } catch (sigError) {
                throw sigError; 
            }
        }

        await transaction.commit(); 

        res.status(201).json({ 
            message: "User registered successfully", 
            patientId: newPatientID 
        });

    } catch (err) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error("Rollback failed:", rollbackErr);
            }
        }

        console.error("Register Error:", err);
        if (err.number === 2627) { 
            return res.status(409).json({ message: "Email or Unique record already exists" });
        }
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

exports.registerTriage = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Invalid Request: Body is missing." });
    }
    const body = req.body;

    const t = {
        lastName: body.lastNameTriage,
        firstName: body.firstNameTriage,
        middleName: body.middleNameTriage,
        birthdate: body.birthdateTriage ? new Date(body.birthdateTriage) : null,
        age: body.ageTriage,
        gender: body.genderTriage,
        patientType: body.patientType,

        // chiefComplaint: body.chiefComplaintTriage,
        // temp: body.tempTriage,
        // heartRate: body.heartRateTriage,
        // oxygen: body.oxygenTriage,
        // bp: body.bpTriage,
        // respiRate: body.respiRateTriage,
        // painScore: body.painScoreTriage,
        
        // avpu: body.avpuTriage,
        // contagious: body.contagiousTriage,
        // isolation: body.isolationPrecautionTriage,
        // cpd: body.cpdTriage,
        // level: body.levelTriage,
        
        personnel: body.personnelTriage,
        dateAccomplished: body.dateTriage ? new Date(body.dateTriage) : new Date()
    };

    try {
        const pool = await sql.connect();
        const request = new sql.Request(pool); 

        request
            .input('lastName', sql.NVarChar, t.lastName)
            .input('firstName', sql.NVarChar, t.firstName)
            .input('middleName', sql.NVarChar, t.middleName)
            .input('birthdate', sql.Date, t.birthdate)
            .input('age', sql.Int, t.age)
            .input('gender', sql.NVarChar, t.gender)
            .input('patientType', sql.NVarChar, t.patientType)

            
            // .input('chiefComplaint', sql.NVarChar, t.chiefComplaint)
            // .input('temp', sql.Decimal(4, 1), t.temp)     
            // .input('heartRate', sql.Int, t.heartRate)
            // .input('oxygen', sql.Decimal(5, 2), t.oxygen)  
            // .input('bp', sql.NVarChar, t.bp)
            // .input('respiRate', sql.Int, t.respiRate)
            // .input('painScore', sql.Int, t.painScore)
            
            // .input('avpu', sql.NVarChar, t.avpu)
            // .input('contagious', sql.NVarChar, t.contagious)
            // .input('isolation', sql.NVarChar, t.isolation)
            // .input('cpd', sql.NVarChar, t.cpd)
            // .input('level', sql.NVarChar, t.level)
            
            // .input('personnel', sql.NVarChar, t.personnel)
            // .input('dateAccomplished', sql.Date, t.dateAccomplished);

        const result = await request.query(`
            INSERT INTO PatientRegistration (
                lastName, firstName, middleName, birthdate, age, sex, patientType
            )
            OUTPUT INSERTED.patient_id
            VALUES (
                @lastName, @firstName, @middleName, @birthdate, @age, @gender, @patientType
            )
        `);

        const patientId = result.recordset[0]?.patient_id;
        
        res.status(201).json({ 
            message: "Triage assessment saved successfully", 
            triageId: patientId 
        });

    } catch (err) {
        console.error("Triage Save Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

exports.searchInpatient = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query) {
            return res.status(400).json({ message: "Search query required" });
        }

        const pool = await sql.connect();
        
        const result = await pool.request()
            .input('search', sql.NVarChar, `%${query}%`) 
            .input('exactId', sql.Int, isNaN(query) ? 0 : parseInt(query)) 
            .query(`
                SELECT TOP 20 
                    patient_id, 

                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    

                    lastName, 
                    firstName, 
                    ISNULL(middleName, '') as middleName, 
                    
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdate,
                    
                    age,
                    sex as gender, 
                    civilStatus,
                    nationality,
                    addressPresent,
                    mobile,
                    email,
                    createdAt,
                    patientType,
                    physician
                FROM PatientRegistration
                WHERE 
                    (
                    lastName LIKE @search 
                    OR firstName LIKE @search
                    OR patient_id = @exactId
                    )
                    AND patientType = 'Inpatient'
                ORDER BY lastName, firstName
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchInpatient = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
                SELECT TOP 100 
                    patient_id,
                    
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                        
                    lastName, 
                    firstName, 
                    ISNULL(middleName, '') as middleName, 
                    
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdate,
                    age,
                    sex as gender, 
                    civilStatus,
                    nationality,
                    addressPresent,
                    mobile,
                    email,
                    createdAt,
                    patientType,
                    physician
                FROM PatientRegistration
                WHERE 
                    patientType = 'Inpatient' 
                ORDER BY createdAt DESC
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.searchOutpatient = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query) {
            return res.status(400).json({ message: "Search query required" });
        }

        const pool = await sql.connect();
        
        const result = await pool.request()
            .input('search', sql.NVarChar, `%${query}%`) 
            .input('exactId', sql.Int, isNaN(query) ? 0 : parseInt(query)) 
            .query(`
                SELECT TOP 20 
                    patient_id, 

                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    

                    lastName, 
                    firstName, 
                    ISNULL(middleName, '') as middleName, 
                    
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdate,
                    
                    age,
                    sex as gender, 
                    civilStatus,
                    nationality,
                    addressPresent,
                    mobile,
                    email,
                    createdAt,
                    patientType,
                    physician
                FROM PatientRegistration
                WHERE 
                    (
                    lastName LIKE @search 
                    OR firstName LIKE @search
                    OR patient_id = @exactId
                    )
                    AND patientType = 'Outpatient'
                ORDER BY lastName, firstName
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.searchErpatient = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query) {
            return res.status(400).json({ message: "Search query required" });
        }

        const pool = await sql.connect();
        
        const result = await pool.request()
            .input('search', sql.NVarChar, `%${query}%`) 
            .input('exactId', sql.Int, isNaN(query) ? 0 : parseInt(query)) 
            .query(`
                SELECT TOP 20 
                    patient_id, 

                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    

                    lastName, 
                    firstName, 
                    ISNULL(middleName, '') as middleName, 
                    
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdate,
                    
                    age,
                    sex as gender, 
                    civilStatus,
                    nationality,
                    addressPresent,
                    mobile,
                    email,
                    createdAt,
                    patientType,
                    physician
                FROM PatientRegistration
                WHERE 
                    (
                    lastName LIKE @search 
                    OR firstName LIKE @search
                    OR patient_id = @exactId
                    )
                    AND patientType = 'Emergency'
                ORDER BY lastName, firstName
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchOutpatient = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
                SELECT TOP 100 
                    patient_id,
                    
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                        
                    lastName, 
                    firstName, 
                    ISNULL(middleName, '') as middleName, 
                    
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdate,
                    age,
                    sex as gender, 
                    civilStatus,
                    nationality,
                    addressPresent,
                    mobile,
                    email,
                    createdAt,
                    patientType,
                    physician
                FROM PatientRegistration
                WHERE 
                    patientType = 'Outpatient' 
                ORDER BY createdAt DESC
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchErpatient = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
                SELECT TOP 100 
                    patient_id,
                    
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                        
                    lastName, 
                    firstName, 
                    ISNULL(middleName, '') as middleName, 
                    
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdate,
                    age,
                    sex as gender, 
                    civilStatus,
                    nationality,
                    addressPresent,
                    mobile,
                    email,
                    createdAt,
                    patientType,
                    physician
                FROM PatientRegistration
                WHERE 
                    patientType = 'Emergency' 
                ORDER BY createdAt DESC
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchPieChartData = async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .query(`
                SELECT 
                    patientType, 
                    COUNT(*) as total
                FROM PatientRegistration
                WHERE patientType IS NOT NULL
                GROUP BY patientType
            `);

        const labels = result.recordset.map(row => row.patientType);
        const series = result.recordset.map(row => row.total);

        res.status(200).json({
            labels: labels, 
            series: series  
        });

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchLineChartData = async (req, res) => {
    try {
            const pool = await sql.connect();
            const result = await pool.request().query(`
        SELECT 
            FORMAT(createdAt, 'yyyy-MM') as period,
            patientType as type,
            COUNT(*) as total
        FROM PatientRegistration
        WHERE createdAt IS NOT NULL
        GROUP BY FORMAT(createdAt, 'yyyy-MM'), patientType
        ORDER BY period ASC
    `);

    const rawData = result.recordset;

    const periods = Array.from(new Set(rawData.map(item => item.period))).sort();

    const seriesMap = {
        'Inpatient': new Array(periods.length).fill(0),
        'Outpatient': new Array(periods.length).fill(0), 
        'Emergency':       new Array(periods.length).fill(0)
    };

    rawData.forEach(row => {
        const periodIndex = periods.indexOf(row.period);
        if (seriesMap[row.type]) {
            seriesMap[row.type][periodIndex] = row.total;
        }
    });

    res.json({
        categories: periods, 
        series: [
            { name: 'Admitted', data: seriesMap['Inpatient'] },
            { name: 'OPD',      data: seriesMap['Outpatient'] }, 
            { name: 'ER',       data: seriesMap['Emergency'] }
        ]
    });

        } catch (err) {
            console.error("Trend Error:", err);
            res.status(500).send("Server Error");
        }
    };

exports.fetchAllPatient = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
                SELECT TOP 1000 
                    patient_id,
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                    lastName, 
                    firstName, 
                    ISNULL(middleName, '') as middleName, 
                    patientType,
                    FORMAT(createdAt, 'yyyy-MM-dd') as createdAt
                FROM PatientRegistration 
                ORDER BY createdAt DESC 
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updatePatientDetails = async (req, res) => {
    try {
        const { patientId, formData } = req.body;

        if (!patientId || !formData) {
            return res.status(400).json({ success: false, message: "Missing patientId or form data." });
        }
        
        const income = formData.patientSourceOfIncome || {};
        const hmo = formData.hmoForm || {};

        const pool = await sql.connect();
        const request = pool.request();


        request.input('patientId', sql.Int, patientId);
        request.input('ptSourceIncome', sql.NVarChar, income.sourceOfIncome);
        request.input('specificSourceOfIncome', sql.NVarChar, income.sourceOfIncome === 'Others' ? income.specificSourceOfIncome : null);
        
        request.input('ptGrossIncome', sql.NVarChar, income.pt_gross_income ? JSON.stringify(income.pt_gross_income) : null);
        request.input('ptHomeOwnership', sql.NVarChar, income.pt_home_ownership ? JSON.stringify(income.pt_home_ownership) : null);
        request.input('ptYearsStay', sql.NVarChar, income.pt_years_of_stay ? JSON.stringify(income.pt_years_of_stay) : null);
        
        request.input('ptCars', sql.NVarChar, income.pthasCar);
        request.input('ptCarOwnership', sql.NVarChar, income.pthasCar === 'yes' ? income.carOwnership : null);
        request.input('ptNumberOfCars', sql.NVarChar, income.pthasCar === 'yes' ? String(income.numberOfCars) : '0');

        request.input('modeOfPayment', sql.NVarChar, income.mop);
        request.input('specificModeOfPayment', sql.NVarChar, income.mop === 'Others' ? income.specificmop : null);
        request.input('creditCards', sql.NVarChar, String(income.creditCard || 0));
        request.input('bankAffiliations', sql.NVarChar, income.bank);

    
        request.input('hmoName', sql.NVarChar, hmo.hmoName);
        request.input('hmoMemberId', sql.NVarChar, hmo.hmomemberId);
        request.input('hmoValidityDate', sql.NVarChar, hmo.hmovalidityDate || null); 
        request.input('hmoStaffName', sql.NVarChar, hmo.hmoStaff);
        request.input('hmoApprovalDate', sql.NVarChar, hmo.hmoDateTime || null); 
        request.input('desiredRoom', sql.NVarChar, hmo.desiredRoom);
        request.input('informedIncrement', sql.NVarChar, hmo.informedIncrement);
        

        const query = `
            UPDATE PatientRegistration
            SET 
                ptSourceIncome = @ptSourceIncome,
                specificSourceOfIncome = @specificSourceOfIncome,
                ptGrossIncome = @ptGrossIncome,
                ptHomeOwnership = @ptHomeOwnership,
                ptYearsStay = @ptYearsStay,
                ptCars = @ptCars,
                ptCarOwnership = @ptCarOwnership,
                ptNumberOfCars = @ptNumberOfCars, 
                modeOfPayment = @modeOfPayment,
                specificModeOfPayment = @specificModeOfPayment,
                creditCards = @creditCards,
                bankAffiliations = @bankAffiliations,
                
                hmo = @hmoName,
                hmoId= @hmoMemberId,
                hmoValidity = @hmoValidityDate,
                hmoStaffName = @hmoStaffName,
                hmoApprovalDate = @hmoApprovalDate,
                desiredRoomAvailable = @desiredRoom,
                informedIncrement = @informedIncrement
                
            WHERE patient_id = @patientId
        `;

        await request.query(query);

        return res.status(200).json({ success: true, message: "Patient details updated successfully." });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ success: false, message: "Server error while updating details." });
    }
};

exports.getInpatientById = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({ message: "Patient ID is required" });
        }

        const pool = await sql.connect();
        
        const result = await pool.request()
            .input('patientId', sql.Int, id) 
            .query(`
                SELECT * FROM PatientRegistration 
                WHERE patient_id = @patientId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json(result.recordset[0]);

    } catch (err) {
        console.error("Fetch One Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};