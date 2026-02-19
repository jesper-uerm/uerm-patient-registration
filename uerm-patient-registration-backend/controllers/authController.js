const { sql } = require('../config/db');
const bcrypt = require('bcryptjs'); 


exports.register = async (req, res) => {
    console.log("Received Signature Length:", req.body.signature?.length);
    if (!req.body) {
        return res.status(400).json({ message: "Invalid Request: Body is missing." });
    }
    const body = req.body;

    const getValue = (val) => (typeof val === 'object' && val !== null ? val.name : val);

    const street = body.streetName || body.streetNameOutpatient || '';
    const brgy = getValue(body.selectedBarangay) || getValue(body.selectedBarangayOutpatient) || '';
    const city = getValue(body.selectedCity) || getValue(body.selectedCityOutpatient) || '';
    const region = getValue(body.selectedRegion) || getValue(body.selectedRegionOutpatient) || '';

    let province = getValue(body.selectedProvince) || getValue(body.selectedProvinceOutpatient) || '';
    if (province === 'NCR' || province === 'N/A (NCR)') {
        province = 'NCR';
    }

    const p = {
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
        occupation: body.occupation || body.occupationOutpatient,
        birthdate: body.birthdate || body.birthdateOutpatient || null,        
        birthplace: body.birthplace || body.birthplaceOutpatient,
        nationality: body.nationality || body.nationalityOutpatient,
        permanentAddress: body.permanentAddress || body.permanentAddressOutpatient,
        cpName: body.contactPersonInpatient || body.contactPersonOutpatient,
        cpRelationship: body.contactPersonInpatientRelationship || body.contactPersonRelationshipOutpatient,
        cpLandline: body.contactPersonInpatientLandline || body.contactPersonLandlineOutpatient,
        cpMobile: body.cpNumber || body.contactPersonNumberOutpatient,
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
            .input('suffix', sql.NVarChar, p.suffix)
            .input('occupation', sql.NVarChar, p.occupation)
            .input('birthdate', sql.NVarChar, p.birthdate)
            .input('birthplace', sql.NVarChar, p.birthplace)
            .input('nationality', sql.NVarChar, p.nationality)

            .input('street', sql.NVarChar, street)
            .input('barangay', sql.NVarChar, brgy)
            .input('city', sql.NVarChar, city)
            .input('province', sql.NVarChar, province)
            .input('region', sql.NVarChar, region)
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
            .input('spouseEmployerName', sql.NVarChar, body.spouseEmployerName)
            .input('spouseEmployerAddress', sql.NVarChar, body.spouseEmployerAddress)
            .input('ptCars', sql.NVarChar, body.pthasCar)
            .input('ptCarOwnership', sql.NVarChar, body.carOwnership)
            .input('cpName', sql.NVarChar, p.cpName)
            .input('cpRelationship', sql.NVarChar, p.cpRelationship)
            .input('cpLandline', sql.NVarChar, p.cpLandline)
            .input('cpMobile', sql.NVarChar, p.cpMobile)
            .input('cpEmail', sql.NVarChar, body.contactPersonInpatientEmail)
            .input('cpAddress', sql.NVarChar, body.contactPersonInpatientAddress)
            .input('cpOccupation', sql.NVarChar, body.contactPersonInpatientOccupation)
            .input('cpEmployerNumber', sql.NVarChar, body.contactPersonInpatientEmployerNumber)

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

        // const patientResult = await request.query(`
        //     DECLARE @ExistingID INT;

        //     SELECT TOP 1 @ExistingID = patient_id 
        //     FROM PatientRegistration 
        //     WHERE lastName = @lastName 
        //     AND firstName = @firstName 
        //     AND CAST(birthdate AS DATE) = CAST(@birthdate AS DATE)
        //     AND ISNULL(middleName, '') = ISNULL(@middleName, '')
        //     AND ISNULL(suffix, '') = ISNULL(@suffix, '');

        //     IF @ExistingID IS NOT NULL
        //     BEGIN
        //         UPDATE PatientRegistration
        //         SET 
        //             age = @age, birthplace = @birthplace, sex = @gender,
        //             civilStatus = @civilStatus, religion = @religion, nationality = @nationality, landline = @landline, 
        //             mobile = @mobile, email = @email, occupation = @occupation,
        //             addressStreet = @street, addressBarangay = @barangay, addressCity = @city, addressProvince = @province, addressRegion = @region,
        //             addressPermanent = @permanentAddress, ptFatherName = @fathersName, ptFatherAddress = @fathersAddress,
        //             ptFatherContact = @fatherContactNumber, ptMotherMaidenName = @mothersName, ptMotherAddress = @mothersAddress, ptMotherContact = @motherContactNumber,
        //             ptSourceIncome = @ptSourceIncome, specificSourceOfIncome = @specificSourceOfIncome, seniorId = @seniorpwd, philhealthId = @philhealthId,
        //             sssgsisId = @sssgsis, tinID = @tin, others = @others, ptGrossIncome = @ptGrossIncome, ptHomeOwnership = @ptHomeOwnership,
        //             ptYearsStay = @ptYearsStay, spouseName = @spouseName, spouseOccupation = @spouseOccupation, spouseEmployerContact = @spouseEmployerContact, ptCars = @ptCars,
        //             ptCarOwnership = @ptCarOwnership, cpName = @cpName, cpRelationship = @cpRelationship, cpLandline = @cpLandline, cpMobile = @cpMobile, cpEmail = @cpEmail,
        //             cpAddress = @cpAddress, cpOccupation = @cpOccupation, cpEmployerNumber = @cpEmployerNumber, spouseEmployerName = @spouseEmployerName, spouseEmployerAddress = @spouseEmployerAddress,
        //             cpIncomeSource = @cpIncomeSource, cpGrossIncome = @cpGrossIncome, cpHomeOwnership = @cpHomeOwnership, cpHomeStay = @cpHomeStay,
        //             cpHasCar = @cpHasCar, cpCarOwnership = @cpCarOwnership, cpNumberOfCars = @cpNumberOfCars, modeOfPayment = @mop, specificModeOfPayment = @specificmop, creditCards = @creditCard,
        //             bankAffiliations = @bank, itemsReceived = @items, patientType = 'Emergency', hmo = @hmo, scidnoOutpatient = @scidnoOutpatient, philHealth = @philHealth, medicalProcedure = @medicalProcedure, physician = @physician, isAdmitted = 2, forReview = 0
        //         WHERE patient_id = @ExistingID;

        //         SELECT @ExistingID AS patient_id, 'UPDATED' AS status;
        //     END
        //     ELSE
        //     BEGIN
        //         INSERT INTO PatientRegistration (
        //             lastName, firstName, middleName, suffix, birthdate, age, birthplace, sex, 
        //             civilStatus, religion, nationality, landline, mobile, email, occupation, 
        //             addressStreet, addressBarangay, addressCity, addressProvince, addressRegion,
        //             addressPermanent, ptFatherName, ptFatherAddress, 
        //             ptFatherContact, ptMotherMaidenName, ptMotherAddress, ptMotherContact, 
        //             ptSourceIncome, specificSourceOfIncome, seniorId, philhealthId,
        //             sssgsisId, tinID, others, ptGrossIncome, ptHomeOwnership,
        //             ptYearsStay, spouseName, spouseOccupation,spouseEmployerContact, ptCars, 
        //             ptCarOwnership, cpName, cpRelationship, cpLandline, cpMobile, cpEmail,
        //             cpAddress, cpOccupation, cpEmployerNumber, spouseEmployerName, spouseEmployerAddress,
        //             cpIncomeSource, cpGrossIncome, cpHomeOwnership, cpHomeStay,
        //             cpHasCar, cpCarOwnership, cpNumberOfCars, modeOfPayment, specificModeOfPayment, creditCards, 
        //             bankAffiliations, itemsReceived, patientType, hmo, scidnoOutpatient, philHealth, medicalProcedure, physician
        //         )
        //         VALUES (
        //             @lastName, @firstName, @middleName, @suffix, @birthdate, @age, @birthplace, @gender,
        //             @civilStatus, @religion, @nationality, @landline, @mobile, @email, @occupation,
        //             @street, @barangay, @city, @province, @region,
        //             @permanentAddress, @fathersName, @fathersAddress,
        //             @fatherContactNumber, @mothersName, @mothersAddress, @motherContactNumber,
        //             @ptSourceIncome, @specificSourceOfIncome, @seniorpwd, @philhealthId,
        //             @sssgsis, @tin, @others, @ptGrossIncome, @ptHomeOwnership,
        //             @ptYearsStay, @spouseName, @spouseOccupation,@spouseEmployerContact, @ptCars,
        //             @ptCarOwnership, @cpName, @cpRelationship, @cpLandline, @cpMobile, @cpEmail,
        //             @cpAddress, @cpOccupation, @cpEmployerNumber, @spouseEmployerName, @spouseEmployerAddress,
        //             @cpIncomeSource, @cpGrossIncome, @cpHomeOwnership, @cpHomeStay, @cpHasCar, 
        //             @cpCarOwnership, @cpNumberOfCars, @mop, @specificmop, @creditCard, @bank, @items, @patientType, @hmo, @scidnoOutpatient, @philHealth, @medicalProcedure, @physician
        //         );

        //         SELECT SCOPE_IDENTITY() AS patient_id, 'INSERTED' AS status;
        //     END
        // `);

        const patientResult = await request.query(`
            DECLARE @ExistingID INT;
            DECLARE @LinkedPatientNo BIGINT;

            DECLARE @CodeReligion VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.RELIGION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@religion))));
            DECLARE @CodeOccupation VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.OCCUPATION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@occupation))));
            DECLARE @CodeNationality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.NATIONALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@nationality))));
            DECLARE @CodeMunicipality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.MUNICIPALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@city))));
            DECLARE @CodeBarangay VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.BARANGAYS WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@barangay))));

            SELECT TOP 1 
            @ExistingID = patient_id,
            @LinkedPatientNo = patient_no 

            FROM PatientRegistration 
            WHERE lastName = @lastName 
            AND firstName = @firstName 
            AND CAST(birthdate AS DATE) = CAST(@birthdate AS DATE)
            AND ISNULL(middleName, '') = ISNULL(@middleName, '')
            AND ISNULL(suffix, '') = ISNULL(@suffix, '');

            IF @ExistingID IS NOT NULL
            BEGIN
                UPDATE PatientRegistration
                SET 
                    age = @age, birthplace = @birthplace, sex = @gender,
                    civilStatus = @civilStatus, religion = @religion, nationality = @nationality, landline = @landline, 
                    mobile = @mobile, email = @email, occupation = @occupation,
                    addressStreet = @street, addressBarangay = @barangay, addressCity = @city, addressProvince = @province, addressRegion = @region,
                    addressPermanent = @permanentAddress, ptFatherName = @fathersName, ptFatherAddress = @fathersAddress,
                    ptFatherContact = @fatherContactNumber, ptMotherMaidenName = @mothersName, ptMotherAddress = @mothersAddress, ptMotherContact = @motherContactNumber,
                    ptSourceIncome = @ptSourceIncome, specificSourceOfIncome = @specificSourceOfIncome, seniorId = @seniorpwd, philhealthId = @philhealthId,
                    sssgsisId = @sssgsis, tinID = @tin, others = @others, ptGrossIncome = @ptGrossIncome, ptHomeOwnership = @ptHomeOwnership,
                    ptYearsStay = @ptYearsStay, spouseName = @spouseName, spouseOccupation = @spouseOccupation, spouseEmployerContact = @spouseEmployerContact, ptCars = @ptCars,
                    ptCarOwnership = @ptCarOwnership, cpName = @cpName, cpRelationship = @cpRelationship, cpLandline = @cpLandline, cpMobile = @cpMobile, cpEmail = @cpEmail,
                    cpAddress = @cpAddress, cpOccupation = @cpOccupation, cpEmployerNumber = @cpEmployerNumber, spouseEmployerName = @spouseEmployerName, spouseEmployerAddress = @spouseEmployerAddress,
                    cpIncomeSource = @cpIncomeSource, cpGrossIncome = @cpGrossIncome, cpHomeOwnership = @cpHomeOwnership, cpHomeStay = @cpHomeStay,
                    cpHasCar = @cpHasCar, cpCarOwnership = @cpCarOwnership, cpNumberOfCars = @cpNumberOfCars, modeOfPayment = @mop, specificModeOfPayment = @specificmop, creditCards = @creditCard,
                    bankAffiliations = @bank, itemsReceived = @items, patientType = 'Emergency', hmo = @hmo, scidnoOutpatient = @scidnoOutpatient, philHealth = @philHealth, medicalProcedure = @medicalProcedure, physician = @physician, isAdmitted = 2, forReview = 0
                WHERE patient_id = @ExistingID;

                IF @LinkedPatientNo IS NOT NULL
                BEGIN
                    UPDATE UERMMMC.dbo.PATIENTINFO
                    SET 
                        LASTNAME = @lastName,
                        FIRSTNAME = @firstName,
                        MIDDLENAME = @middleName,
                        SUFFIX = @suffix,
                        DBIRTH = @birthdate,
                        AGE = @age,
                        SEX = @gender,
                        STATUS = @civilStatus,
                        RELIGION = @CodeReligion,           
                        NATIONALITY = @CodeNationality,      
                        BPLACE = @birthplace,
                        OCCUPATION = @CodeOccupation,        
                        BARANGAY = @CodeBarangay,           
                        MUNICIPALITY = @CodeMunicipality,    
                        INCASE = @cpName,
                        RELATIONSHIP = @cpRelationship,
                        INCASEPHONENO = ISNULL(@cpLandline, @cpMobile),
                        INCASEADD = @cpAddress,
                        PHONENOS = @cpLandline,
                        MOBILENO = @cpMobile,
                        NAMEOFSPOUSE = @spouseName,
                        SPOUSEOCCUPATION = @spouseOccupation,
                        EMPLOYER = @spouseEmployerName,
                        EMPLOYERADD = @spouseEmployerAddress,
                        EMPLOYERTELNO = @spouseEmployerContact,
                        FATHER = @fathersName,
                        FADDRESS = @fathersAddress,
                        FTEL = @fatherContactNumber,
                        MOTHER = @mothersName,
                        MADDRESS = @mothersAddress,
                        MTEL = @motherContactNumber,
                        SSSNO = @sssgsis,
                        TINNO = @tin,
                        SCIDNO = @seniorpwd,
                        UDF_PHILHEALTHNO = @philhealthId
                    WHERE PATIENTNO = @LinkedPatientNo;
                END

                SELECT @ExistingID AS patient_id, 'UPDATED' AS status;
            END
            ELSE
            BEGIN
                INSERT INTO PatientRegistration (
                    lastName, firstName, middleName, suffix, birthdate, age, birthplace, sex, 
                    civilStatus, religion, nationality, landline, mobile, email, occupation, 
                    addressStreet, addressBarangay, addressCity, addressProvince, addressRegion,
                    addressPermanent, ptFatherName, ptFatherAddress, 
                    ptFatherContact, ptMotherMaidenName, ptMotherAddress, ptMotherContact, 
                    ptSourceIncome, specificSourceOfIncome, seniorId, philhealthId,
                    sssgsisId, tinID, others, ptGrossIncome, ptHomeOwnership,
                    ptYearsStay, spouseName, spouseOccupation,spouseEmployerContact, ptCars, 
                    ptCarOwnership, cpName, cpRelationship, cpLandline, cpMobile, cpEmail,
                    cpAddress, cpOccupation, cpEmployerNumber, spouseEmployerName, spouseEmployerAddress,
                    cpIncomeSource, cpGrossIncome, cpHomeOwnership, cpHomeStay,
                    cpHasCar, cpCarOwnership, cpNumberOfCars, modeOfPayment, specificModeOfPayment, creditCards, 
                    bankAffiliations, itemsReceived, patientType, hmo, scidnoOutpatient, philHealth, medicalProcedure, physician
                )
                VALUES (
                    @lastName, @firstName, @middleName, @suffix, @birthdate, @age, @birthplace, @gender,
                    @civilStatus, @religion, @nationality, @landline, @mobile, @email, @occupation,
                    @street, @barangay, @city, @province, @region,
                    @permanentAddress, @fathersName, @fathersAddress,
                    @fatherContactNumber, @mothersName, @mothersAddress, @motherContactNumber,
                    @ptSourceIncome, @specificSourceOfIncome, @seniorpwd, @philhealthId,
                    @sssgsis, @tin, @others, @ptGrossIncome, @ptHomeOwnership,
                    @ptYearsStay, @spouseName, @spouseOccupation,@spouseEmployerContact, @ptCars,
                    @ptCarOwnership, @cpName, @cpRelationship, @cpLandline, @cpMobile, @cpEmail,
                    @cpAddress, @cpOccupation, @cpEmployerNumber, @spouseEmployerName, @spouseEmployerAddress,
                    @cpIncomeSource, @cpGrossIncome, @cpHomeOwnership, @cpHomeStay, @cpHasCar, 
                    @cpCarOwnership, @cpNumberOfCars, @mop, @specificmop, @creditCard, @bank, @items, @patientType, @hmo, @scidnoOutpatient, @philHealth, @medicalProcedure, @physician
                );

                SELECT SCOPE_IDENTITY() AS patient_id, 'INSERTED' AS status;
            END
        `);

        const newPatientID = patientResult.recordset[0]?.patient_id;
        const actionStatus = patientResult.recordset[0]?.status;
        
        if (p.signature && newPatientID) {
            try {
                const cleanSignature = p.signature.replace(/^data:image\/\w+;base64,/, "");
                const finalSignatureBuffer = Buffer.from(cleanSignature, 'base64');

                const signRequest = new sql.Request(transaction);
                signRequest.input('pId', sql.Int, newPatientID);
                signRequest.input('signData', sql.VarBinary(sql.MAX), finalSignatureBuffer);

                await signRequest.query(`
                    MERGE ptSignature AS target
                    USING (SELECT @pId AS patient_id, @signData AS eSignature) AS source
                    ON (target.patient_id = source.patient_id)
                    WHEN MATCHED THEN
                        UPDATE SET eSignature = source.eSignature
                    WHEN NOT MATCHED THEN
                        INSERT (patient_id, eSignature)
                        VALUES (source.patient_id, source.eSignature);
                `);
            } catch (sigError) {
                throw sigError;
            }
        }

        await transaction.commit();

        res.status(200).json({
            message: actionStatus === 'UPDATED' ? "User record updated successfully" : "User registered successfully",
            patientId: newPatientID,
            action: actionStatus
        });

    } catch (err) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackErr) {
                console.error("Rollback failed:", rollbackErr);
            }
        }

        console.error("Register/Update Error:", err);
        if (err.number === 2627) {
            return res.status(409).json({ message: "Database constraint error (Duplicate key)." });
        }
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


