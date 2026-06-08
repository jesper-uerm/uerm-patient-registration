const { sql, poolPromise } = require('../config/sqlHelper');

const PatientModel = {

    upsertPatient: async (p) => {
    let transaction;

    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);

        await transaction.begin();

        const request = new sql.Request(transaction);

        request.input('patientNo', sql.NVarChar, p.patientNo ? p.patientNo.toUpperCase() : null);
        request.input('isReturning', sql.Bit, p.patientNo && p.patientNo.trim() !== '' ? 1 : 0);

        request.input('lastName', sql.NVarChar, p.lastName ? p.lastName.toUpperCase() : '');
        request.input('firstName', sql.NVarChar, p.firstName ? p.firstName.toUpperCase() : '');
        request.input('middleName', sql.NVarChar, p.middleName ? p.middleName.toUpperCase() : null);
        request.input('suffix', sql.NVarChar, p.suffix ? p.suffix.toUpperCase() : null);

        request.input('birthdate', sql.Date, p.birthdate || null);
        request.input('age', sql.Int, p.age || null);
        request.input('birthplace', sql.NVarChar, p.birthplace ? p.birthplace.toUpperCase() : null);

        request.input('gender', sql.NVarChar, p.gender ? p.gender.toUpperCase() : null);
        request.input('civilStatus', sql.NVarChar, p.civilStatus ? p.civilStatus.toUpperCase() : null);
        request.input('religion', sql.NVarChar, p.religion ? p.religion.toUpperCase() : null);
        request.input('nationality', sql.NVarChar, p.nationality ? p.nationality.toUpperCase() : null);

        request.input('empCode', sql.NVarChar, p.empCode ? p.empCode.toUpperCase() : null);

        request.input('philhealthId', sql.NVarChar, p.philhealthId ? p.philhealthId.toUpperCase() : null);
        request.input('govtId', sql.NVarChar, p.govtId ? p.govtId.toUpperCase() : null);
        request.input('seniorId', sql.NVarChar, p.seniorId ? p.seniorId.toUpperCase() : null);
        request.input('pwdId', sql.NVarChar, p.pwdId ? p.pwdId.toUpperCase() : null);
        request.input('pwdIdExp', sql.Date, p.pwdIdExp || null);

        request.input('landline', sql.NVarChar, p.landline ? p.landline.toUpperCase() : null);
        request.input('mobile', sql.NVarChar, p.mobile ? p.mobile.toUpperCase() : null);
        request.input('email', sql.NVarChar, p.email ? p.email.toUpperCase() : null);

        request.input('occupation', sql.NVarChar, p.occupation ? p.occupation.toUpperCase() : null);
        request.input('employer', sql.NVarChar, p.employer ? p.employer.toUpperCase() : null);
        request.input('employerAddress', sql.NVarChar, p.employerAddress ? p.employerAddress.toUpperCase() : null);
        request.input('employerContactNo', sql.NVarChar, p.employerContactNo ? p.employerContactNo.toUpperCase() : null);

        request.input('street', sql.NVarChar, p.street ? p.street.toUpperCase() : null);
        request.input('barangay', sql.NVarChar, p.barangay ? p.barangay.toUpperCase() : null);
        request.input('city', sql.NVarChar, p.city ? p.city.toUpperCase() : null);
        request.input('province', sql.NVarChar, p.province ? p.province.split(' (')[0].trim().toUpperCase() : null);
        request.input('region', sql.NVarChar, p.region ? p.region.toUpperCase() : null);

        request.input('father', sql.NVarChar, p.father ? p.father.toUpperCase() : null);
        request.input('fatherAddress', sql.NVarChar, p.fatherAddress ? p.fatherAddress.toUpperCase() : null);
        request.input('fatherContact', sql.NVarChar, p.fatherContact ? p.fatherContact.toUpperCase() : null);

        request.input('mother', sql.NVarChar, p.mother ? p.mother.toUpperCase() : null);
        request.input('motherAddress', sql.NVarChar, p.motherAddress ? p.motherAddress.toUpperCase() : null);
        request.input('motherContact', sql.NVarChar, p.motherContact ? p.motherContact.toUpperCase() : null);

        request.input('spouseName', sql.NVarChar, p.spouseName ? p.spouseName.toUpperCase() : null);
        request.input('spouseAddress', sql.NVarChar, p.spouseAddress ? p.spouseAddress.toUpperCase() : null);
        request.input('spouseContact', sql.NVarChar, p.spouseContact ? p.spouseContact.toUpperCase() : null);
        request.input('spouseOccupation', sql.NVarChar, p.spouseOccupation ? p.spouseOccupation.toUpperCase() : null);

        request.input('cpName', sql.NVarChar, p.cpName ? p.cpName.toUpperCase() : null);
        request.input('cpRelationship', sql.NVarChar, p.cpRelationship ? p.cpRelationship.toUpperCase() : null);
        request.input('cpAddress', sql.NVarChar, p.cpAddress ? p.cpAddress.toUpperCase() : null);
        request.input('cpMobile', sql.NVarChar, p.cpMobile ? p.cpMobile.toUpperCase() : null);

        request.input('patientType', sql.NVarChar, p.patientType ? p.patientType.toUpperCase() : null);

        const existingPatient = await request.query(`
            SELECT PATIENTNO
            FROM PATIENTINFO
            WHERE PATIENTNO = @patientNo
        `);

        const patientExists =
            existingPatient.recordset &&
            existingPatient.recordset.length > 0;

        const patientResult = await request.query(`
            INSERT INTO PATIENTREG (
                EMPCODE,
                PATIENTNO,
                ISRETURNING,
                LASTNAME,
                FIRSTNAME,
                MIDDLENAME,
                SUFFIX,
                BIRTHDATE,
                AGE,
                BIRTHPLACE,
                SEX,
                CIVILSTATUS,
                RELIGION,
                NATIONALITY,
                LANDLINE,
                MOBILE,
                EMAIL,
                PHILHEALTHID,
                GOVTID,
                SENIORID,
                PWDID,
                PWDIDEXP,
                OCCUPATION,
                EMPLOYER,
                EMPLOYERADDRESS,
                EMPLOYERCONTACTNO,
                ADDRESSSTREET,
                ADDRESSBARANGAY,
                ADDRESSCITY,
                ADDRESSPROVINCE,
                ADDRESSREGION,
                FATHER,
                FATHERADDRESS,
                FATHERCONTACT,
                MOTHER,
                MOTHERADDRESS,
                MOTHERCONTACT,
                SPOUSENAME,
                SPOUSEADDRESS,
                SPOUSECONTACT,
                SPOUSEOCCUPATION,
                CPNAME,
                CPRELATIONSHIP,
                CPADDRESS,
                CPMOBILE,
                PATIENTTYPE,
                CREATEDAT
            )
            VALUES (
                @empCode,
                @patientNo,
                @isReturning,
                @lastName,
                @firstName,
                @middleName,
                @suffix,
                @birthdate,
                @age,
                @birthplace,
                @gender,
                @civilStatus,
                @religion,
                @nationality,
                @landline,
                @mobile,
                @email,
                @philhealthId,
                @govtId,
                @seniorId,
                @pwdId,
                @pwdIdExp,
                @occupation,
                @employer,
                @employerAddress,
                @employerContactNo,
                @street,
                @barangay,
                @city,
                @province,
                @region,
                @father,
                @fatherAddress,
                @fatherContact,
                @mother,
                @motherAddress,
                @motherContact,
                @spouseName,
                @spouseAddress,
                @spouseContact,
                @spouseOccupation,
                @cpName,
                @cpRelationship,
                @cpAddress,
                @cpMobile,
                @patientType,
                GETDATE()
            );

            SELECT SCOPE_IDENTITY() AS PATIENTREGID;
        `);

        let newPatientID = patientResult.recordset[0].PATIENTREGID;

        if (patientExists) {

            await request.query(`
            UPDATE PI
            SET
                PI.LASTNAME = @lastName,
                PI.FIRSTNAME = @firstName,
                PI.MIDDLENAME = @middleName,
                PI.SUFFIX = @suffix,
                PI.DBIRTH = @birthdate,
                PI.AGE = @age,
                PI.BPLACE = @birthplace,
                PI.SEX = @gender,
                PI.STATUS = @civilStatus,
                PI.RELIGION = R.CODE,
                PI.NATIONALITY = N.CODE,
                PI.MOBILENO = @mobile,
                PI.PHONENOS = @landline,
                PI.EMAILADD = @email,
                PI.OCCUPATION = O.CODE,
                PI.EMPLOYER = @employer,
                PI.EMPLOYERADD = @employerAddress,
                PI.EMPLOYERTELNO = @employerContactNo,
                PI.UDF_STREETADDRESS = @street,
                PI.BARANGAY = B.CODE,
                PI.MUNICIPALITY = M.CODE,
                PI.UDF_PROVINCE = @province,
                PI.FATHER = @father,
                PI.FADDRESS = @fatherAddress,
                PI.FTEL = @fatherContact,
                PI.MOTHER = @mother,
                PI.MADDRESS = @motherAddress,
                PI.MTEL = @motherContact,
                PI.NAMEOFSPOUSE = @spouseName,
                PI.UDF_SPOUSEADDRESS = @spouseAddress,
                PI.UDF_SPOUSECONT = @spouseContact,
                PI.SPOUSEOCCUPATION = @spouseOccupation,
                PI.INCASE = @cpName,
                PI.RELATIONSHIP = @cpRelationship,
                PI.INCASEADD = @cpAddress,
                PI.INCASEPHONENO = @cpMobile,
                PI.UDF_PHILHEALTHNO = @philhealthId,
                PI.TINNO = @govtId,
                PI.SCIDNO = @seniorId,
                PI.PWD_IDNO = @pwdId,
                PI.PWD_IDExpiry = @pwdIdExp,
                PI.UDF_EMPLOYEECODE = @empCode,
                PI.DATE_UPDATED = GETDATE()

            FROM PATIENTINFO PI

            LEFT JOIN BARANGAYS B
                ON UPPER(B.DESCRIPTION) = UPPER(@barangay)
            LEFT JOIN MUNICIPALITY M
                ON UPPER(M.DESCRIPTION) = UPPER(@city)
            LEFT JOIN NATIONALITY N
                ON UPPER(N.DESCRIPTION) = UPPER(@nationality)
            LEFT JOIN RELIGION R
                ON UPPER(R.DESCRIPTION) = UPPER(@religion)
            LEFT JOIN OCCUPATION O
                ON UPPER(O.DESCRIPTION) = UPPER(@occupation)

            WHERE PI.PATIENTNO = @patientNo
            `);
        }

        if (p.signature && newPatientID) {

            const cleanSignature = p.signature.replace(
                /^data:image\/\w+;base64,/,
                ''
            );

            const finalSignatureBuffer = Buffer.from(
                cleanSignature,
                'base64'
            );

            const signRequest = new sql.Request(transaction);

            signRequest.input('pId', sql.Int, newPatientID);
            signRequest.input('patientNo', sql.VarChar(14), p.patientNo || null);

            signRequest.input(
                'signData',
                sql.VarBinary(sql.MAX),
                finalSignatureBuffer
            );

            await signRequest.query(`
                INSERT INTO PATIENTREG_PTSIGNATURE (
                    PATIENTREGID,
                    PATIENTNO,
                    SIGNATURE
                )
                VALUES (
                    @pId,
                    @patientNo,
                    @signData
                );
            `);
        }

        await transaction.commit();

        return {
            patientId: newPatientID,
            status: patientExists
                ? 'INSERTED_AND_UPDATED'
                : 'INSERTED_ONLY'
        };

    } catch (err) {

        if (transaction) {
            await transaction.rollback();
        }

        console.error('Model Error (upsertPatient):', err);

        throw err;
    }
},

    upsertPatientCredit: async (patientno, data, reviewedBy) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);

        request.input('patientno', sql.VarChar, patientno);
        request.input('reviewedBy', sql.NVarChar, reviewedBy ? reviewedBy.toUpperCase() : null);

        request.input('personRes1', sql.NVarChar, data.fnPersonRes1 || null);
        request.input('personRes1Work', sql.NVarChar, data.fnPersonRes1Work || null);
        request.input('personRes1Rel', sql.NVarChar, data.fnPersonRes1Rel || null);
        request.input('personRes1Contact', sql.NVarChar, data.fnPersonRes1Contact || null);

        request.input('personRes2', sql.NVarChar, data.fnPersonRes2 || null);
        request.input('personRes2Work', sql.NVarChar, data.fnPersonRes2Work || null);
        request.input('personRes2Rel', sql.NVarChar, data.fnPersonRes2Rel || null);
        request.input('personRes2Contact', sql.NVarChar, data.fnPersonRes2Contact || null);

        request.input('sssCardClass', sql.NVarChar, data.fnsssCard || null);
        request.input('visitTypeSer', sql.NVarChar, data.fnvisitTypeService || null);
        request.input('admissionType', sql.NVarChar, data.fnadmissionType || null);
        request.input('endorsedToSocial', sql.Bit, data.fnendorsedToSocial ?? null);
        request.input('numAdmissionSer', sql.Int, data.fnnumAdmissionService || 0);
        request.input('expDate', sql.Date, data.fnExpDate || null);
        request.input('lastAdmDateSer', sql.Date, data.fnLastAdmDateService || null);
        request.input('coordinatedBySer', sql.NVarChar, data.fnCoordinateByService || null);

        request.input('visitTypePay', sql.NVarChar, data.fnvisitTypePay || null);
        request.input('numAdmissionPay', sql.Int, data.fnnumAdmissionPay || 0);
        request.input('lastAdmDatePay', sql.Date, data.fnLastAdmDatePay || null);
        request.input('coordinatedByPay', sql.NVarChar, data.fnCoordinateByPay || null); 

        request.input('transFrom', sql.NVarChar, data.fntransFrom || null);
        request.input('reasonOfTransfer', sql.NVarChar, data.fnrsofTransfer || null);
        request.input('admissionStatus', sql.NVarChar, data.fnAdmissionStatus || null);
        request.input('remarksTransfer', sql.NVarChar, data.fnremarksTransfer || null);

        request.input('hmo', sql.NVarChar, data.fnHmo || null);
        request.input('hmoInitialStatus', sql.NVarChar, data.fnHmoInitialStatus || null);
        request.input('phicStatus', sql.NVarChar, data.fnphStatus || null);
        request.input('phicNum', sql.NVarChar, data.fnphNumber || null);
        request.input('phicRemarks', sql.NVarChar, data.fnphRemarks || null);
        request.input('mop', sql.NVarChar, data.fnMop || null);

        request.input('admPhysician', sql.NVarChar, data.fnAdmPhysician || null);
        request.input('admPhysicianDept', sql.NVarChar, data.fnAdmPhysicianDept || null); 
        request.input('attPhysician', sql.NVarChar, data.fnAttPhysician || null);
        request.input('attPhysicianDept', sql.NVarChar, data.fnAttPhysicianDept || null);
        request.input('roomAdmission', sql.NVarChar, data.fnrmAdmission || null);
        request.input('cost', sql.Decimal(18,2), data.fnCost || null);
        request.input('lengthStay', sql.NVarChar, data.fnlengthStay || null);
        request.input('admProcedure', sql.NVarChar, data.fnadmProcedure || null);

        request.input('orDeposit', sql.NVarChar, data.fnorDeposit || null);
        request.input('reqDeposit', sql.Decimal(18,2), data.fnreqDeposit || null);
        request.input('toDeposit', sql.Decimal(18,2), data.fntoDeposit || null);
        request.input('toFollowDeposit', sql.Decimal(18,2), data.fntofollowDeposit || null);

        request.input('admRemarks', sql.NVarChar, data.fnadmRemarks || null);
        request.input('status', sql.NVarChar, data.fnStatus || null);
        request.input('approvedBy', sql.NVarChar, data.fnApprovedBY || null);

        await request.query(`
            INSERT INTO PATIENTREG_CREDIT (
                PATIENTNO, SSS_CARD_CLASS, VISIT_TYPE_SER, ADMISSION_TYPE, ENDORSED_TO_SOCIAL, NUM_ADMISSION_SER, EXP_DATE, LAST_ADM_DATE_SER, COORDINATED_BY_SER,
                VISIT_TYPE_PAY, NUM_ADMISSION_PAY, LAST_ADM_DATE_PAY, COORDINATED_BY_PAY,
                TRANS_FROM, REASON_OF_TRANSFER, ADMISSION_STATUS, REMARKS_TRANSFER,
                HMO, HMO_INITIAL_STATUS, PHIC_STATUS, PHIC_NUM, PHIC_REMARKS, MOP,
                ADM_PHYSICIAN, ADM_DEPARTMENT, ATT_PHYSICIAN, ATT_DEPARTMENT, ROOM_ADMISSION, COST, LENGTH_STAY, ADM_PROCEDURE,
                OR_DEPOSIT, REQ_DEPOSIT, TO_DEPOSIT, TO_FOLLOW_DEPOSIT,
                
                PERSON_RES1, PERSON_RES1_WORK, PERSON_RES1_REL, PERSON_RES1_CONTACT,
                PERSON_RES2, PERSON_RES2_WORK, PERSON_RES2_REL, PERSON_RES2_CONTACT,

                ADM_REMARKS, STATUS, APPROVED_BY, FOR_APPROV, EVALUATED_BY, CREATEDAT, UPDATEDAT
            ) VALUES (
                @patientno, @sssCardClass, @visitTypeSer, @admissionType, @endorsedToSocial, @numAdmissionSer, @expDate, @lastAdmDateSer, @coordinatedBySer,
                @visitTypePay, @numAdmissionPay, @lastAdmDatePay, @coordinatedByPay,
                @transFrom, @reasonOfTransfer, @admissionStatus, @remarksTransfer,
                @hmo, @hmoInitialStatus, @phicStatus, @phicNum, @phicRemarks, @mop,
                @admPhysician, @admPhysicianDept, @attPhysician, @attPhysicianDept, @roomAdmission, @cost, @lengthStay, @admProcedure,
                @orDeposit, @reqDeposit, @toDeposit, @toFollowDeposit,
                @personRes1, @personRes1Work, @personRes1Rel, @personRes1Contact,
                @personRes2, @personRes2Work, @personRes2Rel, @personRes2Contact,

                @admRemarks, @status, @approvedBy, 1, @reviewedBy, GETDATE(), GETDATE()
            );

            UPDATE PATIENTREG
            SET 
                FORREVIEW = 1,
                REVIEWEDBY = @reviewedBy
            WHERE 
                PATIENTNO = @patientno;
        `);

        await transaction.commit();
        return true;

    } catch (err) {
        try {
            await transaction.rollback();
        } catch (rollbackErr) {
            console.error('Transaction rollback failed: ', rollbackErr);
        }
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
                ON (PR.PATIENTREGID = PS.PATIENTREGID OR (PR.PATIENTNO IS NOT NULL AND PR.PATIENTNO = PS.PATIENTNO))
                
            LEFT JOIN UERMMMC.dbo.PATIENTREG_TPSIGNATURE TPS 
                ON (PR.PATIENTREGID = TPS.PATIENTREGID OR (PR.PATIENTNO IS NOT NULL AND PR.PATIENTNO = TPS.PATIENTNO))

            WHERE PR.PATIENTREGID = @patientId OR PR.PATIENTNO = @patientId
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

        const check = await request.query(`
            SELECT TOP 1 PATIENTREGID
            FROM PATIENTREG
            WHERE PATIENTREGID = @regID
        `);

        if (!check.recordset.length) {
            throw new Error('PatientREGID not found');
        }

        await request.query(`
            UPDATE UERMMMC.dbo.PATIENTREG_PTSIGNATURE
            SET PATIENTNO = @patientno
            WHERE PATIENTREGID = @regID;
        `);

        await request.query(`
            UPDATE UERMMMC.dbo.PATIENTREG_TPSIGNATURE
            SET PATIENTNO = @patientno
            WHERE PATIENTREGID = @regID;
        `);

        const updateMain = await request.query(`
            UPDATE Target
            SET 
                Target.PATIENTNO = @patientno,
                Target.ISVALIDATED = 1,
                Target.ISRETURNING = 1,
                Target.LASTNAME = Source.LASTNAME,
                Target.FIRSTNAME = Source.FIRSTNAME,
                Target.MIDDLENAME = Source.MIDDLENAME,
                Target.SUFFIX = Source.SUFFIX,
                Target.SEX = Source.SEX,
                Target.CIVILSTATUS = Source.STATUS,
                Target.BIRTHDATE = Source.DBIRTH,
                Target.BIRTHPLACE = Source.BPLACE,
                Target.ADDRESSBARANGAY = B.DESCRIPTION,
                Target.ADDRESSCITY = M.DESCRIPTION,
                Target.RELIGION = R.DESCRIPTION,
                Target.NATIONALITY = N.DESCRIPTION,
                Target.OCCUPATION = O.DESCRIPTION,
                Target.CPNAME = Source.INCASE,
                Target.CPRELATIONSHIP = Source.RELATIONSHIP,
                Target.CPADDRESS = Source.INCASEADD,
                Target.CPMOBILE = COALESCE(Source.MOBILENO, Source.INCASEPHONENO),
                Target.SPOUSENAME = Source.NAMEOFSPOUSE,
                Target.SPOUSEOCCUPATION = Source.SPOUSEOCCUPATION,
                Target.FATHER = Source.FATHER,
                Target.FATHERADDRESS = Source.FADDRESS,
                Target.FATHERCONTACT = Source.FTEL,
                Target.MOTHER = Source.MOTHER,
                Target.MOTHERADDRESS = Source.MADDRESS,
                Target.MOTHERCONTACT = Source.MTEL,
                Target.SENIORID = Source.SCIDNO,
                Target.PHILHEALTHID = Source.UDF_PHILHEALTHNO,
                Target.UPDATEDAT = GETDATE()
            FROM PATIENTREG AS Target
            INNER JOIN UERMMMC.dbo.PATIENTINFO AS Source
                ON Source.PATIENTNO = @patientno
            LEFT JOIN UERMMMC.dbo.RELIGION R
                ON Source.RELIGION = R.CODE
            LEFT JOIN UERMMMC.dbo.OCCUPATION O
                ON Source.OCCUPATION = O.CODE
            LEFT JOIN UERMMMC.dbo.NATIONALITY N
                ON Source.NATIONALITY = N.CODE
            LEFT JOIN UERMMMC.dbo.MUNICIPALITY M
                ON Source.MUNICIPALITY = M.CODE
            LEFT JOIN UERMMMC.dbo.BARANGAYS B
                ON Source.BARANGAY = B.CODE
            WHERE Target.PATIENTREGID = @regID;
        `);

        if (updateMain.rowsAffected[0] === 0) {
            throw new Error('Main patient record not updated');
        }

        await request.query(`
            UPDATE UERMMMC.dbo.PATIENTINFO
            SET AGE = RegSource.AGE
            FROM UERMMMC.dbo.PATIENTINFO
            INNER JOIN PATIENTREG AS RegSource
                ON RegSource.PATIENTREGID = @regID
            WHERE PATIENTINFO.PATIENTNO = @patientno;
        `);

        await transaction.commit();

        return true;

    } catch (err) {
        if (transaction) {
            await transaction.rollback();
        }

        console.error('LINK PATIENT ERROR:', err);

        throw new Error(err.message || 'Failed to link patient record');
    }
},

    transferPatientInfo: async (id, force) => {
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
                WHERE PATIENTREGID = @id
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
                BARANGAY, MUNICIPALITY, MunCityCode, ADDRESS,
                SEX, STATUS, RELIGION, NATIONALITY,
                DBIRTH, AGE, BPLACE,OCCUPATION,
                INCASE, RELATIONSHIP, INCASEPHONENO, INCASEADD,
                PHONENOS, MOBILENO,
                NAMEOFSPOUSE, SPOUSEOCCUPATION,
                EMPLOYER, EMPLOYERADD, EMPLOYERTELNO,
                FATHER, FADDRESS, FTEL,
                MOTHER, MADDRESS, MTEL, SCIDNO,
                UDF_PHILHEALTHNO, PWD_IDNo,
                UDF_Module, UDF_AppName
            )

            SELECT
                @generatedPATIENTNO,
                PR.LASTNAME,
                PR.FIRSTNAME,
                PR.MIDDLENAME,
                PR.SUFFIX,

                (SELECT TOP 1 CODE FROM UERMMMC.dbo.BARANGAYS
                WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(PR.ADDRESSBARANGAY)))),

                (SELECT TOP 1 CODE FROM UERMMMC.dbo.MUNICIPALITY
                WHERE 
                    LTRIM(RTRIM(REPLACE(REPLACE(UPPER(DESCRIPTION), 'CITY', ''), 'OF', ''))) 
                    = 
                    LTRIM(RTRIM(REPLACE(REPLACE(UPPER(PR.ADDRESSCITY), 'CITY', ''), 'OF', '')))
                ),

                (SELECT TOP 1 CODE FROM UERMHIMS.dbo.CodeMunicipalityCity
                WHERE UPPER(LTRIM(RTRIM(Name))) = UPPER(LTRIM(RTRIM(PR.ADDRESSCITY)))),

                PR.ADDRESSSTREET,

                PR.SEX,
                PR.CIVILSTATUS,

                (SELECT TOP 1 CODE FROM UERMMMC.dbo.RELIGION
                WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(PR.RELIGION)))),

                (SELECT TOP 1 CODE FROM UERMMMC.dbo.NATIONALITY
                WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(PR.NATIONALITY)))),

                PR.BIRTHDATE,
                PR.AGE,
                PR.BIRTHPLACE,

                (SELECT TOP 1 CODE FROM UERMMMC.dbo.OCCUPATION
                WHERE UPPER(LTRIM(RTRIM(DESCRIPTION))) = UPPER(LTRIM(RTRIM(PR.OCCUPATION)))),

                PR.CPNAME,
                PR.CPRELATIONSHIP,
                PR.CPMOBILE,
                PR.CPADDRESS,
                PR.CPMOBILE,
                PR.CPMOBILE,
                PR.SPOUSENAME,
                PR.SPOUSEOCCUPATION,
                PR.EMPLOYER,
                PR.EMPLOYERADDRESS,
                PR.EMPLOYERCONTACTNO,
                PR.FATHER,
                PR.FATHERADDRESS,
                PR.FATHERCONTACT,
                PR.MOTHER,
                PR.MOTHERADDRESS,
                PR.MOTHERCONTACT,
                PR.SENIORID,
                PR.PHILHEALTHID,
                PR.PWDID,
                'UERMPATIENTREG',
                'UERMPATIENTREG'
            FROM PATIENTREG PR
            WHERE PR.PATIENTREGID = @id;

            UPDATE PATIENTREG
            SET PATIENTNO = @generatedPATIENTNO,
                ISVALIDATED = 1, 
                UPDATEDAT = GETDATE()
            WHERE PATIENTREGID = @id;

            UPDATE UERMMMC.dbo.PATIENTREG_PTSIGNATURE
            SET PATIENTNO = @generatedPATIENTNO
            WHERE PATIENTREGID = @id;

            UPDATE UERMMMC.dbo.PATIENTREG_TPSIGNATURE
            SET PATIENTNO = @generatedPATIENTNO
            WHERE PATIENTREGID = @id;
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

    searchErRecords: async (searchTerm) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();
        const maxResults = 50;
        
        let sqlQuery = `
        SELECT TOP ${maxResults} 
            P.PATIENTNO,
            P.FIRSTNAME,
            P.LASTNAME,
            (P.FIRSTNAME + ' ' + ISNULL(P.MIDDLENAME + ' ', '') + P.LASTNAME + ISNULL(' ' + P.SUFFIX, '')) AS fullName,
            ISNULL(P.MIDDLENAME, '') AS middleName, 
            ISNULL(P.SUFFIX, '') AS suffix,
            P.SEX AS gender,
            FORMAT(P.BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
            P.PATIENTTYPE,
            PRC.IS_APPROVED,
            CONCAT_WS(', ', P.ADDRESSSTREET, P.ADDRESSBARANGAY, P.ADDRESSCITY, P.ADDRESSPROVINCE, P.ADDRESSREGION) AS addressPresent
        FROM UERMMMC.dbo.PATIENTREG P
        LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC 
            ON P.PATIENTNO = PRC.PATIENTNO
        WHERE 
            (P.ISADMITTED = 1 OR P.PATIENTTYPE = 'EMERGENCY')
            AND P.REVIEWEDBY IS NOT NULL
            AND PRC.IS_APPROVED = 1
            AND 1=1 
        `; 

        const isNumeric = /^\d+$/.test(searchTerm);

        if (isNumeric) {
            sqlQuery += ` AND (P.PATIENTNO LIKE @exactId OR P.PATIENTNO LIKE @partialId) `;
            request.input('exactId', sql.VarChar, searchTerm);
            request.input('partialId', sql.VarChar, `${searchTerm}%`);
        } else {
            const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);
            
            searchTerms.forEach((term, index) => {
                const paramName = `term${index}`;
                request.input(paramName, sql.NVarChar, `%${term}%`);
                
                sqlQuery += ` 
                    AND (
                        P.LASTNAME LIKE @${paramName} 
                        OR P.FIRSTNAME LIKE @${paramName}
                        OR P.MIDDLENAME LIKE @${paramName}
                        OR P.SUFFIX LIKE @${paramName}
                    ) 
                `;
            });
        }

        sqlQuery += ` ORDER BY P.LASTNAME, P.FIRSTNAME;`;

        const result = await request.query(sqlQuery);
        return result.recordset;

    } catch (err) {
        console.error("Model Error (searchErRecords):", err);
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
                    P.*,
                    (P.FIRSTNAME + ' ' + ISNULL(P.MIDDLENAME + ' ', '') + P.LASTNAME + ISNULL(' ' + P.SUFFIX, '')) AS fullName, 
                    ISNULL(P.MIDDLENAME, '') AS middleName, 
                    ISNULL(P.SUFFIX, '') AS suffix,
                    P.SEX AS gender, 
                    FORMAT(P.BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
                    CONCAT_WS(', ', P.ADDRESSSTREET, P.ADDRESSBARANGAY, P.ADDRESSCITY, P.ADDRESSPROVINCE) AS addressPresent,
                    PRC.IS_APPROVED,
                    PRC.FOR_APPROV
                FROM UERMMMC.dbo.PATIENTREG P
                LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC 
                    ON PRC.PATIENTNO = P.PATIENTNO
                WHERE 
                    P.PATIENTTYPE = 'INPATIENT'
                    AND 1=1 
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
                        OR PATIENTREGID = @exactId
                    )
                    AND PATIENTTYPE = 'Outpatient'
                ORDER BY LASTNAME, FIRSTNAME
            `);

            return result.recordset;

        } catch (err) {
            throw err;
        }
},

//finance
//  fetchPatientsForFinance: async () => {
//         try {
//             const pool = await poolPromise; 
//             const result = await pool.request().query(`
//             SELECT
//                 C.CASENO,
//                 C.PATIENTNO, 
//                 C.DATEAD, 
//                 C.PATIENT_CATEGORY,
//                 C.PATIENTTYPE AS patientType,
//                 C.CC AS chiefComplaint, 
//                 C.LAST_ROOM,
//                 PR.HMO AS hmo,
//                 PI.SEX AS gender,
//                 PI.AGE AS age, 
//                 PI.UDF_PHILHEALTHNO AS philhealthNo,
//                 PI.ADDRESS AS address,
//                 D.ADMISSION AS admdiagnosis,
//                 SS.Classification AS ssClass,
//                 SS.Validity AS expiration,
//                 PRC.IS_APPROVED AS is_approved,
//                 CAST(
//                     CASE 
//                         WHEN EXISTS (
//                             SELECT 1 
//                             FROM UERMMMC.dbo.CASES C_CHK 
//                             WHERE C_CHK.PATIENTNO = C.PATIENTNO 
//                             AND C_CHK.DATEAD < C.DATEAD
//                         ) THEN 1 
//                         ELSE 0 
//                     END AS BIT
//                 ) AS visitType,
                
//                 (ISNULL(PI.FIRSTNAME, '') + ' ' + ISNULL(PI.MIDDLENAME + ' ', '') + ISNULL(PI.LASTNAME, '')) AS fullName,
//                 FORMAT(PI.DBIRTH, 'yyyy-MM-dd') AS birthdateStr,
//                 R.TYPE_CODE AS typeCode,

//                 (
//                     SELECT TOP 1 C_SUB.DATEAD 
//                     FROM UERMMMC.dbo.CASES C_SUB 
//                     WHERE C_SUB.PATIENTNO = C.PATIENTNO
//                     AND C_SUB.isPay = 0
//                     ORDER BY C_SUB.DATEAD DESC
//                 ) AS lastAdSer,
//                 (
//                     SELECT TOP 1 C_SUB.DATEAD 
//                     FROM UERMMMC.dbo.CASES C_SUB 
//                     WHERE C_SUB.PATIENTNO = C.PATIENTNO
//                     AND C_SUB.isPay = 1
//                     ORDER BY C_SUB.DATEAD DESC
//                 ) AS lastAdPay,  
//                 (
//                     SELECT COUNT(C_SUB.CASENO) 
//                     FROM UERMMMC.dbo.CASES C_SUB 
//                     INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
//                     WHERE C_SUB.PATIENTNO = C.PATIENTNO
//                     AND R_SUB.TYPE_CODE = 'SER'
//                 ) AS admissionCountSer,

//                 (
//                     SELECT COUNT(C_SUB.CASENO) 
//                     FROM UERMMMC.dbo.CASES C_SUB 
//                     INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
//                     WHERE C_SUB.PATIENTNO = C.PATIENTNO
//                     AND R_SUB.TYPE_CODE != 'SER'
//                 ) AS admissionCountPay
                
//             FROM UERMMMC.dbo.CASES C
//             LEFT JOIN UERMMMC.dbo.PATIENTINFO PI 
//                 ON C.PATIENTNO = PI.PATIENTNO
//             LEFT JOIN UERMMMC.dbo.PATIENTREG PR 
//                 ON PI.PATIENTNO = PR.PATIENTNO
//             LEFT JOIN UERMMMC.dbo.ROOMS R 
//                 ON C.LAST_ROOM = R.ROOMNO  
//             LEFT JOIN UERMMMC.dbo.DIAGNOSIS D
//                 ON C.CASENO = D.CASENO 
//             LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC
//                 ON C.CASENO = PRC.CASENO

//             OUTER APPLY (
//                 SELECT TOP 1 Classification, Validity 
//                 FROM UERMHIMS.dbo.SocialServiceClass 
//                 WHERE 
//                     RTRIM(PatientNo) = RTRIM(C.PATIENTNO)
//             ) SS
//             WHERE 
//                 C.UDF_CaseDept = 'ER'
//                 AND C.PATIENTTYPE = 'OPD'
//                 AND C.ForAdmission = 1
//                 AND (PRC.FOR_APPROV = 0 OR PRC.FOR_APPROV IS NULL) 
//                 -- AND C.DATEAD >= DATEADD(hour, -24, GETDATE())
//                 -- AND PR.FORREVIEW = 1
                
//             ORDER BY DATEAD DESC
//                 `);

//             return result.recordset;


//         } catch (err) {
//             console.error("Model Error (fetchErPatientsForFinance):", err);
//             throw err;
//         }
//     },

    fetchPatientsForFinance: async () => {  
    try {
        const pool = await poolPromise; 
        const result = await pool.request().query(`
        SELECT
            C.CASENO,
            C.DATEAD, 
            C.PATIENT_CATEGORY,
            C.CC AS chiefComplaint, 
            C.LAST_ROOM,
            
            PR.PATIENTNO,   
            PR.PATIENTTYPE AS patientType,
            PR.HMO AS hmo,
            PR.ISFORADMISSION,
            PR.CREATEDAT,
            PR.ADM_PHYSICIAN,
            PR.ADM_PHYSICIAN_DEPT,
            PR.ATT_PHYSICIAN,
            PR.ATT_PHYSICIAN_DEPT,
            
            PR.SEX AS gender,
            PR.AGE AS age, 
            PR.PHILHEALTHID AS philhealthNo,
            CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE) AS address,
            (ISNULL(PR.FIRSTNAME, '') + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + ISNULL(PR.LASTNAME, '')) AS fullName,
            FORMAT(PR.BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
            
            D.ADMISSION AS admdiagnosis,
            SS.Classification AS ssClass,
            SS.Validity AS expiration,
            PRC.IS_APPROVED AS is_approved,
            R.TYPE_CODE AS typeCode,
            
            CAST(
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM UERMMMC.dbo.CASES C_CHK 
                        WHERE C_CHK.PATIENTNO = PR.PATIENTNO 
                        AND C_CHK.DATEAD < C.DATEAD
                    ) THEN 1 
                    ELSE 0 
                END AS BIT
            ) AS visitType,
            
            (
                SELECT TOP 1 C_SUB.DATEAD 
                FROM UERMMMC.dbo.CASES C_SUB 
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND C_SUB.isPay = 0
                ORDER BY C_SUB.DATEAD DESC
            ) AS lastAdSer,
            (
                SELECT TOP 1 C_SUB.DATEAD 
                FROM UERMMMC.dbo.CASES C_SUB 
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND C_SUB.isPay = 1
                ORDER BY C_SUB.DATEAD DESC
            ) AS lastAdPay,  
            (
                SELECT COUNT(C_SUB.CASENO) 
                FROM UERMMMC.dbo.CASES C_SUB 
                INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND R_SUB.TYPE_CODE = 'SER'
            ) AS admissionCountSer,
            (
                SELECT COUNT(C_SUB.CASENO) 
                FROM UERMMMC.dbo.CASES C_SUB 
                INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND R_SUB.TYPE_CODE != 'SER'
            ) AS admissionCountPay
            
        FROM UERMMMC.dbo.PATIENTREG PR

        LEFT JOIN UERMMMC.dbo.CASES C 
            ON PR.CASENO = C.CASENO 

        LEFT JOIN UERMMMC.dbo.ROOMS R 
            ON C.LAST_ROOM = R.ROOMNO  
        LEFT JOIN UERMMMC.dbo.DIAGNOSIS D
            ON C.CASENO = D.CASENO 
        LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC
            ON PR.CASENO = PRC.CASENO 

        OUTER APPLY (
            SELECT TOP 1 Classification, Validity 
            FROM UERMHIMS.dbo.SocialServiceClass 
            WHERE RTRIM(PatientNo) = RTRIM(PR.PATIENTNO)
        ) SS

        WHERE 
            PR.ISFORADMISSION = 1
            AND PR.FORREVIEW = 0
            AND PR.REVIEWEDBY IS NULL
            -- AND PR.CREATEDAT >= DATEADD(hour, -24, GETDATE())

        ORDER BY PR.CREATEDAT DESC;
            `);

        return result.recordset;

    } catch (err) {
        console.error("Model Error (fetchPatientsForFinance):", err);
        throw err;
    }
},

    fetchErPatientsForFinanceApproval: async () => {
    try {
        const pool = await poolPromise; 
        const result = await pool.request().query(`
        SELECT
            C.CASENO,
            C.DATEAD, 
            C.PATIENT_CATEGORY,
            C.CC AS chiefComplaint, 
            C.LAST_ROOM,
            
            PR.PATIENTNO,   
            PR.PATIENTTYPE AS patientType,
            PR.HMO AS hmo,
            PR.ISFORADMISSION,
            PR.CREATEDAT,
            
            PR.SEX AS gender,
            PR.AGE AS age, 
            PR.PHILHEALTHID AS philhealthNo,
            CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE) AS address,
            (ISNULL(PR.FIRSTNAME, '') + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + ISNULL(PR.LASTNAME, '')) AS fullName,
            FORMAT(PR.BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
            
            D.ADMISSION AS admdiagnosis,
            SS.Classification AS ssClass,
            SS.Validity AS expiration,
            PRC.IS_APPROVED,
            R.TYPE_CODE AS typeCode,

            CAST(
                CASE 
                    WHEN EXISTS (
                        SELECT 1 
                        FROM UERMMMC.dbo.CASES C_CHK 
                        WHERE C_CHK.PATIENTNO = PR.PATIENTNO 
                        AND C_CHK.DATEAD < C.DATEAD
                    ) THEN 1 
                    ELSE 0 
                END AS BIT
            ) AS visitType,

            (
                SELECT TOP 1 C_SUB.DATEAD 
                FROM UERMMMC.dbo.CASES C_SUB 
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND C_SUB.isPay = 0
                ORDER BY C_SUB.DATEAD DESC
            ) AS lastAdSer,
            (
                SELECT TOP 1 C_SUB.DATEAD 
                FROM UERMMMC.dbo.CASES C_SUB 
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND C_SUB.isPay = 1
                ORDER BY C_SUB.DATEAD DESC
            ) AS lastAdPay,  
            (
                SELECT COUNT(C_SUB.CASENO) 
                FROM UERMMMC.dbo.CASES C_SUB 
                INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND R_SUB.TYPE_CODE = 'SER'
            ) AS admissionCountSer,
            (
                SELECT COUNT(C_SUB.CASENO) 
                FROM UERMMMC.dbo.CASES C_SUB 
                INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                AND R_SUB.TYPE_CODE != 'SER'
            ) AS admissionCountPay
            
        FROM UERMMMC.dbo.PATIENTREG PR
        LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC
            ON PR.PATIENTNO = PRC.PATIENTNO
        LEFT JOIN UERMMMC.dbo.CASES C 
            ON PR.CASENO = C.CASENO 
        LEFT JOIN UERMMMC.dbo.ROOMS R 
            ON C.LAST_ROOM = R.ROOMNO  
        LEFT JOIN UERMMMC.dbo.DIAGNOSIS D
            ON C.CASENO = D.CASENO 
        OUTER APPLY (
            SELECT TOP 1 Classification, Validity 
            FROM UERMHIMS.dbo.SocialServiceClass 
            WHERE RTRIM(PatientNo) = RTRIM(PR.PATIENTNO)
        ) SS

        WHERE 
            PR.ISFORADMISSION = 1
            AND PR.FORREVIEW = 1
            AND PR.REVIEWEDBY IS NOT NULL
            AND PRC.FOR_APPROV = 1 
            -- AND PR.CREATEDAT >= DATEADD(hour, -24, GETDATE())
            
        ORDER BY PR.CREATEDAT DESC;

            `);

        return result.recordset;;

    } catch (err) {
        console.error("Model Error (fetchErPatientsForFinanceApproval):", err);
        throw err;
    }
},

    searchFinanceRecord: async (query) => {
    try {
        const pool = await poolPromise;
        const searchPattern = `%${query}%`;

        const result = await pool.request()
            .input('searchQuery', sql.VarChar, searchPattern)
            .query(`
            SELECT
                C.CASENO,
                C.DATEAD, 
                C.PATIENT_CATEGORY,
                C.CC AS chiefComplaint, 
                C.LAST_ROOM,
                
                PR.PATIENTNO,   
                PR.PATIENTTYPE AS patientType,
                PR.HMO AS hmo,
                PR.ISFORADMISSION,
                PR.CREATEDAT,
                
                PR.SEX AS gender,
                PR.AGE AS age, 
                PR.PHILHEALTHID AS philhealthNo,
                CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE) AS address,
                (ISNULL(PR.FIRSTNAME, '') + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + ISNULL(PR.LASTNAME, '')) AS fullName,
                FORMAT(PR.BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
                
                D.ADMISSION AS admdiagnosis,
                SS.Classification AS ssClass,
                SS.Validity AS expiration,
                PRC.IS_APPROVED AS is_approved,
                R.TYPE_CODE AS typeCode,

                CAST(
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM UERMMMC.dbo.CASES C_CHK 
                            WHERE C_CHK.PATIENTNO = PR.PATIENTNO 
                            AND C_CHK.DATEAD < C.DATEAD
                        ) THEN 1 
                        ELSE 0 
                    END AS BIT
                ) AS visitType,

                (
                    SELECT TOP 1 C_SUB.DATEAD 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND C_SUB.isPay = 0
                    ORDER BY C_SUB.DATEAD DESC
                ) AS lastAdSer,
                (
                    SELECT TOP 1 C_SUB.DATEAD 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND C_SUB.isPay = 1
                    ORDER BY C_SUB.DATEAD DESC
                ) AS lastAdPay,  
                (
                    SELECT COUNT(C_SUB.CASENO) 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND R_SUB.TYPE_CODE = 'SER'
                ) AS admissionCountSer,
                (
                    SELECT COUNT(C_SUB.CASENO) 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND R_SUB.TYPE_CODE != 'SER'
                ) AS admissionCountPay
                
            FROM UERMMMC.dbo.PATIENTREG PR
            LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC
                ON PR.PATIENTNO = PRC.PATIENTNO
            LEFT JOIN UERMMMC.dbo.CASES C 
                ON PR.CASENO = C.CASENO 
            LEFT JOIN UERMMMC.dbo.ROOMS R 
                ON C.LAST_ROOM = R.ROOMNO  
            LEFT JOIN UERMMMC.dbo.DIAGNOSIS D
                ON C.CASENO = D.CASENO 
            OUTER APPLY (
                SELECT TOP 1 Classification, Validity 
                FROM UERMHIMS.dbo.SocialServiceClass 
                WHERE RTRIM(PatientNo) = RTRIM(PR.PATIENTNO)
            ) SS

            WHERE 
                PR.ISFORADMISSION = 1
                AND PR.FORREVIEW = 0
                AND PR.REVIEWEDBY IS NULL
                -- AND PR.CREATEDAT >= DATEADD(hour, -24, GETDATE())v
                AND (
                    CAST(PR.PATIENTNO AS VARCHAR(50)) LIKE @searchQuery
                    OR PR.LASTNAME LIKE @searchQuery
                    OR PR.FIRSTNAME LIKE @searchQuery
                    OR (ISNULL(PR.FIRSTNAME, '') + ' ' + ISNULL(PR.LASTNAME, '')) LIKE @searchQuery
                    OR (ISNULL(PR.LASTNAME, '') + ' ' + ISNULL(PR.FIRSTNAME, '')) LIKE @searchQuery
                    OR (ISNULL(PR.LASTNAME, '') + ', ' + ISNULL(PR.FIRSTNAME, '')) LIKE @searchQuery
                )

            ORDER BY PR.CREATEDAT DESC;

            `);
        return result.recordset;
    } catch (err) {
        console.error("Model Error (searchFinanceRecord):", err);
        throw err;
    }
},

    searchFinanceRecordApproval: async (query) => {
    try {
        const pool = await poolPromise;
        
        const searchPattern = `%${query}%`;
        const exactId = isNaN(query) ? 0 : parseInt(query);

        const result = await pool.request()
            .input('searchQuery', sql.VarChar, searchPattern)
            .input('exactId', sql.Int, exactId)
            .query(`
            SELECT
                C.CASENO,
                C.DATEAD, 
                C.PATIENT_CATEGORY,
                C.CC AS chiefComplaint, 
                C.LAST_ROOM,
                
                PR.PATIENTNO,   
                PR.PATIENTTYPE AS patientType,
                PR.HMO AS hmo,
                PR.ISFORADMISSION,
                PR.CREATEDAT,
                
                PR.SEX AS gender,
                PR.AGE AS age, 
                PR.PHILHEALTHID AS philhealthNo,
                CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE) AS address,
                (ISNULL(PR.FIRSTNAME, '') + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + ISNULL(PR.LASTNAME, '')) AS fullName,
                FORMAT(PR.BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
                
                D.ADMISSION AS admdiagnosis,
                SS.Classification AS ssClass,
                SS.Validity AS expiration,
                PRC.IS_APPROVED AS is_approved,
                R.TYPE_CODE AS typeCode,

                CAST(
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM UERMMMC.dbo.CASES C_CHK 
                            WHERE C_CHK.PATIENTNO = PR.PATIENTNO 
                            AND C_CHK.DATEAD < C.DATEAD
                        ) THEN 1 
                        ELSE 0 
                    END AS BIT
                ) AS visitType,

                (
                    SELECT TOP 1 C_SUB.DATEAD 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND C_SUB.isPay = 0
                    ORDER BY C_SUB.DATEAD DESC
                ) AS lastAdSer,
                (
                    SELECT TOP 1 C_SUB.DATEAD 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND C_SUB.isPay = 1
                    ORDER BY C_SUB.DATEAD DESC
                ) AS lastAdPay,  
                (
                    SELECT COUNT(C_SUB.CASENO) 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND R_SUB.TYPE_CODE = 'SER'
                ) AS admissionCountSer,
                (
                    SELECT COUNT(C_SUB.CASENO) 
                    FROM UERMMMC.dbo.CASES C_SUB 
                    INNER JOIN UERMMMC.dbo.ROOMS R_SUB ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                    WHERE C_SUB.PATIENTNO = PR.PATIENTNO
                    AND R_SUB.TYPE_CODE != 'SER'
                ) AS admissionCountPay
                
            FROM UERMMMC.dbo.PATIENTREG PR
            LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC
                ON PR.PATIENTNO = PRC.PATIENTNO
            LEFT JOIN UERMMMC.dbo.CASES C 
                ON PR.CASENO = C.CASENO 
            LEFT JOIN UERMMMC.dbo.ROOMS R 
                ON C.LAST_ROOM = R.ROOMNO  
            LEFT JOIN UERMMMC.dbo.DIAGNOSIS D
                ON C.CASENO = D.CASENO 
            OUTER APPLY (
                SELECT TOP 1 Classification, Validity 
                FROM UERMHIMS.dbo.SocialServiceClass 
                WHERE RTRIM(PatientNo) = RTRIM(PR.PATIENTNO)
            ) SS

            WHERE 
                PR.ISFORADMISSION = 1
                AND PR.FORREVIEW = 1
                AND PR.REVIEWEDBY IS NOT NULL
                AND PRC.FOR_APPROV = 1 
                -- AND PR.CREATEDAT >= DATEADD(hour, -24, GETDATE())
                
                AND (
                    CAST(PR.PATIENTNO AS VARCHAR(50)) LIKE @searchQuery
                    OR PR.LASTNAME LIKE @searchQuery
                    OR PR.FIRSTNAME LIKE @searchQuery
                    OR (ISNULL(PR.FIRSTNAME, '') + ' ' + ISNULL(PR.LASTNAME, '')) LIKE @searchQuery
                    OR (ISNULL(PR.LASTNAME, '') + ' ' + ISNULL(PR.FIRSTNAME, '')) LIKE @searchQuery
                    OR (ISNULL(PR.LASTNAME, '') + ', ' + ISNULL(PR.FIRSTNAME, '')) LIKE @searchQuery
                )
                
            ORDER BY PR.CREATEDAT DESC;
            `);

        return result.recordset;

    } catch (err) {
        console.error("Model Error (searchFinanceRecordApproval):", err);
        throw err;
    }
},

    seachReturningRecords: async (firstName, lastName, birthdate) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        let query = `
        SELECT 
            P.*,

            (P.LASTNAME + ', ' + P.FIRSTNAME 
                + CASE 
                    WHEN P.MIDDLENAME IS NOT NULL AND P.MIDDLENAME <> '' 
                    THEN ' ' + P.MIDDLENAME ELSE '' 
                END
                + CASE 
                    WHEN P.SUFFIX IS NOT NULL AND P.SUFFIX <> '' 
                    THEN ' ' + P.SUFFIX ELSE '' 
                END
            ) AS FULLNAME,

            R.DESCRIPTION AS RELIGION_DESC,
            N.DESCRIPTION AS NATIONALITY_DESC,
            B.DESCRIPTION AS BARANGAY_DESC,
            M.DESCRIPTION AS MUNICIPALITY_DESC,
            O.DESCRIPTION AS OCCUPATION_DESC

        FROM PATIENTINFO P
        LEFT JOIN RELIGION R 
            ON P.RELIGION = R.CODE
        LEFT JOIN NATIONALITY N 
            ON P.NATIONALITY = N.CODE
        LEFT JOIN BARANGAYS B 
            ON P.BARANGAY = B.CODE
        LEFT JOIN MUNICIPALITY M 
            ON P.MUNICIPALITY = M.CODE
        LEFT JOIN OCCUPATION O
            ON P.OCCUPATION = O.CODE

        WHERE 1 = 1
        
        `;

        if (firstName) {
            query += ` AND FIRSTNAME LIKE @firstName`;
            request.input("firstName", `%${firstName}%`);
        }

        if (lastName) {
            query += ` AND LASTNAME LIKE @lastName`;
            request.input("lastName", `%${lastName}%`);
        }

        if (birthdate) {
            query += ` AND CAST(DBIRTH AS DATE) = @birthdate`; 
            request.input("birthdate", birthdate);
        }

        const result = await request.query(query);
        return result.recordset;

    } catch (err) {
        throw err;
    }
},

    fetchInpatientRecords: async () => {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const result = await request.query(`
            SELECT 
                P.*,
                (P.FIRSTNAME + ' ' + ISNULL(P.MIDDLENAME + ' ', '') + P.LASTNAME + ISNULL(' ' + P.SUFFIX, '')) AS fullName, 
                ISNULL(P.MIDDLENAME, '') AS middleName, 
                ISNULL(P.SUFFIX, '') AS suffix,
                P.SEX AS gender, 
                FORMAT(P.BIRTHDATE, 'yyyy-MM-dd') AS birthdateStr,
                CONCAT_WS(', ', P.ADDRESSSTREET, P.ADDRESSBARANGAY, P.ADDRESSCITY, P.ADDRESSPROVINCE) AS addressPresent,
                PRC.IS_APPROVED,
                PRC.FOR_APPROV
            FROM PATIENTREG P
            LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC 
                ON PRC.PATIENTNO = P.PATIENTNO
            WHERE 
                P.PATIENTTYPE = 'INPATIENT'
            ORDER BY 
                P.CREATEDAT DESC;
            `);

            return result.recordset;

        } catch (err) {
            throw err;
        }
},

