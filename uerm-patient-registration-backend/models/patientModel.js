const { sql, poolPromise } = require('../config/sqlHelper');

const PatientModel = {

    upsertPatient: async (p) => {
    let transaction;
    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request = new sql.Request(transaction);

        request.input('lastName', sql.NVarChar, p.lastName ? p.lastName.toUpperCase() : null);
        request.input('firstName', sql.NVarChar, p.firstName ? p.firstName.toUpperCase() : null);
        request.input('middleName', sql.NVarChar, p.middleName ? p.middleName.toUpperCase() : null);
        request.input('suffix', sql.NVarChar, p.suffix ? p.suffix.toUpperCase() : null);
        request.input('birthdate', sql.NVarChar, p.birthdate);   
        request.input('birthplace', sql.NVarChar, p.birthplace ? p.birthplace.toUpperCase() : null); 
        request.input('age', sql.Int, p.age);
        request.input('gender', sql.NVarChar, p.gender ? p.gender.toUpperCase() : null);
        request.input('civilStatus', sql.NVarChar, p.civilStatus ? p.civilStatus.toUpperCase() : null);
        request.input('religion', sql.NVarChar, p.religion ? p.religion.toUpperCase() : null);
        request.input('nationality', sql.NVarChar, p.nationality ? p.nationality.toUpperCase() : null);
        request.input('occupation', sql.NVarChar, p.occupation ? p.occupation.toUpperCase() : null);

        request.input('street', sql.NVarChar, p.street ? p.street.toUpperCase() : null);
        request.input('barangay', sql.NVarChar, p.barangay ? p.barangay.toUpperCase() : null);
        request.input('city', sql.NVarChar, p.city ? p.city.toUpperCase() : null);
        request.input('province', sql.NVarChar, p.province ? p.province.toUpperCase() : null);
        request.input('region', sql.NVarChar, p.region ? p.region.toUpperCase() : null);
        request.input('permanentAddress', sql.NVarChar, p.permanentAddress ? p.permanentAddress.toUpperCase() : null);
        request.input('landline', sql.NVarChar, p.landline ? p.landline.toUpperCase() : null);
        request.input('mobile', sql.NVarChar, p.mobile ? p.mobile.toUpperCase() : null);
        request.input('email', sql.NVarChar, p.email ? p.email.toUpperCase() : null);

        request.input('fathersName', sql.NVarChar, p.fathersName ? p.fathersName.toUpperCase() : null);
        request.input('fathersAddress', sql.NVarChar, p.fathersAddress ? p.fathersAddress.toUpperCase() : null);
        request.input('fatherContactNumber', sql.NVarChar, p.fatherContactNumber ? p.fatherContactNumber.toUpperCase() : null);
        request.input('mothersName', sql.NVarChar, p.mothersName ? p.mothersName.toUpperCase() : null);
        request.input('mothersAddress', sql.NVarChar, p.mothersAddress ? p.mothersAddress.toUpperCase() : null);
        request.input('motherContactNumber', sql.NVarChar, p.motherContactNumber ? p.motherContactNumber.toUpperCase() : null);
        
        request.input('spouseName', sql.NVarChar, p.spouseName ? p.spouseName.toUpperCase() : null);
        request.input('spouseOccupation', sql.NVarChar, p.spouseOccupation ? p.spouseOccupation.toUpperCase() : null);
        request.input('spouseEmployerName', sql.NVarChar, p.spouseEmployerName ? p.spouseEmployerName.toUpperCase() : null);
        request.input('spouseEmployerAddress', sql.NVarChar, p.spouseEmployerAddress ? p.spouseEmployerAddress.toUpperCase() : null);
        request.input('spouseEmployerContact', sql.NVarChar, p.spouseEmployerContact ? p.spouseEmployerContact.toUpperCase() : null);

        request.input('ptSourceIncome', sql.NVarChar, p.ptSourceIncome ? p.ptSourceIncome.toUpperCase() : null);
        request.input('specificSourceOfIncome', sql.NVarChar, p.specificSourceOfIncome ? p.specificSourceOfIncome.toUpperCase() : null);
        request.input('seniorpwd', sql.NVarChar, p.seniorpwd ? p.seniorpwd.toUpperCase() : null); 
        request.input('philhealthId', sql.NVarChar, p.philhealthId ? p.philhealthId.toUpperCase() : null);
        request.input('sssgsis', sql.NVarChar, p.sssgsis ? p.sssgsis.toUpperCase() : null);     
        request.input('tin', sql.NVarChar, p.tin ? p.tin.toUpperCase() : null);             
        request.input('pwd', sql.NVarChar, p.pwd ? p.pwd.toUpperCase() : null);
        
        request.input('ptGrossIncome', sql.NVarChar, p.ptGrossIncome ? p.ptGrossIncome.toUpperCase() : null);
        request.input('ptHomeOwnership', sql.NVarChar, p.ptHomeOwnership ? p.ptHomeOwnership.toUpperCase() : null);
        request.input('ptYearsStay', sql.NVarChar, p.ptYearsStay ? p.ptYearsStay.toUpperCase() : null);
        request.input('ptCars', sql.NVarChar, p.ptCars ? p.ptCars.toUpperCase() : null);
        request.input('ptCarOwnership', sql.NVarChar, p.ptCarOwnership ? p.ptCarOwnership.toUpperCase() : null);

        request.input('cpName', sql.NVarChar, p.cpName ? p.cpName.toUpperCase() : null);
        request.input('cpRelationship', sql.NVarChar, p.cpRelationship ? p.cpRelationship.toUpperCase() : null);
        request.input('cpLandline', sql.NVarChar, p.cpLandline ? p.cpLandline.toUpperCase() : null);
        request.input('cpMobile', sql.NVarChar, p.cpMobile ? p.cpMobile.toUpperCase() : null);
        request.input('cpEmail', sql.NVarChar, p.cpEmail ? p.cpEmail.toUpperCase() : null);
        request.input('cpAddress', sql.NVarChar, p.cpAddress ? p.cpAddress.toUpperCase() : null);
        request.input('cpOccupation', sql.NVarChar, p.cpOccupation ? p.cpOccupation.toUpperCase() : null);
        request.input('cpEmployerNumber', sql.NVarChar, p.cpEmployerNumber ? p.cpEmployerNumber.toUpperCase() : null);
        
        request.input('cpIncomeSource', sql.NVarChar, p.cpIncomeSource ? p.cpIncomeSource.toUpperCase() : null);
        request.input('cpGrossIncome', sql.NVarChar, p.cpGrossIncome ? p.cpGrossIncome.toUpperCase() : null);
        request.input('cpHomeOwnership', sql.NVarChar, p.cpHomeOwnership ? p.cpHomeOwnership.toUpperCase() : null);
        
        request.input('cpHomeStay', sql.NVarChar, p.cpHomeStay ? p.cpHomeStay.toUpperCase() : null); 
        
        request.input('cpHasCar', sql.NVarChar, p.cpHasCar ? p.cpHasCar.toUpperCase() : null);
        request.input('cpCarOwnership', sql.NVarChar, p.cpCarOwnership ? p.cpCarOwnership.toUpperCase() : null);
        request.input('cpNumberOfCars', sql.NVarChar, p.cpNumberOfCars ? p.cpNumberOfCars.toUpperCase() : null);

        request.input('mop', sql.NVarChar, p.mop ? p.mop.toUpperCase() : null);
        request.input('specificmop', sql.NVarChar, p.specificmop ? p.specificmop.toUpperCase() : null);
        request.input('creditCard', sql.NVarChar, p.creditCard ? p.creditCard.toUpperCase() : null);
        request.input('bank', sql.NVarChar, p.bank ? p.bank.toUpperCase() : null);
        request.input('items', sql.NVarChar, p.items ? p.items.toUpperCase() : null);
        request.input('patientType', sql.NVarChar, p.patientType ? p.patientType.toUpperCase() : null);
        
        request.input('hmo', sql.NVarChar, p.hmo ? p.hmo.toUpperCase() : null);
        request.input('scidnoOutpatient', sql.NVarChar, p.scidnoOutpatient ? p.scidnoOutpatient.toUpperCase() : null);
        request.input('philHealth', sql.NVarChar, p.philHealth ? p.philHealth.toUpperCase() : null); 
        request.input('medicalProcedure', sql.NVarChar, p.medicalProcedure ? p.medicalProcedure.toUpperCase() : null);
        request.input('physician', sql.NVarChar, p.physician ? p.physician.toUpperCase() : null);

        const patientResult = await request.query(`
            DECLARE @ExistingID INT;
            DECLARE @LinkedPatientNo BIGINT; -- Note: If PATIENTNO is VARCHAR(14) in your DB, you may want to change this to VARCHAR(14)!

            DECLARE @CodeReligion VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.RELIGION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@religion))));
            DECLARE @CodeOccupation VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.OCCUPATION WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@occupation))));
            DECLARE @CodeNationality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.NATIONALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@nationality))));
            DECLARE @CodeMunicipality VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.MUNICIPALITY WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@city))));
            DECLARE @CodeBarangay VARCHAR(50) = (SELECT TOP 1 CODE FROM UERMMMC.dbo.BARANGAYS WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(@barangay))));
            
            DECLARE @forReview INT;
            DECLARE @isAdmitted INT; 
            IF LOWER(LTRIM(RTRIM(@patientType))) = 'Outpatient'
            BEGIN
                SET @forReview = NULL;
                SET @isAdmitted = NULL;
            END
            ELSE
            BEGIN
                SET @forReview = 1;
                SET @isAdmitted = 0; 
            END

            SELECT TOP 1 
                @ExistingID = ID,
                @LinkedPatientNo = PATIENTNO 
                    FROM PATIENTREG 
                    WHERE LASTNAME = @lastName 
                    AND FIRSTNAME = @firstName 
                    AND CAST(BIRTHDATE AS DATE) = CAST(@birthdate AS DATE)
                    AND ISNULL(MIDDLENAME, '') = ISNULL(@middleName, '')
                    AND ISNULL(SUFFIX, '') = ISNULL(@suffix, '');

            IF @ExistingID IS NOT NULL
            BEGIN
                UPDATE PATIENTREG
                SET 
                    AGE = @age, BIRTHPLACE = @birthplace, SEX = @gender, 
                    CIVILSTATUS = @civilStatus, RELIGION = @religion, NATIONALITY = @nationality, LANDLINE = @landline, 
                    MOBILE = @mobile, EMAIL = @email, OCCUPATION = @occupation,
                    ADDRESSSTREET = @street, ADDRESSBARANGAY = @barangay, ADDRESSCITY = @city, ADDRESSPROVINCE = @province, ADDRESSREGION = @region,
                    ADDRESSPERMANENT = @permanentAddress, PTFATHERNAME = @fathersName, PTFATHERADDRESS = @fathersAddress,
                    PTFATHERCONTACT = @fatherContactNumber, PTMOTHERMAIDENNAME = @mothersName, PTMOTHERADDRESS = @mothersAddress, PTMOTHERCONTACT = @motherContactNumber,
                    PTSOURCEINCOME = @ptSourceIncome, SPECIFICSOURCEOFINCOME = @specificSourceOfIncome, SENIORID = @seniorpwd, PHILHEALTHID = @philhealthId,
                    SSSGSISID = @sssgsis, TINID = @tin, PWD = @pwd, PTGROSSINCOME = @ptGrossIncome, PTHOMEOWNERSHIP = @ptHomeOwnership,
                    PTYEARSSTAY = @ptYearsStay, SPOUSENAME = @spouseName, SPOUSEOCCUPATION = @spouseOccupation, SPOUSEEMPLOYERCONTACT = @spouseEmployerContact, PTCARS = @ptCars,
                    PTCAROWNERSHIP = @ptCarOwnership, CPNAME = @cpName, CPRELATIONSHIP = @cpRelationship, CPLANDLINE = @cpLandline, CPMOBILE = @cpMobile, CPEMAIL = @cpEmail,
                    CPADDRESS = @cpAddress, CPOCCUPATION = @cpOccupation, CPEMPLOYERNUMBER = @cpEmployerNumber, SPOUSEEMPLOYERNAME = @spouseEmployerName, SPOUSEEMPLOYERADDRESS = @spouseEmployerAddress,
                    CPINCOMESOURCE = @cpIncomeSource, CPGROSSINCOME = @cpGrossIncome, CPHOMEOWNERSHIP = @cpHomeOwnership, CPHOMESTAY = @cpHomeStay,
                    CPHASCAR = @cpHasCar, CPCAROWNERSHIP = @cpCarOwnership, CPNUMBEROFCARS = @cpNumberOfCars, MODEOFPAYMENT = @mop, SPECIFICMODEOFPAYMENT = @specificmop, CREDITCARDS = @creditCard,
                    BANKAFFILIATIONS = @bank, ITEMSRECEIVED = @items, HMO = @hmo, SCIDNOOUTPATIENT = @scidnoOutpatient, PHILHEALTH = @philHealth, MEDICALPROCEDURE = @medicalProcedure, PHYSICIAN = @physician, 
                    ISADMITTED = 1, 
                    FORREVIEW = @forReview
                WHERE ID = @ExistingID;

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
                        SSSNO = @sssgsis, TINNO = @tin, SCIDNO = @seniorpwd, UDF_PHILHEALTHNO = @philhealthId, UDF_Module = 'UERMPATIENTREG', UDF_AppName = 'UERMPATIENTREG'
                    WHERE PATIENTNO = @LinkedPatientNo;
                END

                SELECT @ExistingID AS ID, 'UPDATED' AS status;
            END
            ELSE
            BEGIN
                INSERT INTO PATIENTREG (
                    LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX, BIRTHDATE, BIRTHPLACE, AGE, SEX, 
                    CIVILSTATUS, RELIGION, NATIONALITY, LANDLINE, MOBILE, EMAIL, OCCUPATION, 
                    ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION,
                    ADDRESSPERMANENT, PTFATHERNAME, PTFATHERADDRESS, 
                    PTFATHERCONTACT, PTMOTHERMAIDENNAME, PTMOTHERADDRESS, PTMOTHERCONTACT, 
                    PTSOURCEINCOME, SPECIFICSOURCEOFINCOME, SENIORID, PHILHEALTHID,
                    SSSGSISID, TINID, PWD, PTGROSSINCOME, PTHOMEOWNERSHIP,
                    PTYEARSSTAY, SPOUSENAME, SPOUSEOCCUPATION, SPOUSEEMPLOYERCONTACT, PTCARS, 
                    PTCAROWNERSHIP, CPNAME, CPRELATIONSHIP, CPLANDLINE, CPMOBILE, CPEMAIL,
                    CPADDRESS, CPOCCUPATION, CPEMPLOYERNUMBER, SPOUSEEMPLOYERNAME, SPOUSEEMPLOYERADDRESS,
                    CPINCOMESOURCE, CPGROSSINCOME, CPHOMEOWNERSHIP, CPHOMESTAY,
                    CPHASCAR, CPCAROWNERSHIP, CPNUMBEROFCARS, MODEOFPAYMENT, SPECIFICMODEOFPAYMENT, CREDITCARDS, 
                    BANKAFFILIATIONS, ITEMSRECEIVED, PATIENTTYPE, HMO, SCIDNOOUTPATIENT, PHILHEALTH, MEDICALPROCEDURE, PHYSICIAN, ISADMITTED,
                    FORREVIEW, 
                    CREATEDAT
                )
                VALUES (
                    @lastName, @firstName, @middleName, @suffix, @birthdate, @birthplace, @age, @gender,
                    @civilStatus, @religion, @nationality, @landline, @mobile, @email, @occupation,
                    @street, @barangay, @city, @province, @region,
                    @permanentAddress, @fathersName, @fathersAddress,
                    @fatherContactNumber, @mothersName, @mothersAddress, @motherContactNumber,
                    @ptSourceIncome, @specificSourceOfIncome, @seniorpwd, @philhealthId,
                    @sssgsis, @tin, @pwd, @ptGrossIncome, @ptHomeOwnership,
                    @ptYearsStay, @spouseName, @spouseOccupation, @spouseEmployerContact, @ptCars,
                    @ptCarOwnership, @cpName, @cpRelationship, @cpLandline, @cpMobile, @cpEmail,
                    @cpAddress, @cpOccupation, @cpEmployerNumber, @spouseEmployerName, @spouseEmployerAddress,
                    @cpIncomeSource, @cpGrossIncome, @cpHomeOwnership, @cpHomeStay, @cpHasCar, 
                    @cpCarOwnership, @cpNumberOfCars, @mop, @specificmop, @creditCard, @bank, @items, @patientType, @hmo, 
                    @scidnoOutpatient, @philHealth, @medicalProcedure, @physician, @isAdmitted, 0,
                    GETDATE()
                );

                SELECT SCOPE_IDENTITY() AS ID, 'INSERTED' AS status;
            END
        `);

        let newPatientID;
        let actionStatus;

        if (patientResult && patientResult.recordset && patientResult.recordset.length > 0) {
            newPatientID = patientResult.recordset[0].ID; 
            actionStatus = patientResult.recordset[0].status;
        }

        if (p.signature && newPatientID) {
            const cleanSignature = p.signature.replace(/^data:image\/\w+;base64,/, "");
            const finalSignatureBuffer = Buffer.from(cleanSignature, 'base64');

            const signRequest = new sql.Request(transaction);
            signRequest.input('pId', sql.Int, newPatientID);
            
            signRequest.input('patientNo', sql.VarChar(14), p.patientNo); 
            
            signRequest.input('signData', sql.VarBinary(sql.MAX), finalSignatureBuffer);

            await signRequest.query(`
                MERGE PATIENTREG_PTSIGNATURE AS target
                USING (SELECT @pId AS ID, @patientNo AS PATIENTNO, @signData AS SIGNATURE) AS source
                ON (target.ID = source.ID)
                WHEN MATCHED THEN
                    UPDATE SET SIGNATURE = source.SIGNATURE
                WHEN NOT MATCHED THEN
                    INSERT (ID, PATIENTNO, SIGNATURE) VALUES (source.ID, source.PATIENTNO, source.SIGNATURE);
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
        request.input('reviewedBy', sql.NVarChar, reviewedBy ? reviewedBy.toUpperCase() : null); 

        request.input('ptSourceIncome', sql.NVarChar, data.ptSourceIncome ? data.ptSourceIncome.toUpperCase() : null);
        request.input('specificSourceOfIncome', sql.NVarChar, data.specificSourceOfIncome ? data.specificSourceOfIncome.toUpperCase() : null);
        request.input('ptGrossIncome', sql.NVarChar, data.ptGrossIncome ? data.ptGrossIncome.toUpperCase() : null);
        request.input('ptHomeOwnership', sql.NVarChar, data.ptHomeOwnership ? data.ptHomeOwnership.toUpperCase() : null);
        request.input('ptYearsStay', sql.NVarChar, data.ptYearsStay ? data.ptYearsStay.toUpperCase() : null);
        request.input('ptCars', sql.NVarChar, data.ptCars ? data.ptCars.toUpperCase() : null);
        request.input('ptCarOwnership', sql.NVarChar, data.ptCarOwnership ? data.ptCarOwnership.toUpperCase() : null);
        request.input('ptNumberOfCars', sql.NVarChar, data.ptNumberOfCars ? data.ptNumberOfCars.toUpperCase() : null);

        request.input('cpIncomeSource', sql.NVarChar, data.cpIncomeSource ? data.cpIncomeSource.toUpperCase() : null);
        request.input('cpGrossIncome', sql.NVarChar, data.cpGrossIncome ? data.cpGrossIncome.toUpperCase() : null);
        request.input('cpHomeOwnership', sql.NVarChar, data.cpHomeOwnership ? data.cpHomeOwnership.toUpperCase() : null);
        request.input('cpHomeStay', sql.NVarChar, data.cpHomeStay ? data.cpHomeStay.toUpperCase() : null);
        request.input('cpHasCar', sql.NVarChar, data.cpHasCar ? data.cpHasCar.toUpperCase() : null);
        request.input('cpCarOwnership', sql.NVarChar, data.cpCarOwnership ? data.cpCarOwnership.toUpperCase() : null);
        request.input('cpNumberOfCars', sql.NVarChar, data.cpNumberOfCars ? data.cpNumberOfCars.toUpperCase() : null);

        request.input('modeOfPayment', sql.NVarChar, data.modeOfPayment ? data.modeOfPayment.toUpperCase() : null);
        request.input('specificModeOfPayment', sql.NVarChar, data.specificModeOfPayment ? data.specificModeOfPayment.toUpperCase() : null);
        request.input('creditCards', sql.NVarChar, data.creditCards ? data.creditCards.toUpperCase() : null);
        request.input('bankAffiliations', sql.NVarChar, data.bankAffiliations ? data.bankAffiliations.toUpperCase() : null);

        request.input('hmoName', sql.NVarChar, data.hmoName ? data.hmoName.toUpperCase() : null);
        request.input('hmoMemberId', sql.NVarChar, data.hmoMemberId ? data.hmoMemberId.toUpperCase() : null);
        request.input('hmoValidityDate', sql.NVarChar, data.hmoValidityDate ? data.hmoValidityDate.toUpperCase() : null);
        request.input('hmoStaffName', sql.NVarChar, data.hmoStaffName ? data.hmoStaffName.toUpperCase() : null);
        request.input('hmoApprovalDate', sql.NVarChar, data.hmoApprovalDate ? data.hmoApprovalDate.toUpperCase() : null);
        request.input('desiredRoom', sql.NVarChar, data.desiredRoom ? data.desiredRoom.toUpperCase() : null);
        request.input('informedIncrement', sql.NVarChar, data.informedIncrement ? data.informedIncrement.toUpperCase() : null);

        await request.query(`
        UPDATE PATIENTREG
        SET 
            PTSOURCEINCOME = @ptSourceIncome,
            SPECIFICSOURCEOFINCOME = @specificSourceOfIncome,
            PTGROSSINCOME = @ptGrossIncome,
            PTHOMEOWNERSHIP = @ptHomeOwnership,
            PTYEARSSTAY = @ptYearsStay,
            PTCARS = @ptCars,
            PTCAROWNERSHIP = @ptCarOwnership,
            PTNUMBEROFCARS = @ptNumberOfCars, 

            CPINCOMESOURCE = @cpIncomeSource,
            CPGROSSINCOME = @cpGrossIncome,
            CPHOMEOWNERSHIP = @cpHomeOwnership,
            CPHOMESTAY = @cpHomeStay,
            CPHASCAR = @cpHasCar,
            CPCAROWNERSHIP = @cpCarOwnership,
            CPNUMBEROFCARS = @cpNumberOfCars, 

            MODEOFPAYMENT = @modeOfPayment,
            SPECIFICMODEOFPAYMENT = @specificModeOfPayment,
            CREDITCARDS = @creditCards,
            BANKAFFILIATIONS = @bankAffiliations,
            
            HMO = @hmoName,
            HMOID = @hmoMemberId,
            HMOVALIDITY = @hmoValidityDate,
            HMOSTAFFNAME = @hmoStaffName,
            HMOAPPROVALDATE = @hmoApprovalDate,
            DESIREDROOMAVAILABLE = @desiredRoom,
            INFORMEDINCREMENT = @informedIncrement,
            
            REVIEWEDBY = @reviewedBy,
            FORREVIEW = 1
        WHERE ID = @patientId
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
                
                PS.SIGNATURE AS eSignature, 
                TPS.TPSIGNATURE AS personnelSignature, 
                TPS.NAME AS personnel_name                     
            FROM PATIENTREG PR

            LEFT JOIN UERMMMC.dbo.RELIGION REL ON PR.RELIGION = REL.CODE 
            LEFT JOIN UERMMMC.dbo.OCCUPATION OCC ON PR.OCCUPATION = OCC.CODE
            LEFT JOIN UERMMMC.dbo.NATIONALITY NAT ON PR.NATIONALITY = NAT.CODE
            LEFT JOIN UERMMMC.dbo.MUNICIPALITY MUN ON PR.ADDRESSCITY = MUN.CODE
            LEFT JOIN UERMMMC.dbo.BARANGAYS BRGY ON PR.ADDRESSBARANGAY = BRGY.CODE

            LEFT JOIN UERMMMC.dbo.PATIENTREG_PTSIGNATURE PS 
                ON (PR.ID = PS.ID OR (PR.PATIENTNO IS NOT NULL AND PR.PATIENTNO = PS.PATIENTNO))
                
            LEFT JOIN UERMMMC.dbo.PATIENTREG_TPSIGNATURE TPS 
                ON (PR.ID = TPS.ID OR (PR.PATIENTNO IS NOT NULL AND PR.PATIENTNO = TPS.PATIENTNO))

            WHERE PR.ID = @patientId OR PR.PATIENTNO = @patientId
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
                SELECT TOP 1 1 FROM PATIENTREG WHERE PATIENTNO = @patientId
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
            UPDATE UERMMMC.dbo.PATIENTREG_PTSIGNATURE
            SET PATIENTNO = @patientno
            WHERE ID = @regID;

            UPDATE UERMMMC.dbo.PATIENTREG_TPSIGNATURE
            SET PATIENTNO = @patientno
            WHERE ID = @regID;

            UPDATE Target
            SET 
                Target.PATIENTNO = @patientno,
                Target.ISVALIDATED = 1,
                Target.ISRETURNING = 1,

                Target.LASTNAME = Source.LASTNAME,
                Target.FIRSTNAME = Source.FIRSTNAME,
                Target.MIDDLENAME = Source.MIDDLENAME,
                Target.SUFFIX = Source.SUFFIX,

                Target.ADDRESSBARANGAY = B.DESCRIPTION,
                Target.ADDRESSCITY = M.DESCRIPTION,
                Target.RELIGION = R.DESCRIPTION,
                Target.NATIONALITY = N.DESCRIPTION,
                Target.OCCUPATION = O.DESCRIPTION,

                Target.SEX = Source.SEX,
                Target.CIVILSTATUS = Source.STATUS,
                Target.BIRTHDATE = Source.DBIRTH,
                Target.BIRTHPLACE = Source.BPLACE,

                Target.CPNAME = Source.INCASE,
                Target.CPRELATIONSHIP = Source.RELATIONSHIP,
                Target.CPADDRESS = Source.INCASEADD,
                Target.CPLANDLINE = COALESCE(Source.PHONENOS, Source.INCASEPHONENO),
                Target.CPMOBILE = Source.MOBILENO,

                Target.SPOUSENAME = Source.NAMEOFSPOUSE,
                Target.SPOUSEOCCUPATION = Source.SPOUSEOCCUPATION,
                Target.SPOUSEEMPLOYERNAME = Source.EMPLOYER,     
                Target.SPOUSEEMPLOYERADDRESS = Source.EMPLOYERADD, 
                Target.SPOUSEEMPLOYERCONTACT = Source.EMPLOYERTELNO,

                Target.PTFATHERNAME = Source.FATHER,
                Target.PTFATHERADDRESS = Source.FADDRESS,
                Target.PTFATHERCONTACT = Source.FTEL,
                Target.PTMOTHERMAIDENNAME = Source.MOTHER,
                Target.PTMOTHERADDRESS = Source.MADDRESS,
                Target.PTMOTHERCONTACT = Source.MTEL,

                Target.SSSGSISID = Source.SSSNO,
                Target.TINID = Source.TINNO,
                Target.SENIORID = Source.SCIDNO,
                Target.PHILHEALTHID = Source.UDF_PHILHEALTHNO

            FROM PATIENTREG AS Target
            
            INNER JOIN UERMMMC.dbo.PATIENTINFO AS Source 
                ON Source.PATIENTNO = @patientno
            
            LEFT JOIN UERMMMC.dbo.RELIGION R ON Source.RELIGION = R.CODE 
            LEFT JOIN UERMMMC.dbo.OCCUPATION O ON Source.OCCUPATION = O.CODE
            LEFT JOIN UERMMMC.dbo.NATIONALITY N ON Source.NATIONALITY = N.CODE
            LEFT JOIN UERMMMC.dbo.MUNICIPALITY M ON Source.MUNICIPALITY = M.CODE
            LEFT JOIN UERMMMC.dbo.BARANGAYS B ON Source.BARANGAY = B.CODE

            WHERE Target.ID = @regID;

            UPDATE HospitalTarget
            SET HospitalTarget.AGE = RegSource.AGE
            FROM UERMMMC.dbo.PATIENTINFO AS HospitalTarget
            INNER JOIN PATIENTREG AS RegSource
                ON RegSource.ID = @regID
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
                SELECT 
                    LASTNAME, 
                    FIRSTNAME, 
                    MIDDLENAME, 
                    SUFFIX, 
                    BIRTHDATE 
                FROM PATIENTREG 
                WHERE ID = @id
            `);

            if (sourceData.recordset.length === 0) {
                if (transaction) await transaction.rollback();
                return { status: 'NOT_FOUND' };
            }

            const { LASTNAME, FIRSTNAME, BIRTHDATE } = sourceData.recordset[0];

            if (!force) {
                const requestCheck = new sql.Request(transaction);
                requestCheck.input('checkLastName', sql.VarChar, (LASTNAME || '').trim());
                requestCheck.input('checkFirstName', sql.VarChar, (FIRSTNAME || '').trim());
                requestCheck.input('checkBirthdate', sql.Date, BIRTHDATE);

                const duplicateCheck = await requestCheck.query(`
                    SELECT 
                        PATIENTNO, 
                        LASTNAME, 
                        FIRSTNAME, 
                        MIDDLENAME, 
                        SUFFIX, 
                        DBIRTH, 
                        AGE
                    FROM UERMMMC.dbo.PATIENTINFO 
                    WHERE 
                        UPPER(LTRIM(RTRIM(LASTNAME))) = UPPER(@checkLastName) 
                        AND UPPER(LTRIM(RTRIM(FIRSTNAME))) = UPPER(@checkFirstName) 
                        AND CAST(DBIRTH AS DATE) = CAST(@checkBirthdate AS DATE)
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
                    SSSNO, TINNO, SCIDNO, UDF_PHILHEALTHNO, PWD_IDNo,
                    UDF_Module, UDF_AppName
                )
                SELECT 
                    @generatedPATIENTNO, 
                    LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX,
                    ADDRESSBARANGAY, ADDRESSCITY,
                    SEX, CIVILSTATUS,
                    RELIGION, NATIONALITY,
                    BIRTHDATE, AGE, BIRTHPLACE,
                    OCCUPATION,
                    CPNAME, CPRELATIONSHIP, 
                    ISNULL(CPLANDLINE, CPMOBILE), 
                    CPADDRESS,
                    CPLANDLINE, CPMOBILE,
                    SPOUSENAME, SPOUSEOCCUPATION,
                    SPOUSEEMPLOYERNAME, SPOUSEEMPLOYERADDRESS, SPOUSEEMPLOYERCONTACT, 
                    PTFATHERNAME, PTFATHERADDRESS, PTFATHERCONTACT,
                    PTMOTHERMAIDENNAME, PTMOTHERADDRESS, PTMOTHERCONTACT,
                    SSSGSISID, TINID, SENIORID, PHILHEALTHID, PWD,
                    'UERMPATIENTREG', 'UERMPATIENTREG'
                FROM PATIENTREG
                WHERE ID = @id;

                UPDATE PATIENTREG
                SET PATIENTNO = @generatedPATIENTNO, ISVALIDATED = 1
                WHERE ID = @id;

                UPDATE UERMMMC.dbo.PATIENTREG_PTSIGNATURE
                SET PATIENTNO = @generatedPATIENTNO
                WHERE ID = @id;

                UPDATE UERMMMC.dbo.PATIENTREG_TPSIGNATURE
                SET PATIENTNO = @generatedPATIENTNO
                WHERE ID = @id;
            `);

            await transaction.commit();
            return { status: 'SUCCESS' };

        } catch (err) {
            if (transaction) {
                try {
                    await transaction.rollback();
                } catch (rollbackErr) {
                    console.error("Rollback Error:", rollbackErr);
                }
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
                    (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME) AS fullName,                    
                    ISNULL(MIDDLENAME, '') AS middleName, 
                    SEX AS gender,
                    FORMAT(BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
                    CONCAT_WS(', ', ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION) AS addressPresent
                FROM PATIENTREG
                WHERE 
                    (
                        LASTNAME LIKE @search 
                        OR FIRSTNAME LIKE @search
                        OR ID = @exactId
                    )
                    AND PATIENTTYPE = 'Outpatient'
                ORDER BY LASTNAME, FIRSTNAME
            `);

            return result.recordset;

        } catch (err) {
            throw err;
        }
},