exports.registerTriage = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Invalid Request: Body is missing." });
    }
    const body = req.body;

    const toDecimal = (val) => (val === "" || val === undefined || val === null) ? null : parseFloat(val);
    const toInt = (val) => (val === "" || val === undefined || val === null) ? null : parseInt(val, 10);
    const toStr = (val) => (val === "" || val === undefined) ? null : val;

    const processBase64 = (base64String) => {
        if (!base64String) return null;
        const cleanString = base64String.replace(/^data:image\/\w+;base64,/, "");
        return Buffer.from(cleanString, 'base64');
    };

    const t = {
        lastName: toStr(body.lastNameTriage),
        firstName: toStr(body.firstNameTriage),
        middleName: toStr(body.middleNameTriage),
        suffix: toStr(body.suffixTriage),
        birthdate: body.birthdateTriage || null,        
        age: toInt(body.ageTriage),
        gender: toStr(body.genderTriage),
        civilStatus: toStr(body.civilStatus),
        
        patientType: toStr(body.patientType),
        chiefComplaint: toStr(body.chiefComplaintTriage),
        
        temp: toDecimal(body.tempTriage),     
        heartRate: toInt(body.heartRateTriage),
        oxygen: toDecimal(body.oxygenTriage),
        respiRate: toInt(body.respiRateTriage),
        painScore: toInt(body.painScoreTriage),
        bp: toStr(body.bpTriage),
        
        avpu: toStr(body.avpuTriage),
        contagious: toStr(body.contagiousTriage),
        isolation: toStr(body.isolationPrecautionTriage),
        cpd: toStr(body.cpdTriage),
        level: toStr(body.levelTriage),
        remarks: toStr(body.remarksTriage),
        checkforPresense: Array.isArray(body.checkforPresense) 
            ? body.checkforPresense.join(', ') 
            : toStr(body.checkforPresense),

        contactPerson: toStr(body.contactPersonTriage),
        contactAddress: toStr(body.contactPersonTriageAddress),
        contactNumber: toStr(body.contactPersonTriageMobile),
        seniorId: toStr(body.scidnoTriage),
        hmo: toStr(body.hmoName),
        infirmary: toStr(body.infirmary), 

        personnel: toStr(body.personnelTriage),
        dateAccomplished: body.dateTriage ? new Date(body.dateTriage) : new Date(),
        
        isAdmitted: 0, 

        personnelSignature: body.personnelSignature,
        patientSignature: body.patientSignature
    };

    let transaction; 

    try {
        const pool = await sql.connect(); 
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request = new sql.Request(transaction); 

        request
            .input('lastName', sql.NVarChar, t.lastName)
            .input('firstName', sql.NVarChar, t.firstName)
            .input('middleName', sql.NVarChar, t.middleName)
            .input('suffix', sql.NVarChar, t.suffix)
            .input('birthdate', sql.VarChar, t.birthdate)
            .input('age', sql.Int, t.age)
            .input('gender', sql.NVarChar, t.gender)
            .input('civilStatus', sql.NVarChar, t.civilStatus)
            .input('infirmary', sql.NVarChar, t.infirmary)
            
            .input('patientType', sql.NVarChar, t.patientType)
            .input('chiefComplaint', sql.NVarChar, t.chiefComplaint)
            .input('temp', sql.Decimal(5, 2), t.temp)     
            .input('heartRate', sql.Int, t.heartRate)
            .input('oxygen', sql.Decimal(5, 2), t.oxygen)  
            .input('bp', sql.NVarChar, t.bp)
            .input('respiRate', sql.Int, t.respiRate)     
            .input('painScore', sql.Int, t.painScore)
            
            .input('avpu', sql.NVarChar, t.avpu)
            .input('contagious', sql.NVarChar, t.contagious)
            .input('isolation', sql.NVarChar, t.isolation)
            .input('cpd', sql.NVarChar, t.cpd)
            .input('level', sql.NVarChar, t.level)
            .input('remarks', sql.NVarChar, t.remarks)
            .input('checkforPresense', sql.NVarChar, t.checkforPresense)

            .input('cpName', sql.NVarChar, t.contactPerson)    
            .input('cpAddress', sql.NVarChar, t.contactAddress) 
            .input('cpMobile', sql.NVarChar, t.contactNumber)  
            .input('hmo', sql.NVarChar, t.hmo)                  
            .input('seniorId', sql.NVarChar, t.seniorId)     

            .input('personnel', sql.NVarChar, t.personnel)
            .input('dateAccomplished', sql.Date, t.dateAccomplished)
            .input('isAdmitted', sql.Bit, t.isAdmitted);

        const result = await request.query(`
            INSERT INTO PatientRegistration (
                lastName, firstName, middleName, suffix, birthdate, age, sex, 
                civilStatus, infirmary,
                patientType, chiefComplaint, temp, heartrate, oxygen, bp, respirate, painScore,
                avpu, contagious, isolation, cpd, level, remarks, symptoms,
                cpName, cpAddress, cpMobile, hmo, seniorId,  -- Fixed column list (removed duplicate infirmary)
                personnel, dateAccomplished, isAdmitted
            )
            OUTPUT INSERTED.patient_id
            VALUES (
                @lastName, @firstName, @middleName, @suffix, @birthdate, @age, @gender, 
                @civilStatus, @infirmary,
                @patientType, @chiefComplaint, @temp, @heartRate, @oxygen, @bp, @respiRate, @painScore,
                @avpu, @contagious, @isolation, @cpd, @level, @remarks, @checkforPresense,
                @cpName, @cpAddress, @cpMobile, @hmo, @seniorId, 
                @personnel, @dateAccomplished, @isAdmitted
            )
        `);

        const patientId = result.recordset[0]?.patient_id;

        if (!patientId) throw new Error("Failed to generate Patient ID");

        if (t.personnelSignature) {
            const psRequest = new sql.Request(transaction); 
            const personnelBuffer = processBase64(t.personnelSignature);
            
            psRequest.input('pId', sql.Int, patientId);
            psRequest.input('signData', sql.VarBinary(sql.MAX), personnelBuffer);
            psRequest.input('personnel', sql.NVarChar, t.personnel); 

            await psRequest.query(`
                INSERT INTO tpSignature (patient_id, eSignature, personnel_name) 
                VALUES (@pId, @signData, @personnel)                        
            `);
        }

        if (t.patientSignature) {
            const ptRequest = new sql.Request(transaction); 
            const patientBuffer = processBase64(t.patientSignature);

            ptRequest.input('pId', sql.Int, patientId);
            ptRequest.input('signData', sql.VarBinary(sql.MAX), patientBuffer);

            await ptRequest.query(`
                INSERT INTO ptSignature (patient_id, eSignature, createdAt) 
                VALUES (@pId, @signData, GETDATE())                        
            `);
        }

        await transaction.commit(); 

        res.status(201).json({ 
            message: "Triage assessment saved successfully", 
            triageId: patientId 
        });

    } catch (err) {
        if (transaction) {
            try { await transaction.rollback(); } catch (e) { console.error("Rollback failed", e); }
        }
        console.error("Triage Save Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

exports.updateTriage = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: "Invalid Request: Body is missing." });
    }
    
    const body = req.body;

    if (!body.patientId) {
        return res.status(400).json({ message: "Update failed: Patient Number (patientId) is missing." });
    }

    const toDecimal = (val) => (val === "" || val === undefined || val === null) ? null : parseFloat(val);
    const toInt = (val) => (val === "" || val === undefined || val === null) ? null : parseInt(val, 10);
    const toStr = (val) => (val === "" || val === undefined) ? null : val;

    const processBase64 = (base64String) => {
        if (!base64String) return null;
        const cleanString = base64String.replace(/^data:image\/\w+;base64,/, "");
        return Buffer.from(cleanString, 'base64');
    };

    const t = {
        idInput: toInt(body.patientId), 
        idnoInput: toInt(body.patientNo), 

        lastName: toStr(body.lastNameTriage),
        firstName: toStr(body.firstNameTriage),
        middleName: toStr(body.middleNameTriage),
        suffix: toStr(body.suffixTriage),
        birthdate: body.birthdateTriage || null,        
        age: toInt(body.ageTriage),
        gender: toStr(body.genderTriage),
        
        weightTriage: toStr(body.weightTriage),
        broughtBy: toStr(body.broughtBy),
        philHealthCateg: toStr(body.philHealthCateg),
        ptCondition: toStr(body.ptCondition),

        chiefComplaint: toStr(body.chiefComplaintTriage),
        
        temp: toDecimal(body.tempTriage),     
        heartRate: toInt(body.heartRateTriage),
        oxygen: toDecimal(body.oxygenTriage),
        respiRate: toInt(body.respiRateTriage),
        painScore: toInt(body.painScoreTriage),

        bp: toStr(body.bpTriage),
        avpu: toStr(body.avpuTriage),
        contagious: toStr(body.contagiousTriage),
        isolation: toStr(body.isolationPrecautionTriage),
        cpd: toStr(body.cpdTriage),
        level: toStr(body.levelTriage),
        remarks: toStr(body.remarksTriage),
        
        checkforPresense: Array.isArray(body.checkforPresense) 
            ? body.checkforPresense.join(', ') 
            : toStr(body.checkforPresense),
            
        personnel: toStr(body.personnelTriage),
        dateAccomplished: body.dateTriage ? new Date(body.dateTriage) : new Date(),

        personnelSignature: body.personnelSignature 
    };

    let transaction;

    try {
        const pool = await sql.connect();
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request = new sql.Request(transaction); 

        request.input('idnoInput', sql.BigInt, t.idnoInput);
        request.input('patientId', sql.BigInt, t.idInput);

        request.input('lastName', sql.NVarChar, t.lastName);
        request.input('firstName', sql.NVarChar, t.firstName);
        request.input('middleName', sql.NVarChar, t.middleName);
        request.input('suffix', sql.NVarChar, t.suffix);
        request.input('birthdate', sql.VarChar, t.birthdate);
        request.input('age', sql.Int, t.age);
        request.input('gender', sql.NVarChar, t.gender);
        
        request.input('weightTriage', sql.NVarChar, t.weightTriage);
        request.input('broughtBy', sql.NVarChar, t.broughtBy);
        request.input('philHealthCateg', sql.NVarChar, t.philHealthCateg);
        request.input('ptCondition', sql.NVarChar, t.ptCondition);

        request.input('chiefComplaint', sql.NVarChar, t.chiefComplaint);
        
        request.input('temp', sql.Decimal(5, 2), t.temp);
        request.input('heartRate', sql.Int, t.heartRate);
        request.input('oxygen', sql.Decimal(5, 2), t.oxygen);
        request.input('bp', sql.NVarChar, t.bp);
        request.input('respiRate', sql.Int, t.respiRate);
        request.input('painScore', sql.Int, t.painScore);
        
        request.input('avpu', sql.NVarChar, t.avpu);
        request.input('contagious', sql.NVarChar, t.contagious);
        request.input('isolation', sql.NVarChar, t.isolation);
        request.input('cpd', sql.NVarChar, t.cpd);
        request.input('level', sql.NVarChar, t.level);
        request.input('remarks', sql.NVarChar, t.remarks);
        request.input('checkforPresense', sql.NVarChar, t.checkforPresense);
        request.input('personnel', sql.NVarChar, t.personnel);
        request.input('dateAccomplished', sql.Date, t.dateAccomplished);

        const result = await request.query(`
            IF EXISTS (SELECT 1 FROM PatientRegistration WHERE patient_id = @patientId)
            BEGIN
                UPDATE PatientRegistration
                SET 
                    lastName = @lastName, firstName = @firstName, middleName = @middleName, suffix = @suffix,
                    birthdate = @birthdate, age = @age, sex = @gender,
                    weight = @weightTriage, broughtBy = @broughtBy, philHealthCateg = @philHealthCateg, ptCondition = @ptCondition,
                    chiefComplaint = @chiefComplaint, temp = @temp, heartrate = @heartRate, oxygen = @oxygen,
                    bp = @bp, respirate = @respiRate, painScore = @painScore,
                    avpu = @avpu, contagious = @contagious, isolation = @isolation, cpd = @cpd,
                    level = @level, remarks = @remarks, symptoms = @checkforPresense,
                    personnel = @personnel, dateAccomplished = @dateAccomplished,
                    patientType = 'Emergency'
                
                OUTPUT inserted.patient_id, inserted.patient_no
                
                WHERE patient_id = @patientId
            END
            ELSE
            BEGIN
                INSERT INTO PatientRegistration (
                    patient_no, 
                    lastName, firstName, middleName, suffix, birthdate, age, sex,
                    weight, broughtBy, philHealthCateg, ptCondition,
                    chiefComplaint, temp, heartrate, oxygen, bp, respirate, painScore,
                    avpu, contagious, isolation, cpd, level, remarks, symptoms,
                    personnel, dateAccomplished, patientType
                )
                OUTPUT inserted.patient_id, inserted.patient_no
                VALUES (
                    @idnoInput, 
                    @lastName, @firstName, @middleName, @suffix, @birthdate, @age, @gender,
                    @weightTriage, @broughtBy, @philHealthCateg, @ptCondition,
                    @chiefComplaint, @temp, @heartRate, @oxygen, @bp, @respiRate, @painScore,
                    @avpu, @contagious, @isolation, @cpd, @level, @remarks, @checkforPresense,
                    @personnel, @dateAccomplished, 'Emergency'
                )
            END
        `);

        if (!result.recordset || result.recordset.length === 0) {
            throw new Error("Database Error: Operation completed but no ID returned.");
        }

        const dbPatientPk = result.recordset[0].patient_id; 
        const dbPatientNo = result.recordset[0].patient_no; 

        if (t.personnelSignature) {
            
            const psRequest = new sql.Request(transaction); 
            const personnelBuffer = processBase64(t.personnelSignature);
            
            psRequest.input('pId', sql.Int, dbPatientPk); 
            psRequest.input('pNo', sql.BigInt, dbPatientNo); 
            psRequest.input('signData', sql.VarBinary(sql.MAX), personnelBuffer);
            psRequest.input('personnelName', sql.NVarChar, t.personnel); 

            await psRequest.query(`
                IF EXISTS (SELECT 1 FROM tpSignature WHERE patient_no = @pNo)
                BEGIN
                    UPDATE tpSignature 
                    SET eSignature = @signData, 
                        personnel_name = @personnelName, 
                        patient_id = @pId  -- Update link to PK just in case
                    WHERE patient_no = @pNo
                END
                ELSE
                BEGIN
                    INSERT INTO tpSignature (patient_id, patient_no, eSignature, personnel_name) 
                    VALUES (@pId, @pNo, @signData, @personnelName)
                END
            `);
        }

        await transaction.commit();

        res.status(200).json({ 
            message: "Triage data saved successfully",
            patient_no: dbPatientNo,
            patient_id: dbPatientPk
        });

    } catch (err) {
        if (transaction) {
            try { await transaction.rollback(); } catch (e) { console.error("Rollback failed", e); }
        }
        console.error("Triage Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

exports.searchInpatient = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query || query.trim() === '') {
            return res.status(200).json([]); 
        }

        const cleanQuery = query.trim();
        
        const maxResults = 50;

        const pool = await sql.connect(); 
        
        const request = pool.request();

    
        const searchTerms = cleanQuery.split(' ').filter(term => term.length > 0);

        let sqlQuery = `
            SELECT TOP ${maxResults} 
                PATIENTNO, 
                (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME + ISNULL(' ' + SUFFIX, '')) AS fullName,                
                LASTNAME, 
                FIRSTNAME, 
                ISNULL(MIDDLENAME, '') as MIDDLENAME, 
                SUFFIX,
                FORMAT(DBIRTH, 'yyyy-MM-dd') as birthdate,
                AGE,
                SEX as gender, 
                STATUS,
                NATIONALITY,
                CONCAT_WS(', ', BARANGAY, MUNICIPALITY) AS addressPresent,
                DATE_ENCODED
            FROM UERMMMC.dbo.PATIENTINFO
            WHERE 1=1 
        `;

        
        const isNumeric = /^\d+$/.test(cleanQuery);

        if (isNumeric) {
            sqlQuery += ` AND (PATIENTNO LIKE @exactId OR PATIENTNO LIKE @partialId) `;
            request.input('exactId', sql.VarChar, cleanQuery);
            request.input('partialId', sql.VarChar, `${cleanQuery}%`);
        } else {
    
            searchTerms.forEach((term, index) => {
                const paramName = `term${index}`;
                request.input(paramName, sql.NVarChar, `%${term}%`);
                
                sqlQuery += ` 
                    AND (
                        LASTNAME LIKE @${paramName} 
                        OR FIRSTNAME LIKE @${paramName}
                        OR MIDDLENAME LIKE @${paramName}
                        OR SUFFIX LIKE @${paramName}
                    ) 
                `;
            });
        }

        sqlQuery += ` ORDER BY LASTNAME, FIRSTNAME`;

        const result = await request.query(sqlQuery);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Search Error:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

exports.fetchInpatient = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
            SELECT 
                *, 
                
                (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName + ISNULL(' ' + suffix, '')) AS fullName, 
                ISNULL(middleName, '') as middleName, 
                ISNULL(suffix, '') as suffix,
                sex as gender, 
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdateStr,
                CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent

            FROM PatientRegistration
            WHERE 
                patientType = 'Inpatient' 
                OR isAdmitted = 2
            ORDER BY createdAt DESC
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Inpatient Error:", err);
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
                    CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent,
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
                    *, -- 1. 

                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                    sex as gender, 
                    
                    CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent

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
            SELECT 
                *, 

                (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName + ISNULL(' ' + suffix, '')) AS fullName, 
                
                ISNULL(middleName, '') as middleName, 
                ISNULL(suffix, '') as suffix,

                sex as gender, 
                FORMAT(birthdate, 'yyyy-MM-dd') as birthdateStr, 
                
                CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent

            FROM PatientRegistration
            WHERE 
                patientType = 'Outpatient' 
            ORDER BY createdAt DESC
        `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Inpatient Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchErpatient = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
                SELECT 
                    PR.*,  
                    
                    (PR.firstName + ' ' + ISNULL(PR.middleName + ' ', '') + PR.lastName) AS fullName,
                    FORMAT(PR.birthdate, 'yyyy-MM-dd') as birthdateStr,
                    PR.sex as gender, 
                    CONCAT_WS(', ', PR.addressStreet, PR.addressBarangay, PR.addressCity, PR.addressProvince, PR.addressRegion) AS addressPresent,

                    C.DATEDIS,
                    C.DISCHARGE,
                    C.DISCHARGEBY

                FROM PatientRegistration PR
                
                LEFT JOIN UERMMMC.dbo.CASES C ON PR.patient_no = C.PATIENTNO

                WHERE 
                    PR.patientType = 'Emergency' 
                    AND (PR.isAdmitted = '0' OR PR.isAdmitted = '1') 
                    
                    AND (
                        C.DISCHARGE IN ('N', 'No')       
                        OR C.DISCHARGE IS NULL     
                    )
                    AND (
                        C.DISCHARGEBY IS NULL            
                        OR LTRIM(RTRIM(C.DISCHARGEBY)) = ''  
                    )
                ORDER BY PR.createdAt DESC
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchErpatientForReview = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
                SELECT 
                    *,  
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdateStr,
                    sex as gender, 
                    CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent
                FROM PatientRegistration
                WHERE 
                    patientType = 'Emergency' 
                    AND forReview = 1 OR forReview = 0
                ORDER BY createdAt DESC
            `);

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.fetchAdmitErpatient = async (req, res) => {
    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .query(`
                SELECT 
                    *,  

                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdateStr,
                    sex as gender, 
                    CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent

                FROM PatientRegistration
                WHERE 
                    patientType = 'Emergency' 
                    AND (isAdmitted = '1') 
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
        
        const ptData = formData.patientSourceOfIncome || {};
        const cpData = formData.ContactPersonSourceOfIncome || {};
        const hmo = formData.hmoForm || {};

        const pool = await sql.connect();
        const request = pool.request();

        request.input('patientId', sql.Int, patientId);

        request.input('ptSourceIncome', sql.NVarChar, ptData.sourceOfIncome);
        request.input('specificSourceOfIncome', sql.NVarChar, ptData.sourceOfIncome === 'Others' ? ptData.specificSourceOfIncome : null);
        request.input('ptGrossIncome', sql.NVarChar, ptData.pt_gross_income ? JSON.stringify(ptData.pt_gross_income) : null);
        request.input('ptHomeOwnership', sql.NVarChar, ptData.pt_home_ownership ? JSON.stringify(ptData.pt_home_ownership) : null);
        request.input('ptYearsStay', sql.NVarChar, ptData.pt_years_of_stay ? JSON.stringify(ptData.pt_years_of_stay) : null);
        request.input('ptCars', sql.NVarChar, ptData.pthasCar);
        request.input('ptCarOwnership', sql.NVarChar, ptData.pthasCar === 'yes' ? ptData.carOwnership : null);
        request.input('ptNumberOfCars', sql.NVarChar, ptData.pthasCar === 'yes' ? String(ptData.numberOfCars) : null);

        request.input('cpIncomeSource', sql.NVarChar, cpData.sourceOfIncomeContactPerson);
        request.input('cpSpecificSourceIncome', sql.NVarChar, cpData.sourceOfIncomeContactPerson === 'Others' ? cpData.specificSourceOfIncomeContactPerson : null);
        
        request.input('cpGrossIncome', sql.NVarChar, cpData.cp_gross_income ? JSON.stringify(cpData.cp_gross_income) : null);
        request.input('cpHomeOwnership', sql.NVarChar, cpData.cp_home_ownership ? JSON.stringify(cpData.cp_home_ownership) : null);
        request.input('cpHomeStay', sql.NVarChar, cpData.cp_years_of_stay ? JSON.stringify(cpData.cp_years_of_stay) : null);
        request.input('cpHasCar', sql.NVarChar, cpData.cphasCar);
        request.input('cpCarOwnership', sql.NVarChar, cpData.cphasCar === 'yes' ? cpData.cpcarOwnership : null);
        request.input('cpNumberOfCars', sql.NVarChar, cpData.cphasCar === 'yes' ? String(cpData.cpnumberOfCars) : '0');

        request.input('modeOfPayment', sql.NVarChar, ptData.mop);
        request.input('specificModeOfPayment', sql.NVarChar, ptData.mop === 'Others' ? ptData.specificmop : null);
        request.input('creditCards', sql.NVarChar, String(ptData.creditCard || 0));
        request.input('bankAffiliations', sql.NVarChar, ptData.bank);

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

                cpIncomeSource = @cpIncomeSource,
                                
                cpGrossIncome = @cpGrossIncome,
                cpHomeOwnership = @cpHomeOwnership,
                cpHomeStay = @cpHomeStay,
                cpHasCar = @cpHasCar,
                cpCarOwnership = @cpCarOwnership,
                cpNumberOfCars = @cpNumberOfCars, 

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
                informedIncrement = @informedIncrement,
                forReview = 1
                
            WHERE patient_id = @patientId
        `;

        await request.query(query);

        return res.status(200).json({ success: true, message: "Patient details updated successfully." });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ success: false, message: "Server error while updating details." });
    }
};

