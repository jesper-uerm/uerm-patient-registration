const { sql, poolPromise } = require('../config/sqlHelper');

const PatientModel = {


// upsertPatient: async (p) => {
//     let transaction;
//     try {
//         const pool = await poolPromise;
//         transaction = new sql.Transaction(pool);
//         await transaction.begin();

//         const request = new sql.Request(transaction);

//         request.input('lastName', sql.NVarChar, p.lastName);
//         request.input('firstName', sql.NVarChar, p.firstName);
//         request.input('middleName', sql.NVarChar, p.middleName);
//         request.input('suffix', sql.NVarChar, p.suffix);
//         request.input('birthdate', sql.NVarChar, p.birthdate);   
//         request.input('birthplace', sql.NVarChar, p.birthplace); 
//         request.input('age', sql.Int, p.age);
//         request.input('gender', sql.NVarChar, p.gender);
//         request.input('civilStatus', sql.NVarChar, p.civilStatus);
//         request.input('religion', sql.NVarChar, p.religion);
//         request.input('nationality', sql.NVarChar, p.nationality);
//         request.input('occupation', sql.NVarChar, p.occupation);

//         request.input('street', sql.NVarChar, p.street);
//         request.input('barangay', sql.NVarChar, p.barangay);
//         request.input('city', sql.NVarChar, p.city);
//         request.input('province', sql.NVarChar, p.province);
//         request.input('region', sql.NVarChar, p.region);
//         request.input('permanentAddress', sql.NVarChar, p.permanentAddress);
//         request.input('landline', sql.NVarChar, p.landline);
//         request.input('mobile', sql.NVarChar, p.mobile);
//         request.input('email', sql.NVarChar, p.email);

//         request.input('fathersName', sql.NVarChar, p.fathersName);
//         request.input('fathersAddress', sql.NVarChar, p.fathersAddress);
//         request.input('fatherContactNumber', sql.NVarChar, p.fatherContactNumber);
//         request.input('mothersName', sql.NVarChar, p.mothersName);
//         request.input('mothersAddress', sql.NVarChar, p.mothersAddress);
//         request.input('motherContactNumber', sql.NVarChar, p.motherContactNumber);
        
//         request.input('spouseName', sql.NVarChar, p.spouseName);
//         request.input('spouseOccupation', sql.NVarChar, p.spouseOccupation);
//         request.input('spouseEmployerName', sql.NVarChar, p.spouseEmployerName);
//         request.input('spouseEmployerAddress', sql.NVarChar, p.spouseEmployerAddress);
//         request.input('spouseEmployerContact', sql.NVarChar, p.spouseEmployerContact);

//         request.input('ptSourceIncome', sql.NVarChar, p.ptSourceIncome);
//         request.input('specificSourceOfIncome', sql.NVarChar, p.specificSourceOfIncome);
//         request.input('seniorpwd', sql.NVarChar, p.seniorpwd); 
//         request.input('philhealthId', sql.NVarChar, p.philhealthId);
//         request.input('sssgsis', sql.NVarChar, p.sssgsis);     
//         request.input('tin', sql.NVarChar, p.tin);             
//         request.input('others', sql.NVarChar, p.others);
        
//         request.input('ptGrossIncome', sql.NVarChar, p.ptGrossIncome);
//         request.input('ptHomeOwnership', sql.NVarChar, p.ptHomeOwnership);
//         request.input('ptYearsStay', sql.NVarChar, p.ptYearsStay);
//         request.input('ptCars', sql.NVarChar, p.ptCars);
//         request.input('ptCarOwnership', sql.NVarChar, p.ptCarOwnership);

//         request.input('cpName', sql.NVarChar, p.cpName);
//         request.input('cpRelationship', sql.NVarChar, p.cpRelationship);
//         request.input('cpLandline', sql.NVarChar, p.cpLandline);
//         request.input('cpMobile', sql.NVarChar, p.cpMobile);
//         request.input('cpEmail', sql.NVarChar, p.cpEmail);
//         request.input('cpAddress', sql.NVarChar, p.cpAddress);
//         request.input('cpOccupation', sql.NVarChar, p.cpOccupation);
//         request.input('cpEmployerNumber', sql.NVarChar, p.cpEmployerNumber);
        
//         request.input('cpIncomeSource', sql.NVarChar, p.cpIncomeSource);
//         request.input('cpGrossIncome', sql.NVarChar, p.cpGrossIncome);
//         request.input('cpHomeOwnership', sql.NVarChar, p.cpHomeOwnership);
        
//         request.input('cpHomeStay', sql.NVarChar, p.cpHomeStay); 
        
//         request.input('cpHasCar', sql.NVarChar, p.cpHasCar);
//         request.input('cpCarOwnership', sql.NVarChar, p.cpCarOwnership);
//         request.input('cpNumberOfCars', sql.NVarChar, p.cpNumberOfCars);

//         request.input('mop', sql.NVarChar, p.mop);
//         request.input('specificmop', sql.NVarChar, p.specificmop);
//         request.input('creditCard', sql.NVarChar, p.creditCard);
//         request.input('bank', sql.NVarChar, p.bank);
//         request.input('items', sql.NVarChar, p.items);
//         request.input('patientType', sql.NVarChar, p.patientType);
        
//         request.input('hmo', sql.NVarChar, p.hmo);
//         request.input('scidnoOutpatient', sql.NVarChar, p.scidnoOutpatient);
//         request.input('philHealth', sql.NVarChar, p.philHealth); 
//         request.input('medicalProcedure', sql.NVarChar, p.medicalProcedure);
//         request.input('physician', sql.NVarChar, p.physician);

//         const patientResult = await request.query(`
//             DECLARE @ExistingID INT;
//             DECLARE @LinkedPatientNo BIGINT;

//             DECLARE @CodeReligion VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.RELIGION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@religion))));
//             DECLARE @CodeOccupation VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.OCCUPATION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@occupation))));
//             DECLARE @CodeNationality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.NATIONALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@nationality))));
//             DECLARE @CodeMunicipality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.MUNICIPALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@city))));
//             DECLARE @CodeBarangay VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.BARANGAYS WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@barangay))));

//             SELECT TOP 1 
//                 @ExistingID = patient_id,
//                 @LinkedPatientNo = patient_no 
//                     FROM PatientRegistration 
//                     WHERE lastName = @lastName 
//                     AND firstName = @firstName 
//                     AND CAST(birthdate AS DATE) = CAST(@birthdate AS DATE)
//                     AND ISNULL(middleName, '') = ISNULL(@middleName, '')
//                     AND ISNULL(suffix, '') = ISNULL(@suffix, '');

//             IF @ExistingID IS NOT NULL
//             BEGIN
//                 UPDATE PatientRegistration
//                 SET 
//                     age = @age, birthplace = @birthplace, sex = @gender, 
//                     civilStatus = @civilStatus, religion = @religion, nationality = @nationality, landline = @landline, 
//                     mobile = @mobile, email = @email, occupation = @occupation,
//                     addressStreet = @street, addressBarangay = @barangay, addressCity = @city, addressProvince = @province, addressRegion = @region,
//                     addressPermanent = @permanentAddress, ptFatherName = @fathersName, ptFatherAddress = @fathersAddress,
//                     ptFatherContact = @fatherContactNumber, ptMotherMaidenName = @mothersName, ptMotherAddress = @mothersAddress, ptMotherContact = @motherContactNumber,
//                     ptSourceIncome = @ptSourceIncome, specificSourceOfIncome = @specificSourceOfIncome, seniorId = @seniorpwd, philhealthId = @philhealthId,
//                     sssgsisId = @sssgsis, tinID = @tin, others = @others, ptGrossIncome = @ptGrossIncome, ptHomeOwnership = @ptHomeOwnership,
//                     ptYearsStay = @ptYearsStay, spouseName = @spouseName, spouseOccupation = @spouseOccupation, spouseEmployerContact = @spouseEmployerContact, ptCars = @ptCars,
//                     ptCarOwnership = @ptCarOwnership, cpName = @cpName, cpRelationship = @cpRelationship, cpLandline = @cpLandline, cpMobile = @cpMobile, cpEmail = @cpEmail,
//                     cpAddress = @cpAddress, cpOccupation = @cpOccupation, cpEmployerNumber = @cpEmployerNumber, spouseEmployerName = @spouseEmployerName, spouseEmployerAddress = @spouseEmployerAddress,
//                     cpIncomeSource = @cpIncomeSource, cpGrossIncome = @cpGrossIncome, cpHomeOwnership = @cpHomeOwnership, cpHomeStay = @cpHomeStay,
//                     cpHasCar = @cpHasCar, cpCarOwnership = @cpCarOwnership, cpNumberOfCars = @cpNumberOfCars, modeOfPayment = @mop, specificModeOfPayment = @specificmop, creditCards = @creditCard,
//                     bankAffiliations = @bank, itemsReceived = @items, hmo = @hmo, scidnoOutpatient = @scidnoOutpatient, philHealth = @philHealth, medicalProcedure = @medicalProcedure, physician = @physician, 
//                     isAdmitted = 2, forReview = 0
//                 WHERE patient_id = @ExistingID;

//                 IF @LinkedPatientNo IS NOT NULL
//                 BEGIN
//                     UPDATE UERMMMC.dbo.PATIENTINFO
//                     SET 
//                         LASTNAME = @lastName, FIRSTNAME = @firstName, MIDDLENAME = @middleName, SUFFIX = @suffix,
//                         DBIRTH = @birthdate, BPLACE = @birthplace, AGE = @age, SEX = @gender, STATUS = @civilStatus,
//                         RELIGION = @CodeReligion, NATIONALITY = @CodeNationality, OCCUPATION = @CodeOccupation,
//                         BARANGAY = @CodeBarangay, MUNICIPALITY = @CodeMunicipality,
//                         INCASE = @cpName, RELATIONSHIP = @cpRelationship, INCASEPHONENO = ISNULL(@cpLandline, @cpMobile), INCASEADD = @cpAddress,
//                         PHONENOS = @cpLandline, MOBILENO = @cpMobile,
//                         NAMEOFSPOUSE = @spouseName, SPOUSEOCCUPATION = @spouseOccupation, EMPLOYER = @spouseEmployerName, EMPLOYERADD = @spouseEmployerAddress, EMPLOYERTELNO = @spouseEmployerContact,
//                         FATHER = @fathersName, FADDRESS = @fathersAddress, FTEL = @fatherContactNumber,
//                         MOTHER = @mothersName, MADDRESS = @mothersAddress, MTEL = @motherContactNumber,
//                         SSSNO = @sssgsis, TINNO = @tin, SCIDNO = @seniorpwd, UDF_PHILHEALTHNO = @philhealthId
//                     WHERE PATIENTNO = @LinkedPatientNo;
//                 END

//                 SELECT @ExistingID AS patient_id, 'UPDATED' AS status;
//             END
//             ELSE
//             BEGIN
//                 INSERT INTO PatientRegistration (
//                     lastName, firstName, middleName, suffix, birthdate, birthplace, age, sex, 
//                     civilStatus, religion, nationality, landline, mobile, email, occupation, 
//                     addressStreet, addressBarangay, addressCity, addressProvince, addressRegion,
//                     addressPermanent, ptFatherName, ptFatherAddress, 
//                     ptFatherContact, ptMotherMaidenName, ptMotherAddress, ptMotherContact, 
//                     ptSourceIncome, specificSourceOfIncome, seniorId, philhealthId,
//                     sssgsisId, tinID, others, ptGrossIncome, ptHomeOwnership,
//                     ptYearsStay, spouseName, spouseOccupation, spouseEmployerContact, ptCars, 
//                     ptCarOwnership, cpName, cpRelationship, cpLandline, cpMobile, cpEmail,
//                     cpAddress, cpOccupation, cpEmployerNumber, spouseEmployerName, spouseEmployerAddress,
//                     cpIncomeSource, cpGrossIncome, cpHomeOwnership, cpHomeStay,
//                     cpHasCar, cpCarOwnership, cpNumberOfCars, modeOfPayment, specificModeOfPayment, creditCards, 
//                     bankAffiliations, itemsReceived, patientType, hmo, scidnoOutpatient, philHealth, medicalProcedure, physician,
//                     createdAt
//                 )
//                 VALUES (
//                     @lastName, @firstName, @middleName, @suffix, @birthdate, @birthplace, @age, @gender,
//                     @civilStatus, @religion, @nationality, @landline, @mobile, @email, @occupation,
//                     @street, @barangay, @city, @province, @region,
//                     @permanentAddress, @fathersName, @fathersAddress,
//                     @fatherContactNumber, @mothersName, @mothersAddress, @motherContactNumber,
//                     @ptSourceIncome, @specificSourceOfIncome, @seniorpwd, @philhealthId,
//                     @sssgsis, @tin, @others, @ptGrossIncome, @ptHomeOwnership,
//                     @ptYearsStay, @spouseName, @spouseOccupation,@spouseEmployerContact, @ptCars,
//                     @ptCarOwnership, @cpName, @cpRelationship, @cpLandline, @cpMobile, @cpEmail,
//                     @cpAddress, @cpOccupation, @cpEmployerNumber, @spouseEmployerName, @spouseEmployerAddress,
//                     @cpIncomeSource, @cpGrossIncome, @cpHomeOwnership, @cpHomeStay, @cpHasCar, 
//                     @cpCarOwnership, @cpNumberOfCars, @mop, @specificmop, @creditCard, @bank, @items, @patientType, @hmo, @scidnoOutpatient, @philHealth, @medicalProcedure, @physician,
//                     GETDATE()
//                 );

//                 SELECT SCOPE_IDENTITY() AS patient_id, 'INSERTED' AS status;
//             END
//         `);

//         const newPatientID = patientResult.recordset[0]?.patient_id;
//         const actionStatus = patientResult.recordset[0]?.status;

//         if (p.signature && newPatientID) {
//             const cleanSignature = p.signature.replace(/^data:image\/\w+;base64,/, "");
//             const finalSignatureBuffer = Buffer.from(cleanSignature, 'base64');

//             const signRequest = new sql.Request(transaction);
//             signRequest.input('pId', sql.Int, newPatientID);
//             signRequest.input('signData', sql.VarBinary(sql.MAX), finalSignatureBuffer);

//             await signRequest.query(`
//                 MERGE ptSignature AS target
//                 USING (SELECT @pId AS patient_id, @signData AS eSignature) AS source
//                 ON (target.patient_id = source.patient_id)
//                 WHEN MATCHED THEN
//                     UPDATE SET eSignature = source.eSignature
//                 WHEN NOT MATCHED THEN
//                     INSERT (patient_id, eSignature) VALUES (source.patient_id, source.eSignature);
//             `);
//         }

//         await transaction.commit();
        
//         return { patientId: newPatientID, status: actionStatus };

//     } catch (err) {
//         if (transaction) await transaction.rollback();
//         console.error("Model Error (upsertPatient):", err);
//         throw err;
//     }
// },

upsertPatient: async (p) => {
    let transaction;
    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request = new sql.Request(transaction);

        request.input('lastName', sql.NVarChar, p.lastName);
        request.input('firstName', sql.NVarChar, p.firstName);
        request.input('middleName', sql.NVarChar, p.middleName);
        request.input('suffix', sql.NVarChar, p.suffix);
        request.input('birthdate', sql.NVarChar, p.birthdate);   
        request.input('birthplace', sql.NVarChar, p.birthplace); 
        request.input('age', sql.Int, p.age);
        request.input('gender', sql.NVarChar, p.gender);
        request.input('civilStatus', sql.NVarChar, p.civilStatus);
        request.input('religion', sql.NVarChar, p.religion);
        request.input('nationality', sql.NVarChar, p.nationality);
        request.input('occupation', sql.NVarChar, p.occupation);

        request.input('street', sql.NVarChar, p.street);
        request.input('barangay', sql.NVarChar, p.barangay);
        request.input('city', sql.NVarChar, p.city);
        request.input('province', sql.NVarChar, p.province);
        request.input('region', sql.NVarChar, p.region);
        request.input('permanentAddress', sql.NVarChar, p.permanentAddress);
        request.input('landline', sql.NVarChar, p.landline);
        request.input('mobile', sql.NVarChar, p.mobile);
        request.input('email', sql.NVarChar, p.email);

        request.input('fathersName', sql.NVarChar, p.fathersName);
        request.input('fathersAddress', sql.NVarChar, p.fathersAddress);
        request.input('fatherContactNumber', sql.NVarChar, p.fatherContactNumber);
        request.input('mothersName', sql.NVarChar, p.mothersName);
        request.input('mothersAddress', sql.NVarChar, p.mothersAddress);
        request.input('motherContactNumber', sql.NVarChar, p.motherContactNumber);
        
        request.input('spouseName', sql.NVarChar, p.spouseName);
        request.input('spouseOccupation', sql.NVarChar, p.spouseOccupation);
        request.input('spouseEmployerName', sql.NVarChar, p.spouseEmployerName);
        request.input('spouseEmployerAddress', sql.NVarChar, p.spouseEmployerAddress);
        request.input('spouseEmployerContact', sql.NVarChar, p.spouseEmployerContact);

        request.input('ptSourceIncome', sql.NVarChar, p.ptSourceIncome);
        request.input('specificSourceOfIncome', sql.NVarChar, p.specificSourceOfIncome);
        request.input('seniorpwd', sql.NVarChar, p.seniorpwd); 
        request.input('philhealthId', sql.NVarChar, p.philhealthId);
        request.input('sssgsis', sql.NVarChar, p.sssgsis);     
        request.input('tin', sql.NVarChar, p.tin);             
        request.input('others', sql.NVarChar, p.others);
        
        request.input('ptGrossIncome', sql.NVarChar, p.ptGrossIncome);
        request.input('ptHomeOwnership', sql.NVarChar, p.ptHomeOwnership);
        request.input('ptYearsStay', sql.NVarChar, p.ptYearsStay);
        request.input('ptCars', sql.NVarChar, p.ptCars);
        request.input('ptCarOwnership', sql.NVarChar, p.ptCarOwnership);

        request.input('cpName', sql.NVarChar, p.cpName);
        request.input('cpRelationship', sql.NVarChar, p.cpRelationship);
        request.input('cpLandline', sql.NVarChar, p.cpLandline);
        request.input('cpMobile', sql.NVarChar, p.cpMobile);
        request.input('cpEmail', sql.NVarChar, p.cpEmail);
        request.input('cpAddress', sql.NVarChar, p.cpAddress);
        request.input('cpOccupation', sql.NVarChar, p.cpOccupation);
        request.input('cpEmployerNumber', sql.NVarChar, p.cpEmployerNumber);
        
        request.input('cpIncomeSource', sql.NVarChar, p.cpIncomeSource);
        request.input('cpGrossIncome', sql.NVarChar, p.cpGrossIncome);
        request.input('cpHomeOwnership', sql.NVarChar, p.cpHomeOwnership);
        
        request.input('cpHomeStay', sql.NVarChar, p.cpHomeStay); 
        
        request.input('cpHasCar', sql.NVarChar, p.cpHasCar);
        request.input('cpCarOwnership', sql.NVarChar, p.cpCarOwnership);
        request.input('cpNumberOfCars', sql.NVarChar, p.cpNumberOfCars);

        request.input('mop', sql.NVarChar, p.mop);
        request.input('specificmop', sql.NVarChar, p.specificmop);
        request.input('creditCard', sql.NVarChar, p.creditCard);
        request.input('bank', sql.NVarChar, p.bank);
        request.input('items', sql.NVarChar, p.items);
        request.input('patientType', sql.NVarChar, p.patientType);
        
        request.input('hmo', sql.NVarChar, p.hmo);
        request.input('scidnoOutpatient', sql.NVarChar, p.scidnoOutpatient);
        request.input('philHealth', sql.NVarChar, p.philHealth); 
        request.input('medicalProcedure', sql.NVarChar, p.medicalProcedure);
        request.input('physician', sql.NVarChar, p.physician);

        const patientResult = await request.query(`
            DECLARE @ExistingID INT;
            DECLARE @LinkedPatientNo BIGINT;

            DECLARE @CodeReligion VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.RELIGION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@religion))));
            DECLARE @CodeOccupation VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.OCCUPATION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@occupation))));
            DECLARE @CodeNationality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.NATIONALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@nationality))));
            DECLARE @CodeMunicipality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.MUNICIPALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@city))));
            DECLARE @CodeBarangay VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.BARANGAYS WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@barangay))));
            
            DECLARE @forReview INT;
            IF LOWER(LTRIM(RTRIM(@patientType))) = 'Outpatient'
                SET @forReview = NULL;
            ELSE
                SET @forReview = 0;

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
                    bankAffiliations = @bank, itemsReceived = @items, hmo = @hmo, scidnoOutpatient = @scidnoOutpatient, philHealth = @philHealth, medicalProcedure = @medicalProcedure, physician = @physician, 
                    isAdmitted = 2, 
                    forReview = @forReview
                WHERE patient_id = @ExistingID;

                IF @LinkedPatientNo IS NOT NULL
                BEGIN
                    UPDATE UERMMMC.dbo.PATIENTINFO
                    SET 
                        LASTNAME = @lastName, FIRSTNAME = @firstName, MIDDLENAME = @middleName, SUFFIX = @suffix,
                        DBIRTH = @birthdate, BPLACE = @birthplace, AGE = @age, SEX = @gender, STATUS = @civilStatus,
                        RELIGION = @CodeReligion, NATIONALITY = @CodeNationality, OCCUPATION = @CodeOccupation,
                        BARANGAY = @CodeBarangay, MUNICIPALITY = @CodeMunicipality,
                        INCASE = @cpName, RELATIONSHIP = @cpRelationship, INCASEPHONENO = ISNULL(@cpLandline, @cpMobile), INCASEADD = @cpAddress,
                        PHONENOS = @cpLandline, MOBILENO = @cpMobile,
                        NAMEOFSPOUSE = @spouseName, SPOUSEOCCUPATION = @spouseOccupation, EMPLOYER = @spouseEmployerName, EMPLOYERADD = @spouseEmployerAddress, EMPLOYERTELNO = @spouseEmployerContact,
                        FATHER = @fathersName, FADDRESS = @fathersAddress, FTEL = @fatherContactNumber,
                        MOTHER = @mothersName, MADDRESS = @mothersAddress, MTEL = @motherContactNumber,
                        SSSNO = @sssgsis, TINNO = @tin, SCIDNO = @seniorpwd, UDF_PHILHEALTHNO = @philhealthId
                    WHERE PATIENTNO = @LinkedPatientNo;
                END

                SELECT @ExistingID AS patient_id, 'UPDATED' AS status;
            END
            ELSE
            BEGIN
                INSERT INTO PatientRegistration (
                    lastName, firstName, middleName, suffix, birthdate, birthplace, age, sex, 
                    civilStatus, religion, nationality, landline, mobile, email, occupation, 
                    addressStreet, addressBarangay, addressCity, addressProvince, addressRegion,
                    addressPermanent, ptFatherName, ptFatherAddress, 
                    ptFatherContact, ptMotherMaidenName, ptMotherAddress, ptMotherContact, 
                    ptSourceIncome, specificSourceOfIncome, seniorId, philhealthId,
                    sssgsisId, tinID, others, ptGrossIncome, ptHomeOwnership,
                    ptYearsStay, spouseName, spouseOccupation, spouseEmployerContact, ptCars, 
                    ptCarOwnership, cpName, cpRelationship, cpLandline, cpMobile, cpEmail,
                    cpAddress, cpOccupation, cpEmployerNumber, spouseEmployerName, spouseEmployerAddress,
                    cpIncomeSource, cpGrossIncome, cpHomeOwnership, cpHomeStay,
                    cpHasCar, cpCarOwnership, cpNumberOfCars, modeOfPayment, specificModeOfPayment, creditCards, 
                    bankAffiliations, itemsReceived, patientType, hmo, scidnoOutpatient, philHealth, medicalProcedure, physician,
                    forReview, 
                    createdAt
                )
                VALUES (
                    @lastName, @firstName, @middleName, @suffix, @birthdate, @birthplace, @age, @gender,
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
                    @cpCarOwnership, @cpNumberOfCars, @mop, @specificmop, @creditCard, @bank, @items, @patientType, @hmo, @scidnoOutpatient, @philHealth, @medicalProcedure, @physician,
                    @forReview,
                    GETDATE()
                );

                SELECT SCOPE_IDENTITY() AS patient_id, 'INSERTED' AS status;
            END
        `);

        let newPatientID;
        let actionStatus;

        if (patientResult && patientResult.recordset && patientResult.recordset.length > 0) {
            newPatientID = patientResult.recordset[0].patient_id;
            actionStatus = patientResult.recordset[0].status;
        }

        if (p.signature && newPatientID) {
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
                    INSERT (patient_id, eSignature) VALUES (source.patient_id, source.eSignature);
            `);
        }

        await transaction.commit();
        
        return { patientId: newPatientID, status: actionStatus };

    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error("Model Error (upsertPatient):", err);
        throw err;
    }
},

updatePatientDetails: async (id, data, reviewedBy) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('patientId', sql.Int, id);
        request.input('reviewedBy', sql.NVarChar, reviewedBy); 

        request.input('ptSourceIncome', sql.NVarChar, data.ptSourceIncome);
        request.input('specificSourceOfIncome', sql.NVarChar, data.specificSourceOfIncome);
        request.input('ptGrossIncome', sql.NVarChar, data.ptGrossIncome);
        request.input('ptHomeOwnership', sql.NVarChar, data.ptHomeOwnership);
        request.input('ptYearsStay', sql.NVarChar, data.ptYearsStay);
        request.input('ptCars', sql.NVarChar, data.ptCars);
        request.input('ptCarOwnership', sql.NVarChar, data.ptCarOwnership);
        request.input('ptNumberOfCars', sql.NVarChar, data.ptNumberOfCars);

        request.input('cpIncomeSource', sql.NVarChar, data.cpIncomeSource);
        request.input('cpGrossIncome', sql.NVarChar, data.cpGrossIncome);
        request.input('cpHomeOwnership', sql.NVarChar, data.cpHomeOwnership);
        request.input('cpHomeStay', sql.NVarChar, data.cpHomeStay);
        request.input('cpHasCar', sql.NVarChar, data.cpHasCar);
        request.input('cpCarOwnership', sql.NVarChar, data.cpCarOwnership);
        request.input('cpNumberOfCars', sql.NVarChar, data.cpNumberOfCars);

        request.input('modeOfPayment', sql.NVarChar, data.modeOfPayment);
        request.input('specificModeOfPayment', sql.NVarChar, data.specificModeOfPayment);
        request.input('creditCards', sql.NVarChar, data.creditCards);
        request.input('bankAffiliations', sql.NVarChar, data.bankAffiliations);

        request.input('hmoName', sql.NVarChar, data.hmoName);
        request.input('hmoMemberId', sql.NVarChar, data.hmoMemberId);
        request.input('hmoValidityDate', sql.NVarChar, data.hmoValidityDate);
        request.input('hmoStaffName', sql.NVarChar, data.hmoStaffName);
        request.input('hmoApprovalDate', sql.NVarChar, data.hmoApprovalDate);
        request.input('desiredRoom', sql.NVarChar, data.desiredRoom);
        request.input('informedIncrement', sql.NVarChar, data.informedIncrement);

        await request.query(`
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
            hmoId = @hmoMemberId,
            hmoValidity = @hmoValidityDate,
            hmoStaffName = @hmoStaffName,
            hmoApprovalDate = @hmoApprovalDate,
            desiredRoomAvailable = @desiredRoom,
            informedIncrement = @informedIncrement,
            
            reviewedBy = @reviewedBy,
            forReview = 1
        WHERE patient_id = @patientId
        `);

        return true;
    } catch (err) {
        throw err;
    }
},

    getPatientById: async (id) => {
        try {
            const pool = await poolPromise;
            
            const request1 = pool.request();
            request1.input('patientId', sql.BigInt, id);
            
            const result1 = await request1.query(`
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
                
                LEFT JOIN UERMMMC.dbo.RELIGION REL ON PR.religion = REL.CODE 
                LEFT JOIN UERMMMC.dbo.OCCUPATION OCC ON PR.occupation = OCC.CODE
                LEFT JOIN UERMMMC.dbo.NATIONALITY NAT ON PR.nationality = NAT.CODE
                LEFT JOIN UERMMMC.dbo.MUNICIPALITY MUN ON PR.addressCity = MUN.CODE
                LEFT JOIN UERMMMC.dbo.BARANGAYS BRGY ON PR.addressBarangay = BRGY.CODE

                -- Join Signature using ID OR PatientNo
                LEFT JOIN PatientRegistrationDB.dbo.ptSignature PS 
                    ON (PR.patient_id = PS.patient_id OR (PR.patient_no IS NOT NULL AND PR.patient_no = PS.patient_no))
                    
                LEFT JOIN PatientRegistrationDB.dbo.tpSignature TPS 
                    ON (PR.patient_id = TPS.patient_id OR (PR.patient_no IS NOT NULL AND PR.patient_no = TPS.patient_no))

                WHERE PR.patient_id = @patientId OR PR.patient_no = @patientId
            `);

            if (result1.recordset.length > 0) {
                return result1.recordset[0];
            }

            const request2 = pool.request();
            request2.input('patientId', sql.BigInt, id);

            const result2 = await request2.query(`
                SELECT 
                    PATIENTINFO.*, 
                    RELIGION.DESCRIPTION AS RELIGION_NAME,
                    OCCUPATION.DESCRIPTION AS OCCUPATION_NAME,
                    NATIONALITY.DESCRIPTION AS NATIONALITY_NAME,
                    MUNICIPALITY.DESCRIPTION AS MUNICIPALITY_NAME,
                    BARANGAYS.DESCRIPTION AS BARANGAY_NAME,
                    PS.eSignature 
                FROM UERMMMC.dbo.PATIENTINFO 
                
                LEFT JOIN UERMMMC.dbo.RELIGION ON PATIENTINFO.RELIGION = RELIGION.CODE 
                LEFT JOIN UERMMMC.dbo.OCCUPATION ON PATIENTINFO.OCCUPATION = OCCUPATION.CODE
                LEFT JOIN UERMMMC.dbo.NATIONALITY ON PATIENTINFO.NATIONALITY = NATIONALITY.CODE
                LEFT JOIN UERMMMC.dbo.MUNICIPALITY ON PATIENTINFO.MUNICIPALITY = MUNICIPALITY.CODE
                LEFT JOIN UERMMMC.dbo.BARANGAYS ON PATIENTINFO.BARANGAY = BARANGAYS.CODE
                
                -- Legacy signature join relies on patient_no
                LEFT JOIN PatientRegistrationDB.dbo.ptSignature PS 
                    ON PATIENTINFO.PATIENTNO = PS.patient_no

                WHERE PATIENTINFO.PATIENTNO = @patientId
            `);

            if (result2.recordset.length > 0) {
                return result2.recordset[0];
            }

            return null; 

        } catch (err) {
            throw err;
        }
},

    checkPatientExists: async (id) => {
        try {
            const pool = await poolPromise;

            const request1 = pool.request();
            request1.input('patientId', sql.BigInt, id);
            
            const result1 = await request1.query(`
                SELECT TOP 1 1 FROM PatientRegistration WHERE patient_no = @patientId
            `);

            if (result1.recordset.length > 0) {
                return { exists: true, source: 'REGISTRATION' };
            }

            const request2 = pool.request();
            request2.input('patientId', sql.BigInt, id);

            const result2 = await request2.query(`
                SELECT TOP 1 1 FROM UERMMMC.dbo.PATIENTINFO WHERE PATIENTNO = @patientId
            `);

            if (result2.recordset.length > 0) {
                return { exists: true, source: 'INFO' };
            }

            return { exists: false, source: null };

        } catch (err) {
            throw err;
        }
},

    linkPatientRecord: async (regID, patientNo) => {
        let transaction;
        try {
            const pool = await poolPromise;
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            const request = new sql.Request(transaction);
            request.input('regID', sql.BigInt, regID);
            request.input('patientno', sql.BigInt, patientNo);

            await request.query(`
                -- 1. Link Signatures
                UPDATE PatientRegistrationDB.dbo.ptSignature
                SET patient_no = @patientno
                WHERE patient_id = @regID;

                UPDATE PatientRegistrationDB.dbo.tpSignature
                SET patient_no = @patientno
                WHERE patient_id = @regID;

                -- 2. Sync Data FROM Legacy TO Registration (Resolving Codes to Descriptions)
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

                -- 3. Sync Age FROM Registration TO Legacy
                UPDATE HospitalTarget
                SET HospitalTarget.AGE = RegSource.age
                FROM UERMMMC.dbo.PATIENTINFO AS HospitalTarget
                INNER JOIN PatientRegistrationDB.dbo.PatientRegistration AS RegSource
                    ON RegSource.patient_id = @regID
                WHERE HospitalTarget.PATIENTNO = @patientno;
            `);

            await transaction.commit();
            return true;

        } catch (err) {
            if (transaction) await transaction.rollback();
            throw err;
        }
},

    transferPatientToLegacy: async (id, force) => {
        let transaction;
        try {
            const pool = await poolPromise;
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            const requestSource = new sql.Request(transaction);
            requestSource.input('id', sql.BigInt, id);
            
            const sourceData = await requestSource.query(`
                SELECT lastName, firstName, middleName, suffix, birthdate 
                FROM PatientRegistrationDB.dbo.PatientRegistration 
                WHERE patient_id = @id
            `);

            if (sourceData.recordset.length === 0) {
                await transaction.rollback();
                return { status: 'NOT_FOUND' };
            }

            const { lastName, firstName, birthdate } = sourceData.recordset[0];

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
                    const matches = duplicateCheck.recordset.map(match => ({
                        existingPatientNo: match.PATIENTNO,
                        firstName: match.FIRSTNAME,
                        lastName: match.LASTNAME,
                        middleName: match.MIDDLENAME,
                        suffix: match.SUFFIX,
                        birthdate: match.DBIRTH,
                        age: match.AGE
                    }));
                    return { status: 'DUPLICATE', matches };
                }
            }

            const requestTransfer = new sql.Request(transaction);
            requestTransfer.input('id', sql.BigInt, id);

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
            return { status: 'SUCCESS' };

        } catch (err) {
            if (transaction && transaction._aborted === false) {
                await transaction.rollback();
            }
            throw err;
        }
},

    searchInpatientRecords: async (searchTerm) => {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            const maxResults = 50;
            
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

            const isNumeric = /^\d+$/.test(searchTerm);

            if (isNumeric) {
                sqlQuery += ` AND (PATIENTNO LIKE @exactId OR PATIENTNO LIKE @partialId) `;
                request.input('exactId', sql.VarChar, searchTerm);
                request.input('partialId', sql.VarChar, `${searchTerm}%`);
            } else {
                const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);
                
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
            return result.recordset;

        } catch (err) {
            throw err;
        }
},

    searchOutpatientRecords: async (searchTerm) => {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const exactId = isNaN(searchTerm) ? 0 : parseInt(searchTerm);

            request.input('search', sql.NVarChar, `%${searchTerm}%`);
            request.input('exactId', sql.Int, exactId);

            const result = await request.query(`
                SELECT *,
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                    ISNULL(middleName, '') as middleName, 
                    sex as gender,
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdateStr,
                    CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent
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

            return result.recordset;

        } catch (err) {
            throw err;
        }
},

// searchFinanceRecord: async (query) => {
//         try {
//             const pool = await poolPromise;
//             const request = pool.request();
            
//             let sqlQuery = `
//                 SELECT TOP 20 
//                     *, 
//                     (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
//                     sex as gender, 
//                     CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent
//                 FROM PatientRegistration
//                 WHERE 
//                     (forReview = 'True' OR forReview = 'False')
//             `;

//             const isNumeric = /^\d+$/.test(query.trim()); 

//             if (isNumeric) {
//                 sqlQuery += ` AND CAST(patient_id AS VARCHAR) LIKE @numericId `;
//                 request.input('numericId', sql.VarChar, `${query}%`);
            
//             } else {
//                 const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
                
//                 searchTerms.forEach((term, index) => {
//                     const paramName = `term${index}`;
                    
//                     request.input(paramName, sql.NVarChar, `%${term}%`);
                    
//                     sqlQuery += ` 
//                         AND (
//                             lastName LIKE @${paramName} 
//                             OR firstName LIKE @${paramName}
//                             OR middleName LIKE @${paramName}
//                         ) 
//                     `;
//                 });
//             }

//             sqlQuery += ` ORDER BY lastName, firstName`;

//             const result = await request.query(sqlQuery);
//             return result.recordset;

//         } catch (err) {
//             console.error("Model Error (searchFinanceRecord):", err);
//             throw err;
//         }
//     },

searchFinanceRecord: async (query) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        const cleanQuery = (query || '').toString().trim();

        let sqlQuery = `
            SELECT TOP 20 
                *, 
                (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                sex as gender, 
                CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent
            FROM PatientRegistration
            WHERE 
                (forReview = 0 OR forReview = 1)
        `;

        const isNumeric = /^\d+$/.test(cleanQuery);

        if (isNumeric) {
            sqlQuery += ` AND CAST(patient_id AS VARCHAR) LIKE @numericId `;
            request.input('numericId', sql.VarChar, `${cleanQuery}%`);
        } else {
            const searchTerms = cleanQuery.split(/\s+/).filter(term => term.length > 0);
            
            searchTerms.forEach((term, index) => {
                const paramName = `term${index}`;
                request.input(paramName, sql.NVarChar, `%${term}%`);
                
                sqlQuery += ` 
                    AND (
                        lastName LIKE @${paramName} 
                        OR firstName LIKE @${paramName}
                        OR middleName LIKE @${paramName}
                        OR (firstName + ' ' + lastName) LIKE @${paramName}
                    ) 
                `;
            });
        }

        sqlQuery += ` ORDER BY lastName, firstName`;

        const result = await request.query(sqlQuery);
        return result.recordset;

    } catch (err) {
        console.error("Model Error (searchFinanceRecord):", err);
        throw err;
    }
},

    fetchInpatientRecords: async () => {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const result = await request.query(`
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

            return result.recordset;

        } catch (err) {
            throw err;
        }
},

    fetchOutpatientRecords: async () => {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const result = await request.query(`
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

            return result.recordset;

        } catch (err) {
            throw err;
        }
},

    getAllPatients: async () => {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const result = await request.query(`
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

            return result.recordset;

        } catch (err) {
            throw err;
        }
},

    getSignatureByPatientId: async (id) => {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            request.input('pId', sql.BigInt, id);

            const result = await request.query(`
                SELECT eSignature 
                FROM PatientRegistrationDB.dbo.ptSignature 
                WHERE patient_id = @pId
            `);

            return result.recordset.length > 0 ? result.recordset[0] : null;

        } catch (err) {
            throw err;
        }
},

sendToCredit: async (patient_id) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        
        if (!patient_id) throw new Error("Patient ID is missing in Model");

        request.input('patient_id', sql.Int, patient_id); 

        await request.query(`
            UPDATE PatientRegistration
            SET forReview = 0 
            WHERE patient_id = @patient_id
        `);

        return true; 
    } catch (error) {
        console.error('Model Error (sendToCredit):', error);
        throw error; 
    }
}

};

module.exports = PatientModel;