searchFinanceRecord: async (query) => {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            
            const cleanQuery = (query || '').toString().trim();

            let sqlQuery = `
                SELECT TOP 20
                    C.CASENO,
                    C.PATIENTNO, 
                    C.DATEAD, 
                    C.PATIENT_CATEGORY,
                    C.PATIENTTYPE AS patientType,
                    PI.SEX AS gender,
                    PI.AGE AS age, 
                    PI.UDF_PHILHEALTHNO AS philhealthNo,
                    SS.Classification AS class,
                    SS.Validity AS expiration,
                    PR.ISRETURNING AS visitType,
                    (ISNULL(PI.FIRSTNAME, '') + ' ' + ISNULL(PI.MIDDLENAME + ' ', '') + ISNULL(PI.LASTNAME, '')) AS fullName,
                    FORMAT(PI.DBIRTH, 'yyyy-MM-dd') AS birthdateStr,
                    PI.ADDRESS AS address,
                    C.CC AS chiefComplaint 
                FROM UERMMMC.dbo.CASES C
                LEFT JOIN UERMMMC.dbo.PATIENTINFO PI 
                    ON C.PATIENTNO = PI.PATIENTNO
                LEFT JOIN UERMHIMS.dbo.SocialServiceClass SS 
                    ON C.CASENO = SS.CaseNo 
                    AND C.PATIENTNO = SS.PatientNo 
                LEFT JOIN UERMMMC.dbo.PATIENTREG PR 
                    ON PI.PATIENTNO = PR.PATIENTNO 
                WHERE 
                    C.UDF_CaseDept = 'ER'
                    AND C.PATIENTTYPE = 'OPD'
                    AND C.ForAdmission = 1
            `;

            const isNumeric = /^\d+$/.test(cleanQuery);

            if (isNumeric) {
                sqlQuery += ` AND CAST(C.PATIENTNO AS VARCHAR) LIKE @numericId `;
                request.input('numericId', sql.VarChar, `${cleanQuery}%`);
            } else {
                const searchTerms = cleanQuery.split(/\s+/).filter(term => term.length > 0);
                
                searchTerms.forEach((term, index) => {
                    const paramName = `term${index}`;
                    request.input(paramName, sql.NVarChar, `%${term}%`);
                    
                    sqlQuery += ` 
                        AND (
                            PI.LASTNAME LIKE @${paramName} 
                            OR PI.FIRSTNAME LIKE @${paramName}
                            OR PI.MIDDLENAME LIKE @${paramName}
                            OR (ISNULL(PI.FIRSTNAME, '') + ' ' + ISNULL(PI.LASTNAME, '')) LIKE @${paramName}
                        ) 
                    `;
                });
            }

            sqlQuery += ` ORDER BY C.DATEAD DESC`;

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
                (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME + ISNULL(' ' + SUFFIX, '')) AS fullName, 
                ISNULL(MIDDLENAME, '') AS middleName, 
                ISNULL(SUFFIX, '') AS suffix,
                SEX AS gender, 
                FORMAT(BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
                CONCAT_WS(', ', ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION) AS addressPresent

            FROM PATIENTREG
            WHERE 
                PATIENTTYPE = 'Inpatient'
                OR ((ISADMITTED = 1 OR PATIENTTYPE = 'Emergency') AND REVIEWEDBY IS NOT NULL)
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
                (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME + ISNULL(' ' + SUFFIX, '')) AS fullName, 
                ISNULL(MIDDLENAME, '') AS middleName, 
                ISNULL(SUFFIX, '') AS suffix,
                SEX AS gender, 
                FORMAT(BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr, 
                CONCAT_WS(', ', ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION) AS addressPresent
            FROM PATIENTREG
            WHERE 
                PATIENTTYPE = 'Outpatient' 
            ORDER BY CREATEDAT DESC
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
                    ID,
                    PATIENTNO,
                    (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME) AS fullName,                    
                    LASTNAME, 
                    FIRSTNAME, 
                    ISNULL(MIDDLENAME, '') AS middleName, 
                    PATIENTTYPE,
                    FORMAT(CREATEDAT, 'yyyy-MM-dd') AS createdAt
                FROM PATIENTREG 
                ORDER BY CREATEDAT DESC
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
                SELECT SIGNATURE 
                FROM UERMMMC.dbo.PATIENTREG_PTSIGNATURE 
                WHERE ID = @pId
            `);

            return result.recordset.length > 0 ? result.recordset[0] : null;

        } catch (err) {
            console.error("Model Error (getSignatureByPatientId):", err);
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
                UPDATE PATIENTREG
                SET FORREVIEW = 1 
                WHERE ID = @patient_id
            `);

            return true; 
        } catch (error) {
            console.error('Model Error (sendToCredit):', error);
            throw error; 
        }
},

    getDoctors: async () => {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT 
                    LTRIM(RTRIM(NAME)) AS label, 
                    LTRIM(RTRIM(NAME)) AS value,
                    ISNULL(LTRIM(RTRIM(DEPARTMENT)), '') AS department, 
                    ISNULL(LTRIM(RTRIM(CONTACTNOS)), '') AS contactNo   
                FROM UERMMMC.dbo.DOCTORS 
                WHERE DELETED = 0 
                AND NAME IS NOT NULL
                ORDER BY NAME ASC
            `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
},

    getHMO: async () => {
            try {
                const pool = await poolPromise;
                const result = await pool.request().query(`
                    SELECT 
                        LTRIM(RTRIM(NAME)) AS label, 
                        LTRIM(RTRIM(NAME)) AS value 
                    FROM UERMMMC.dbo.HMO 
                    WHERE Deleted = 0 
                    AND NAME IS NOT NULL
                    ORDER BY NAME ASC
                `);
                return result.recordset;
            } catch (error) {
                throw error;
            }
}

};

module.exports = PatientModel;