exports.getPatientSignature = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).json({ message: "Patient No is required" });
        }

        const pool = await sql.connect();

        const result = await pool.request()
            .input('pId', sql.BigInt, id) 
            .query(`
                SELECT eSignature 
                FROM ptSignature 
                WHERE patient_id = @pId
            `);

        if (result.recordset.length > 0 && result.recordset[0].eSignature) {
            
            const binaryData = result.recordset[0].eSignature;
            const base64Signature = binaryData.toString('base64');

            let mimeType = 'image/png'; 
            if (base64Signature.startsWith('/9j/')) {
                mimeType = 'image/jpeg';
            }

            const dataUrl = `data:${mimeType};base64,${base64Signature}`;

            return res.status(200).json({ signature: dataUrl });
        } 
        
        else {
            return res.status(404).json({ message: "No signature found for this Patient No" });
        }

    } catch (err) {
        console.error("Signature Fetch Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getTpersonnelSignature = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).json({ message: "Patient No is required" });
        }

        const pool = await sql.connect();

        const result = await pool.request()
            .input('PATIENTNO', sql.BigInt, id) 
            .query(`
                SELECT eSignature 
                FROM tpSignature 
                WHERE patient_no = @PATIENTNO
            `);

        if (result.recordset.length > 0 && result.recordset[0].eSignature) {
            
            const binaryData = result.recordset[0].eSignature;
            const base64Signature = binaryData.toString('base64');

            let mimeType = 'image/png'; 
            if (base64Signature.startsWith('/9j/')) {
                mimeType = 'image/jpeg';
            }

            const dataUrl = `data:${mimeType};base64,${base64Signature}`;

            return res.status(200).json({ signature: dataUrl });
        } 
        
        else {
            return res.status(404).json({ message: "No signature found for this Patient No" });
        }

    } catch (err) {
        console.error("Signature Fetch Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.sendDataInformation = async (req, res) => {
    const { patient_id, force } = req.body; 

    if (!patient_id) {
        return res.status(400).json({ message: "Patient ID is required" });
    }

    const transaction = new sql.Transaction();

    try {
        await transaction.begin();

        const requestSource = new sql.Request(transaction);
        requestSource.input('id', sql.BigInt, patient_id);

        const sourceData = await requestSource.query(`
            SELECT lastName, firstName, middleName, suffix, birthdate 
            FROM PatientRegistrationDB.dbo.PatientRegistration 
            WHERE patient_id = @id
        `);

        if (sourceData.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: "Patient not found in Registration records." });
        }

        const { lastName, firstName, middleName, suffix, birthdate } = sourceData.recordset[0];

        if (!force) {
            const requestCheck = new sql.Request(transaction);
            requestCheck.input('checkLastName', sql.VarChar, lastName.trim());
            requestCheck.input('checkFirstName', sql.VarChar, firstName.trim());
            requestCheck.input('checkBirthdate', sql.Date, birthdate);

            const duplicateCheck = await requestCheck.query(`
                SELECT PATIENTNO, LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX, DBIRTH, AGE
                FROM UERMMMC.dbo.PATIENTINFO 
                WHERE 
                    UPPER(LTRIM(RTRIM(LASTNAME))) = UPPER(@checkLastName) 
                AND UPPER(LTRIM(RTRIM(FIRSTNAME))) = UPPER(@checkFirstName) 
                AND CAST(DBIRTH as DATE) = @checkBirthdate
            `);

            if (duplicateCheck.recordset.length > 0) {
                await transaction.rollback();

                const allDuplicates = duplicateCheck.recordset.map(match => ({
                    existingPatientNo: match.PATIENTNO,
                    firstName: match.FIRSTNAME,
                    lastName: match.LASTNAME,
                    middleName: match.MIDDLENAME,
                    suffix: match.SUFFIX,
                    birthdate: match.DBIRTH,
                    age: match.AGE
                }));

                return res.status(409).json(allDuplicates);
            }
        }

        const requestTransfer = new sql.Request(transaction);
        requestTransfer.input('id', sql.BigInt, patient_id);

        await requestTransfer.query(`
            DECLARE @generatedPATIENTNO BIGINT;
            SELECT @generatedPATIENTNO = ISNULL(MAX(CAST(PATIENTNO AS BIGINT)), 0) + 1 
            FROM UERMMMC.dbo.PATIENTINFO;

            INSERT INTO UERMMMC.dbo.PATIENTINFO (
                PATIENTNO, 
                LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX,
                BARANGAY, MUNICIPALITY,
                SEX, STATUS,
                RELIGION, NATIONALITY,
                DBIRTH, AGE, BPLACE,
                OCCUPATION,
                INCASE, RELATIONSHIP, INCASEPHONENO, INCASEADD,
                PHONENOS, MOBILENO,
                NAMEOFSPOUSE, SPOUSEOCCUPATION,
                EMPLOYER, EMPLOYERADD, EMPLOYERTELNO,
                FATHER, FADDRESS, FTEL,
                MOTHER, MADDRESS, MTEL,
                SSSNO, TINNO, SCIDNO, UDF_PHILHEALTHNO
            )
            SELECT 
                @generatedPATIENTNO, 
                lastName, firstName, middleName, suffix,
                addressBarangay, addressCity,
                sex, civilStatus,
                religion, nationality,
                birthdate, age, birthplace,
                occupation,
                cpName, cpRelationship, 
                ISNULL(cpLandline, cpMobile), 
                cpAddress,
                cpLandline, cpMobile,
                spouseName, spouseOccupation,
                spouseEmployerName, spouseEmployerAddress, spouseEmployerContact, 
                ptFatherName, ptFatherAddress, ptFatherContact,
                ptMotherMaidenName, ptMotherAddress, ptMotherContact,
                sssgsisId, tinID, seniorId, philhealthId
            FROM PatientRegistrationDB.dbo.PatientRegistration
            WHERE patient_id = @id;

            UPDATE PatientRegistrationDB.dbo.PatientRegistration
            SET patient_no = @generatedPATIENTNO, isValidated = 1
            WHERE patient_id = @id;

            UPDATE PatientRegistrationDB.dbo.ptSignature
            SET patient_no = @generatedPATIENTNO
            WHERE patient_id = @id;

            UPDATE PatientRegistrationDB.dbo.tpSignature
            SET patient_no = @generatedPATIENTNO
            WHERE patient_id = @id;
        `);

        await transaction.commit();
        res.status(200).json({ message: "Patient data successfully transferred and linked!" });

    } catch (err) {
        if (transaction._aborted === false) {
            await transaction.rollback();
        }
        console.error("Transfer Error:", err);

        if (err.number === 2627) {
            return res.status(409).json({ message: "Transfer Failed: Patient ID already exists in destination." });
        }

        res.status(500).json({ message: "Transfer failed", error: err.message });
    }
};