//FROM ER TO ADMITTING
    fetchErListRecords: async () => {
        try {
            const pool = await poolPromise;
            const request = pool.request();

            const result = await request.query(`
            SELECT 
                C.*,
                P.PATIENTNO,
                P.FIRSTNAME,
                P.LASTNAME,
                (P.FIRSTNAME + ' ' + ISNULL(P.MIDDLENAME + ' ', '') + P.LASTNAME + ISNULL(' ' + P.SUFFIX, '')) AS fullName,
                P.SEX AS gender,
                P.BIRTHDATE AS birthdate,
                P.PATIENTTYPE,
                PRC.IS_APPROVED,
                CONCAT_WS(', ', P.ADDRESSSTREET, P.ADDRESSBARANGAY, P.ADDRESSCITY, P.ADDRESSPROVINCE, P.ADDRESSREGION) AS addressPresent,
                CASE 
                    WHEN C.IsSenior = 1 THEN P.SENIORID 
                    ELSE NULL 
                END AS scid,
                D.ADMISSION AS diagnosis,  
                PC.PHIC_DESC AS phicDesc   
            FROM PATIENTREG P
            LEFT JOIN CASES C 
                ON P.PATIENTNO = C.PATIENTNO
            LEFT JOIN PATIENTREG_CREDIT PRC 
                ON P.PATIENTNO = PRC.PATIENTNO
            LEFT JOIN DIAGNOSIS D         
                ON C.CASENO = D.CASENO    
            LEFT JOIN PHIC_CODES PC             
                ON C.PHIC_CODE = PC.PHIC_CODE  
            WHERE 
                (P.ISADMITTED = 1 OR P.PATIENTTYPE = 'EMERGENCY')
                AND P.REVIEWEDBY IS NOT NULL
                AND PRC.IS_APPROVED = 1

            ORDER BY P.CREATEDAT DESC;
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
                    PATIENTREGID,
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
                WHERE PATIENTREGID = @pId
            `);

            return result.recordset.length > 0 ? result.recordset[0] : null;

        } catch (err) {
            console.error("Model Error (getSignatureByPatientId):", err);
            throw err;
        }
},

    sendToCredit: async (PATIENTREGID) => {
        try {
            const pool = await poolPromise;
            const request = pool.request();
            
            if (!PATIENTREGID) throw new Error("Patient ID is missing in Model");

            request.input('PATIENTREGID', sql.Int, PATIENTREGID); 

            await request.query(`
                UPDATE PATIENTREG
                SET ISFORADMISSION = 1,
                    FORREVIEW = 0
                WHERE PATIENTREGID = @PATIENTREGID
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

    getServices: async () => {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT	CODE=T0.DEPT_CODE,
                DESCRIPTION= T0.DEPARTMENT
                FROM [UERMMMC]..[DEPARTMENT] T0 WITH(NOLOCK)
                WHERE T0.DELETED = 0 
                ORDER BY T0.DEPARTMENT
            `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
},

    getDepartment: async () => {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT T0.CODE, T0.[DESCRIPTION] FROM
                [UERMMMC]..[SECTIONS] T0 WITH(NOLOCK)
                INNER JOIN  [UERMMMC_FINANCIALS]..[ACCOUNT_CATEGORY] T1 WITH(NOLOCK) ON T0.ACCOUNT_CATEGORY = T1.CODE
                WHERE T0.DELETED = 0
                GROUP BY
                T0.CODE, T0.[DESCRIPTION] , T1.[DESCRIPTION]
                ORDER BY
                T0.[DESCRIPTION]
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
},

    getRooms: async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                LTRIM(RTRIM(ROOMNO)) AS label, 
                LTRIM(RTRIM(ROOMNO)) AS value,
                RATE AS rate
            FROM UERMMMC.dbo.ROOMS 
            WHERE ROOMNO IS NOT NULL
            ORDER BY ROOMNO ASC
        `);
        return result.recordset;
    } catch (error) {
        throw error;
    }
},

    getRegion: async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                CODE, 
                NAME 
            FROM UERMHIMS.dbo.CodeRegion 
            ORDER BY NAME ASC
        `);
        return result.recordset;
    } catch (error) {
        throw error;
    }
},

    getProvince: async (regionPrefix) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('prefix', sql.VarChar, `${regionPrefix}%`)
            .query(`
                SELECT 
                    Code,
                    Name,
                    Province 
                FROM  UERMHIMS.dbo.CodeProvince
                WHERE Code LIKE @prefix
                ORDER BY Name ASC
            `);
        return result.recordset;
    } catch (error) {
        throw error;
    }
},

    getMunicipality: async (cityPrefix) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('prefix', sql.VarChar, `${cityPrefix}%`)
            .query(`
                SELECT 
                    Code,
                    Name
                FROM UERMHIMS.dbo.CodeMunicipalityCity 
                WHERE Code LIKE @prefix
                ORDER BY Name ASC
            `);
        return result.recordset;
    } catch (error) {
        throw error;
    }
},