exports.checkPatientExists = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({ error: "Invalid Patient ID provided" });
        }
        const pool = await sql.connect();

        let result = await pool.request()
            .input('patientId', sql.BigInt, id) 
            .query(`SELECT TOP 1 1 FROM PatientRegistration WHERE patient_no = @patientId`);

        if (result.recordset.length > 0) {
            return res.status(200).json({ exists: true, source: 'REGISTRATION' });
        }

        result = await pool.request()
            .input('patientId', sql.BigInt, id) 
            .query(`SELECT TOP 1 1 FROM UERMMMC.dbo.PATIENTINFO WHERE PATIENTNO = @patientId`);

        if (result.recordset.length > 0) {
            return res.status(200).json({ exists: true, source: 'INFO' });
        }

        return res.status(200).json({ exists: false, source: null });

    } catch (error) {
        console.error("Check Error:", error);
        return res.status(500).json({ error: 'Check failed' });
    }
};

exports.getpatientById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined' || id === 'null') {
            return res.status(400).json({ message: "Invalid Patient ID provided" });
        }
        
        const pool = await sql.connect();
        
        let result = await pool.request()
            .input('patientId', sql.BigInt, id)
            .query(`
                SELECT 
                    PR.*, 
                    
                    REL.DESCRIPTION AS RELIGION_NAME,
                    OCC.DESCRIPTION AS OCCUPATION_NAME,
                    NAT.DESCRIPTION AS NATIONALITY_NAME,
                    MUN.DESCRIPTION AS MUNICIPALITY_NAME,
                    BRGY.DESCRIPTION AS BARANGAY_NAME,

                    PS.eSignature, 
                    TPS.eSignature AS personnelSignature, 
                    TPS.personnel_name                    
                FROM PatientRegistration PR
                
                LEFT JOIN UERMMMC.dbo.RELIGION REL 
                    ON PR.religion = REL.CODE 
                LEFT JOIN UERMMMC.dbo.OCCUPATION OCC 
                    ON PR.occupation = OCC.CODE
                LEFT JOIN UERMMMC.dbo.NATIONALITY NAT 
                    ON PR.nationality = NAT.CODE
                LEFT JOIN UERMMMC.dbo.MUNICIPALITY MUN 
                    ON PR.addressCity = MUN.CODE
                LEFT JOIN UERMMMC.dbo.BARANGAYS BRGY 
                    ON PR.addressBarangay = BRGY.CODE

                LEFT JOIN PatientRegistrationDB.dbo.ptSignature PS 
                    ON (PR.patient_id = PS.patient_id OR (PR.patient_no IS NOT NULL AND PR.patient_no = PS.patient_no))
                    
                LEFT JOIN PatientRegistrationDB.dbo.tpSignature TPS 
                    ON (PR.patient_id = TPS.patient_id OR (PR.patient_no IS NOT NULL AND PR.patient_no = TPS.patient_no))

                WHERE 
                    PR.patient_id = @patientId OR PR.patient_no = @patientId
            `);

        if (result.recordset.length > 0) {
            return res.status(200).json(result.recordset[0]);
        }

        result = await pool.request()
            .input('patientId', sql.BigInt, id)
            .query(`
                SELECT 
                    PATIENTINFO.*, 
                    RELIGION.DESCRIPTION AS RELIGION_NAME,
                    OCCUPATION.DESCRIPTION AS OCCUPATION_NAME,
                    NATIONALITY.DESCRIPTION AS NATIONALITY_NAME,
                    MUNICIPALITY.DESCRIPTION AS MUNICIPALITY_NAME,
                    BARANGAYS.DESCRIPTION AS BARANGAY_NAME,
                    PS.eSignature 
                FROM 
                    UERMMMC.dbo.PATIENTINFO 
                LEFT JOIN 
                    UERMMMC.dbo.RELIGION ON PATIENTINFO.RELIGION = RELIGION.CODE 
                LEFT JOIN 
                    UERMMMC.dbo.OCCUPATION ON PATIENTINFO.OCCUPATION = OCCUPATION.CODE
                LEFT JOIN 
                    UERMMMC.dbo.NATIONALITY ON PATIENTINFO.NATIONALITY = NATIONALITY.CODE
                LEFT JOIN 
                    UERMMMC.dbo.MUNICIPALITY ON PATIENTINFO.MUNICIPALITY = MUNICIPALITY.CODE
                LEFT JOIN 
                    UERMMMC.dbo.BARANGAYS ON PATIENTINFO.BARANGAY = BARANGAYS.CODE
                
                LEFT JOIN 
                    PatientRegistrationDB.dbo.ptSignature PS 
                ON 
                    PATIENTINFO.PATIENTNO = PS.patient_no

                WHERE 
                    PATIENTINFO.PATIENTNO = @patientId
            `);

        if (result.recordset.length > 0) {
            return res.status(200).json(result.recordset[0]);
        }

        return res.status(404).json({ message: "Patient not found" });

    } catch (err) {
        console.error("Fetch Error:", err);
        if (err.number === 8115) {
            return res.status(400).json({ message: "Error: The Patient ID is too large." });
        }
        res.status(500).json({ message: "Database error" });
    }
};

// exports.linkExistingPatientInfo = async (req, res) => {
//     const { patient_id, patientno } = req.body;

//     if (!patient_id || !patientno) {
//         return res.status(400).json({ message: "Missing Patient ID or Matched Hospital No." });
//     }

//     const transaction = new sql.Transaction();

//     try {
//         await transaction.begin();
//         const request = new sql.Request(transaction);

//         request.input('regID', sql.BigInt, patient_id);
//         request.input('patientno', sql.BigInt, patientno); 

//         await request.query(`
//             UPDATE PatientRegistrationDB.dbo.ptSignature
//             SET patient_no = @patientno
//             WHERE patient_id = @regID;

//             UPDATE PatientRegistrationDB.dbo.tpSignature
//             SET patient_no = @patientno
//             WHERE patient_id = @regID;

//             UPDATE Target
//             SET 
//                 Target.patient_no = @patientno,
//                 Target.isValidated = 1,

//                 Target.lastName = Source.LASTNAME,
//                 Target.firstName = Source.FIRSTNAME,
//                 Target.middleName = Source.MIDDLENAME,
//                 Target.suffix = Source.SUFFIX,

//                 Target.addressBarangay = Source.BARANGAY,
//                 Target.addressCity = Source.MUNICIPALITY,

//                 Target.sex = Source.SEX,
//                 Target.civilStatus = Source.STATUS,
//                 Target.religion = Source.RELIGION,
//                 Target.nationality = Source.NATIONALITY,
//                 Target.birthdate = Source.DBIRTH,
//                 Target.birthplace = Source.BPLACE,
//                 Target.occupation = Source.OCCUPATION,