//     getBarangays: async (search) => {
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('searchStr', sql.VarChar, `%${search}%`)
//             .query(`
//                 SELECT TOP (10) 
//                     CODE, 
//                     DESCRIPTION 
//                 FROM UERMMMC.dbo.BARANGAYS
//                 WHERE DESCRIPTION LIKE @searchStr
//                 ORDER BY DESCRIPTION ASC
//             `);
//         return result.recordset;
//     } catch (error) {
//         throw error;
//     }
// },

//     getAssessmentDetailsByCaseno: async (caseno) => {
//     try {
//         const pool = await poolPromise;
//         const request = pool.request();

//         request.input('caseno', sql.VarChar, caseno);

//         const result = await request.query(`
//             SELECT 
//                 PC.*, 
//                 (PI.LASTNAME + ', ' + PI.FIRSTNAME) AS fullName
//             FROM PATIENTREG_CREDIT PC
//             LEFT JOIN PATIENTINFO PI
//                 ON PC.PATIENTNO = PI.PATIENTNO
//             WHERE PC.CASENO = @caseno
//         `);

//         return result.recordset.length > 0 ? result.recordset[0] : null;

//     } catch (err) {
//         throw err;
//     }
// },

    getAssessmentDetailsByPatientno: async (patientno) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input('patientno', sql.VarChar, patientno);

        const result = await request.query(`
            SELECT 
                PC.*, 
                (PI.LASTNAME + ', ' + PI.FIRSTNAME) AS fullName
            FROM PATIENTREG_CREDIT PC
            LEFT JOIN PATIENTINFO PI
                ON PC.PATIENTNO = PI.PATIENTNO
            WHERE PC.PATIENTNO = @patientno
        `);

        return result.recordset.length > 0 ? result.recordset[0] : null;

    } catch (err) {
        throw err;
    }
},

    approvePatient: async (patientNo, approvedBy) => {
        const pool = await poolPromise; 
        const result = await pool.request()
            .input('patientNo', sql.VarChar, patientNo) 
            .input('approvedBy', sql.VarChar, approvedBy) 
            .query(`
                UPDATE PATIENTREG_CREDIT 
                SET IS_APPROVED = 1, 
                    APPROVED_BY = @approvedBy, 
                    UPDATEDAT = GETDATE() 
                WHERE PATIENTNO = @patientNo
            `);
        return result.rowsAffected[0];
    },

    disapprovePatient: async (patientNo) => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request()
                .input('patientNo', sql.VarChar, patientNo) 
                .query(`
                    UPDATE PATIENTREG_CREDIT 
                    SET IS_APPROVED = 0 
                    WHERE PATIENTNO = @patientNo
                `);

            return result.rowsAffected[0];

        } catch (err) {
            console.error("Model Error (disapprovePatient):", err);
            throw err;
        }
    },

};

module.exports = PatientModel;