//                 Target.cpName = Source.INCASE,
//                 Target.cpRelationship = Source.RELATIONSHIP,
//                 Target.cpAddress = Source.INCASEADD,
//                 Target.cpLandline = COALESCE(Source.PHONENOS, Source.INCASEPHONENO),
//                 Target.cpMobile = Source.MOBILENO,

//                 Target.spouseName = Source.NAMEOFSPOUSE,
//                 Target.spouseOccupation = Source.SPOUSEOCCUPATION,
//                 Target.spouseEmployerName = Source.EMPLOYER,     
//                 Target.spouseEmployerAddress = Source.EMPLOYERADD, 
//                 Target.spouseEmployerContact = Source.EMPLOYERTELNO,

//                 Target.ptFatherName = Source.FATHER,
//                 Target.ptFatherAddress = Source.FADDRESS,
//                 Target.ptFatherContact = Source.FTEL,
//                 Target.ptMotherMaidenName = Source.MOTHER,
//                 Target.ptMotherAddress = Source.MADDRESS,
//                 Target.ptMotherContact = Source.MTEL,

//                 Target.sssgsisId = Source.SSSNO,
//                 Target.tinID = Source.TINNO,
//                 Target.seniorId = Source.SCIDNO,
//                 Target.philhealthId = Source.UDF_PHILHEALTHNO

//             FROM PatientRegistrationDB.dbo.PatientRegistration AS Target
//             INNER JOIN UERMMMC.dbo.PATIENTINFO AS Source 
//                 ON Source.PATIENTNO = @patientno
//             WHERE Target.patient_id = @regID;

//             UPDATE HospitalTarget
//             SET HospitalTarget.AGE = RegSource.age
//             FROM UERMMMC.dbo.PATIENTINFO AS HospitalTarget
//             INNER JOIN PatientRegistrationDB.dbo.PatientRegistration AS RegSource
//                 ON RegSource.patient_id = @regID
//             WHERE HospitalTarget.PATIENTNO = @patientno;
//         `);

//         await transaction.commit();

//         res.status(200).json({ 
//             message: "Patient successfully linked. Data synchronized (Age updated in Hospital Records)." 
//         });

//     } catch (err) {
//         if (transaction._aborted === false) { 
//             await transaction.rollback();
//         }
//         console.error("Link Error:", err);
//         res.status(500).json({ message: "Linking failed", error: err.message });
//     }
// };

exports.linkExistingPatientInfo = async (req, res) => {
    const { patient_id, patientno } = req.body;

    if (!patient_id || !patientno) {
        return res.status(400).json({ message: "Missing Patient ID or Matched Hospital No." });
    }

    const transaction = new sql.Transaction();

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        request.input('regID', sql.BigInt, patient_id);
        request.input('patientno', sql.BigInt, patientno); 

        await request.query(`
            UPDATE PatientRegistrationDB.dbo.ptSignature
            SET patient_no = @patientno
            WHERE patient_id = @regID;

            UPDATE PatientRegistrationDB.dbo.tpSignature
            SET patient_no = @patientno
            WHERE patient_id = @regID;

            UPDATE Target
            SET 
                Target.patient_no = @patientno,
                Target.isValidated = 1,

                Target.lastName = Source.LASTNAME,
                Target.firstName = Source.FIRSTNAME,
                Target.middleName = Source.MIDDLENAME,
                Target.suffix = Source.SUFFIX,

                Target.addressBarangay = B.DESCRIPTION,
                Target.addressCity = M.DESCRIPTION,
                Target.religion = R.DESCRIPTION,
                Target.nationality = N.DESCRIPTION,
                Target.occupation = O.DESCRIPTION,

                Target.sex = Source.SEX,
                Target.civilStatus = Source.STATUS,
                Target.birthdate = Source.DBIRTH,
                Target.birthplace = Source.BPLACE,

                Target.cpName = Source.INCASE,
                Target.cpRelationship = Source.RELATIONSHIP,
                Target.cpAddress = Source.INCASEADD,
                Target.cpLandline = COALESCE(Source.PHONENOS, Source.INCASEPHONENO),
                Target.cpMobile = Source.MOBILENO,

                Target.spouseName = Source.NAMEOFSPOUSE,
                Target.spouseOccupation = Source.SPOUSEOCCUPATION,
                Target.spouseEmployerName = Source.EMPLOYER,     
                Target.spouseEmployerAddress = Source.EMPLOYERADD, 
                Target.spouseEmployerContact = Source.EMPLOYERTELNO,

                Target.ptFatherName = Source.FATHER,
                Target.ptFatherAddress = Source.FADDRESS,
                Target.ptFatherContact = Source.FTEL,
                Target.ptMotherMaidenName = Source.MOTHER,
                Target.ptMotherAddress = Source.MADDRESS,
                Target.ptMotherContact = Source.MTEL,

                Target.sssgsisId = Source.SSSNO,
                Target.tinID = Source.TINNO,
                Target.seniorId = Source.SCIDNO,
                Target.philhealthId = Source.UDF_PHILHEALTHNO

            FROM PatientRegistrationDB.dbo.PatientRegistration AS Target
            
            INNER JOIN UERMMMC.dbo.PATIENTINFO AS Source 
                ON Source.PATIENTNO = @patientno
            
            LEFT JOIN UERMMMC.dbo.RELIGION R ON Source.RELIGION = R.CODE 
            LEFT JOIN UERMMMC.dbo.OCCUPATION O ON Source.OCCUPATION = O.CODE
            LEFT JOIN UERMMMC.dbo.NATIONALITY N ON Source.NATIONALITY = N.CODE
            LEFT JOIN UERMMMC.dbo.MUNICIPALITY M ON Source.MUNICIPALITY = M.CODE
            LEFT JOIN UERMMMC.dbo.BARANGAYS B ON Source.BARANGAY = B.CODE

            WHERE Target.patient_id = @regID;

            UPDATE HospitalTarget
            SET HospitalTarget.AGE = RegSource.age
            FROM UERMMMC.dbo.PATIENTINFO AS HospitalTarget
            INNER JOIN PatientRegistrationDB.dbo.PatientRegistration AS RegSource
                ON RegSource.patient_id = @regID
            WHERE HospitalTarget.PATIENTNO = @patientno;
        `);

        await transaction.commit();

        res.status(200).json({ 
            message: "Patient successfully linked. Data synchronized with descriptive values." 
        });

    } catch (err) {
        if (transaction._aborted === false) { 
            await transaction.rollback();
        }
        console.error("Link Error:", err);
        res.status(500).json({ message: "Linking failed", error: err.message });
    }
};

exports.admitErPatient = async (req, res) => {
    const { patient_id } = req.body;

    if (!patient_id) {
        return res.status(400).json({ message: "Patient ID is required." });
    }

    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .input('pId', sql.Int, patient_id)
            .query(`
                UPDATE PatientRegistration 
                SET isAdmitted = 1 
                WHERE patient_id = @pId
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Patient not found." });
        }

        res.status(200).json({ message: "Patient successfully admitted." });

    } catch (err) {
        console.error("Admit Patient Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const pool = await sql.connect();
        
        const result = await pool.request()
            .input('uName', sql.VarChar, username) 
            .query(`
                SELECT USERID, USERNAME, PASSWORD, DEPARTMENT
                FROM UERMMMC.dbo.USERS 
                WHERE USERNAME = @uName
            `);

        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        if (password !== user.PASSWORD) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const userRole = user.DEPARTMENT; 
        let redirectPath = '/';

        if (userRole === 'EMERGENCY ROOM' || userRole === 'ER') {
            redirectPath = '/er';
        } else if (userRole === 'ADMITTING SECTION' || userRole === 'Admitting') {
            redirectPath = '/admitting';
        } else {
            return res.status(403).json({ message: "Unauthorized role access." });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.USERID,        
                username: user.USERNAME, 
                role: userRole           
            },
            redirectPath: redirectPath 
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};


