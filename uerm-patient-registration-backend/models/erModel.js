const { sql, poolPromise } = require('../config/sqlHelper');

const toDecimal = (val) => (val === "" || val === undefined || val === null) ? null : parseFloat(val);
const toInt = (val) => (val === "" || val === undefined || val === null) ? null : parseInt(val, 10);
const toStr = (val) => (val === "" || val === undefined) ? null : val;

const processBase64 = (base64String) => {
    if (!base64String) return null;
    const cleanString = base64String.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(cleanString, 'base64');
};

const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const dob = new Date(birthDateString);
    if (isNaN(dob)) return null; 
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
    };

const ErModel = {
    
    registerTriage: async (body) => {
    let pool;
    let transaction;

    try {
        const streetVal = body.streetName;
        const barangayVal = body.selectedBarangay; 
        
        const cityVal = body.selectedCity && typeof body.selectedCity === 'object' 
            ? body.selectedCity.Name 
            : body.selectedCity;
            
        let provinceVal = body.selectedProvince && typeof body.selectedProvince === 'object' 
            ? body.selectedProvince.Name 
            : body.selectedProvince;
            
        if (provinceVal && typeof provinceVal === 'string') {
            provinceVal = provinceVal.split(' (')[0].trim();
        }

        const regionVal = body.selectedRegion && typeof body.selectedRegion === 'object' 
            ? body.selectedRegion.NAME 
            : body.selectedRegion;

        const permParts = [streetVal, barangayVal, cityVal, provinceVal, regionVal];
        const formattedPermanentAddress = permParts
            .filter(part => part && String(part).trim() !== '')
            .join(', ');

        const t = {
            patientNo: toStr(body.patientNo),
            lastName: toStr(body.lastNameTriage),
            firstName: toStr(body.firstNameTriage),
            middleName: toStr(body.middleNameTriage),
            suffix: toStr(body.suffixTriage),
            birthdate: body.birthdateTriage || null,
            age: calculateAge(body.birthdateTriage),
            gender: toStr(body.genderTriage),
            civilStatus: toStr(body.civilStatus),

            street: toStr(streetVal),
            barangay: toStr(barangayVal),
            city: toStr(cityVal),
            province: toStr(provinceVal),
            region: toStr(regionVal),

            patientType: toStr(body.patientType),
            infirmary: toStr(body.infirmary),
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
            symptoms: Array.isArray(body.checkforPresense)
                ? body.checkforPresense.join(', ')
                : toStr(body.checkforPresense),
            cpName: toStr(body.contactPersonTriage),
            cpAddress: toStr(body.contactPersonTriageAddress),
            cpMobile: toStr(body.contactPersonTriageMobile),
            seniorId: toStr(body.scidnoTriage),
            pwdId: toStr(body.pwdTriage),
            hmo: toStr(body.hmoName),
            personnel: toStr(body.personnelTriage),
            dateAccomplished: body.dateTriage ? new Date(body.dateTriage) : new Date(),
            patientSignature: body.patientSignature
        };

        pool = await poolPromise;
        transaction = new sql.Transaction(pool);
        await transaction.begin();

        const request = new sql.Request(transaction);

        request
            .input('patientNo', sql.NVarChar, t.patientNo?.toUpperCase())
            .input('lastName', sql.NVarChar, t.lastName?.toUpperCase())
            .input('firstName', sql.NVarChar, t.firstName?.toUpperCase())
            .input('middleName', sql.NVarChar, t.middleName?.toUpperCase())
            .input('suffix', sql.NVarChar, t.suffix?.toUpperCase())
            .input('birthdate', sql.Date, t.birthdate)
            .input('age', sql.Int, t.age)
            .input('gender', sql.NVarChar, t.gender?.toUpperCase())
            .input('civilStatus', sql.NVarChar, t.civilStatus?.toUpperCase())
            .input('street', sql.NVarChar, t.street?.toUpperCase())
            .input('barangay', sql.NVarChar, t.barangay?.toUpperCase())
            .input('city', sql.NVarChar, t.city?.toUpperCase())
            .input('province', sql.NVarChar, t.province?.toUpperCase())
            .input('region', sql.NVarChar, t.region?.toUpperCase())
            .input('patientType', sql.NVarChar, t.patientType?.toUpperCase())
            .input('infirmary', sql.NVarChar, t.infirmary?.toUpperCase())
            .input('chiefComplaint', sql.NVarChar, t.chiefComplaint?.toUpperCase())
            .input('temp', sql.Decimal(5, 2), t.temp)
            .input('heartRate', sql.Int, t.heartRate)
            .input('oxygen', sql.Decimal(5, 2), t.oxygen)
            .input('bp', sql.NVarChar, t.bp?.toUpperCase())
            .input('respiRate', sql.Int, t.respiRate)
            .input('painScore', sql.Int, t.painScore)
            .input('avpu', sql.NVarChar, t.avpu?.toUpperCase())
            .input('contagious', sql.NVarChar, t.contagious?.toUpperCase())
            .input('isolation', sql.NVarChar, t.isolation?.toUpperCase())
            .input('cpd', sql.NVarChar, t.cpd?.toUpperCase())
            .input('level', sql.NVarChar, t.level?.toUpperCase())
            .input('remarks', sql.NVarChar, t.remarks?.toUpperCase())
            .input('symptoms', sql.NVarChar, t.symptoms?.toUpperCase())
            .input('cpName', sql.NVarChar, t.cpName?.toUpperCase())
            .input('cpAddress', sql.NVarChar, t.cpAddress?.toUpperCase())
            .input('cpMobile', sql.NVarChar, t.cpMobile?.toUpperCase())
            .input('hmo', sql.NVarChar, t.hmo?.toUpperCase())
            .input('seniorId', sql.NVarChar, t.seniorId?.toUpperCase())
            .input('pwdId', sql.NVarChar, t.pwdId?.toUpperCase())
            .input('personnel', sql.NVarChar, t.personnel?.toUpperCase())
            .input('dateAccomplished', sql.Date, t.dateAccomplished);

        const result = await request.query(`
            INSERT INTO PATIENTREG (
                PATIENTNO, LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX,
                BIRTHDATE, AGE, SEX, CIVILSTATUS,
                INFIRMARY, PATIENTTYPE,
                ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION,
                CHIEFCOMPLAINT, TEMP, HEARTRATE, OXYGEN, BP, RESPIRATE, PAINSCORE,
                AVPU, CONTAGIOUS, ISOLATION, CPD, LEVEL, REMARKS, SYMPTOMS,
                CPNAME, CPADDRESS, CPMOBILE,
                HMO, SENIORID, PWDID,
                PERSONNEL, DATEACCOMPLISHED, CREATEDAT, ISRETURNING
            )
            OUTPUT INSERTED.PATIENTREGID
            VALUES (
                @patientNo, @lastName, @firstName, @middleName, @suffix,
                @birthdate, @age, @gender, @civilStatus,
                @infirmary, @patientType,
                @street, @barangay, @city, @province, @region,
                @chiefComplaint, @temp, @heartRate, @oxygen, @bp, @respiRate, @painScore,
                @avpu, @contagious, @isolation, @cpd, @level, @remarks, @symptoms,
                @cpName, @cpAddress, @cpMobile,
                @hmo, @seniorId, @pwdId,
                @personnel, @dateAccomplished, GETDATE(),
                CASE WHEN @patientNo IS NOT NULL AND @patientNo <> '' THEN 1 ELSE 0 END
            );
        `);

        const patientId = result.recordset[0]?.PATIENTREGID;
        if (!patientId) throw new Error("Failed to generate Patient ID");

        if (t.patientSignature) {
            const ptRequest = new sql.Request(transaction);
            const patientBuffer = processBase64(t.patientSignature);

            ptRequest
                .input('patientNo', sql.VarChar, t.patientNo)
                .input('pId', sql.Int, patientId)
                .input('signData', sql.VarBinary(sql.MAX), patientBuffer);

            await ptRequest.query(`
                INSERT INTO PATIENTREG_PTSIGNATURE (PATIENTREGID, PATIENTNO, SIGNATURE, CREATED)
                VALUES (@pId, @patientNo, @signData, GETDATE())
            `);
        }

        await transaction.commit();
        return patientId;

    } catch (err) {
        if (transaction) {
            try { await transaction.rollback(); } catch (e) {}
        }
        throw err;
    }
},

    updateTriage: async (body) => {
        let transaction;
        try {
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

            const pool = await poolPromise;
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            const request = new sql.Request(transaction); 

            request.input('idnoInput', sql.BigInt, t.idnoInput);
            request.input('patientId', sql.BigInt, t.idInput); 
            request.input('lastName', sql.NVarChar, t.lastName ? t.lastName.toUpperCase() : null);
            request.input('firstName', sql.NVarChar, t.firstName ? t.firstName.toUpperCase() : null);
            request.input('middleName', sql.NVarChar, t.middleName ? t.middleName.toUpperCase() : null);
            request.input('suffix', sql.NVarChar, t.suffix ? t.suffix.toUpperCase() : null);
            request.input('birthdate', sql.VarChar, t.birthdate);
            request.input('age', sql.Int, t.age);
            request.input('gender', sql.NVarChar, t.gender ? t.gender.toUpperCase() : null);
            request.input('weightTriage', sql.NVarChar, t.weightTriage ? t.weightTriage.toUpperCase() : null);
            request.input('broughtBy', sql.NVarChar, t.broughtBy ? t.broughtBy.toUpperCase() : null);
            request.input('philHealthCateg', sql.NVarChar, t.philHealthCateg ? t.philHealthCateg.toUpperCase() : null);
            request.input('ptCondition', sql.NVarChar, t.ptCondition ? t.ptCondition.toUpperCase() : null);
            request.input('chiefComplaint', sql.NVarChar, t.chiefComplaint ? t.chiefComplaint.toUpperCase() : null);
            request.input('temp', sql.Decimal(5, 2), t.temp);
            request.input('heartRate', sql.Int, t.heartRate);
            request.input('oxygen', sql.Decimal(5, 2), t.oxygen);
            request.input('bp', sql.NVarChar, t.bp ? t.bp.toUpperCase() : null);
            request.input('respiRate', sql.Int, t.respiRate);
            request.input('painScore', sql.Int, t.painScore);
            request.input('avpu', sql.NVarChar, t.avpu ? t.avpu.toUpperCase() : null);
            request.input('contagious', sql.NVarChar, t.contagious ? t.contagious.toUpperCase() : null);
            request.input('isolation', sql.NVarChar, t.isolation ? t.isolation.toUpperCase() : null);
            request.input('cpd', sql.NVarChar, t.cpd ? t.cpd.toUpperCase() : null);
            request.input('level', sql.NVarChar, t.level ? t.level.toUpperCase() : null);
            request.input('remarks', sql.NVarChar, t.remarks ? t.remarks.toUpperCase() : null);
            request.input('checkforPresense', sql.NVarChar, t.checkforPresense ? t.checkforPresense.toUpperCase() : null);
            request.input('personnel', sql.NVarChar, t.personnel ? t.personnel.toUpperCase() : null);
            request.input('dateAccomplished', sql.Date, t.dateAccomplished);

            const result = await request.query(`
                IF EXISTS (SELECT 1 FROM PATIENTREG WHERE PATIENTREGID = @patientId)
                BEGIN
                    UPDATE PATIENTREG
                    SET 
                        LASTNAME = @lastName, FIRSTNAME = @firstName, MIDDLENAME = @middleName, SUFFIX = @suffix,
                        BIRTHDATE = @birthdate, AGE = @age, SEX = @gender,
                        WEIGHT = @weightTriage, BROUGHTBY = @broughtBy, PHILHEALTHCATEG = @philHealthCateg, PTCONDITION = @ptCondition,
                        CHIEFCOMPLAINT = @chiefComplaint, TEMP = @temp, HEARTRATE = @heartRate, OXYGEN = @oxygen,
                        BP = @bp, RESPIRATE = @respiRate, PAINSCORE = @painScore,
                        AVPU = @avpu, CONTAGIOUS = @contagious, ISOLATION = @isolation, CPD = @cpd,
                        LEVEL = @level, REMARKS = @remarks, SYMPTOMS = @checkforPresense,
                        PERSONNEL = @personnel, DATEACCOMPLISHED = @dateAccomplished,
                        PATIENTTYPE = 'EMERGENCY', UPDATEDAT = GETDATE()
                    OUTPUT inserted.PATIENTREGID, inserted.PATIENTNO
                    WHERE PATIENTREGID = @patientId
                END
                ELSE
                BEGIN
                    INSERT INTO PATIENTREG (
                        PATIENTNO, 
                        LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX, BIRTHDATE, AGE, SEX,
                        WEIGHT, BROUGHTBY, PHILHEALTHCATEG, PTCONDITION,
                        CHIEFCOMPLAINT, TEMP, HEARTRATE, OXYGEN, BP, RESPIRATE, PAINSCORE,
                        AVPU, CONTAGIOUS, ISOLATION, CPD, LEVEL, REMARKS, SYMPTOMS,
                        PERSONNEL, DATEACCOMPLISHED, PATIENTTYPE, UPDATEDAT
                    )
                    OUTPUT inserted.PATIENTREGID, inserted.PATIENTNO
                    VALUES (
                        @idnoInput, 
                        @lastName, @firstName, @middleName, @suffix, @birthdate, @age, @gender,
                        @weightTriage, @broughtBy, @philHealthCateg, @ptCondition,
                        @chiefComplaint, @temp, @heartRate, @oxygen, @bp, @respiRate, @painScore,
                        @avpu, @contagious, @isolation, @cpd, @level, @remarks, @checkforPresense,
                        @personnel, @dateAccomplished, 'Emergency', GETDATE()
                    )
                END
            `);

            if (!result.recordset || result.recordset.length === 0) {
                throw new Error("Database Error: Operation completed but no ID returned.");
            }

            const dbPatientPk = result.recordset[0].PATIENTREGID; 
            const dbPatientNo = result.recordset[0].PATIENTNO; 

            if (t.personnelSignature) {
                const psRequest = new sql.Request(transaction); 
                const personnelBuffer = processBase64(t.personnelSignature);
                
                psRequest.input('pId', sql.Int, dbPatientPk); 
                psRequest.input('pNo', sql.BigInt, dbPatientNo); 
                psRequest.input('signData', sql.VarBinary(sql.MAX), personnelBuffer);
                psRequest.input('personnelName', sql.NVarChar, t.personnel); 

                await psRequest.query(`
                IF EXISTS (SELECT 1 FROM PATIENTREG_TPSIGNATURE WHERE PATIENTNO = @pNo)
                    BEGIN
                        UPDATE PATIENTREG_TPSIGNATURE 
                        SET TPSIGNATURE = @signData, 
                            NAME = @personnelName, 
                            PATIENTREGID = @pId 
                        WHERE PATIENTNO = @pNo
                    END
                    ELSE
                    BEGIN
                        INSERT INTO PATIENTREG_TPSIGNATURE (PATIENTREGID, PATIENTNO, TPSIGNATURE, NAME) 
                        VALUES (@pId, @pNo, @signData, @personnelName)
                    END
                `);
            }

            await transaction.commit();

            return { 
                PATIENTNO: dbPatientNo,
                PATIENTREGID: dbPatientPk
            };

        } catch (err) {
            if (transaction) {
                try { await transaction.rollback(); } catch (e) { console.error("Rollback failed", e); }
            }
            throw err; 
        }
    },

    // generateCaseNumber: async (data) => {
    //     const pool = await sql.connect();
    //     const transaction = new sql.Transaction(pool);

    //     try {
    //         await transaction.begin();

    //         const hmoReq = new sql.Request(transaction);
    //         hmoReq.input('hmoDesc', sql.VarChar, data.caseHmo ?? null);
    //         const hmoResult = await hmoReq.query(`
    //             SELECT TOP 1 CODE 
    //             FROM [UERMMMC]..[HMO] WITH(NOLOCK)
    //             WHERE UPPER(LTRIM(RTRIM(NAME))) = UPPER(LTRIM(RTRIM(@hmoDesc)))
    //         `);
    //         const actualHmoCode = hmoResult.recordset.length > 0 ? hmoResult.recordset[0].CODE : null;

    //         const generateCaseQuery = `
    //             DECLARE @tmpVal VARCHAR(8);
                
    //             IF (SELECT MAX(CONVERT(INT,LEFT(RTRIM(CASENO),7))) + 1  
    //                 FROM [UERMMMC]..[CASES] WITH(NOLOCK) 
    //                 WHERE RIGHT(CASENO, 1) = 'B') IS NULL
    //             BEGIN
    //                 SELECT '0000001B' AS NewCaseNo
    //             END
    //             ELSE
    //             BEGIN
    //                 SET @tmpVal = (
    //                     SELECT CONVERT(VARCHAR(8), 
    //                         MAX(CONVERT(INT, LEFT(RTRIM(caseno),7))) + 1)
    //                     FROM [UERMMMC]..[CASES] WITH(NOLOCK) 
    //                     WHERE RIGHT(RTRIM(CASENO), 1) = 'B'
    //                 )
    //                 SELECT REPLICATE('0', 7-LEN(@tmpVal)) + @tmpVal + 'B' AS NewCaseNo
    //             END
    //         `;

    //         const genReq = new sql.Request(transaction);
    //         const caseResult = await genReq.query(generateCaseQuery);
    //         const newCaseNo = caseResult.recordset[0].NewCaseNo;

    //         const insertReq = new sql.Request(transaction);

    //         insertReq.input('caseNo', sql.VarChar, newCaseNo);
    //         insertReq.input('patientNo', sql.VarChar, data.casepatientno ?? null);
    //         insertReq.input('caseOrSched', sql.Int, data.caseOrSched ?? 0);
    //         insertReq.input('caseDependent', sql.VarChar, typeof caseDependent !== 'undefined' ? caseDependent : null); 
    //         insertReq.input('caseTransfer', sql.VarChar, data.caseTransfer ?? null);
    //         insertReq.input('caseAge', sql.Int, data.caseAge ?? 0);
    //         insertReq.input('casedtAdmission', sql.VarChar, data.casedtAdmission ?? null);
    //         insertReq.input('casepwdId', sql.VarChar, data.casepwdId ?? null);
    //         insertReq.input('caseSeniorId', sql.VarChar, data.caseSeniorId ?? null);
    //         insertReq.input('casepatientCat', sql.VarChar, data.casepatientCat ?? null);
    //         insertReq.input('chiefComplaintTriage', sql.VarChar, data.chiefComplaintTriage ?? null);
    //         insertReq.input('caseadmDiagnosis', sql.VarChar, data.caseadmDiagnosis ?? null);
    //         insertReq.input('casefromER', sql.VarChar, data.casefromER ?? null);
    //         insertReq.input('caseserviceType', sql.VarChar, data.caseserviceType ?? null);
    //         insertReq.input('caseAllergies', sql.VarChar, data.caseAllergies ?? null);
    //         insertReq.input('caseerPhysician', sql.VarChar, data.caseerPhysician ?? null);
    //         insertReq.input('caseCensusInfirmary', sql.VarChar, data.caseCensusInfirmary ?? null);
    //         insertReq.input('caseDepartment', sql.VarChar, data.caseDepartment ?? null);
    //         insertReq.input('caseAdmittedBy', sql.VarChar, data.caseAdmittedBy ?? null);
    //         insertReq.input('casepdfRemarks', sql.VarChar, data.casepdfRemarks ?? null);
    //         insertReq.input('caseRemarks', sql.VarChar, data.caseRemarks ?? null);
    //         insertReq.input('COMPANY_CODE', sql.VarChar, data.caseCompany ?? null);
    //         insertReq.input('HMOCODE', sql.VarChar, actualHmoCode); 
    //         insertReq.input('employer', sql.VarChar, data.caseEmployer ?? null);
    //         insertReq.input('card_No', sql.VarChar, data.caseCardNo ?? null);
    //         insertReq.input('creditlimit', sql.VarChar, data.casecovAmount ?? null);
    //         insertReq.input('approvalCode', sql.VarChar, data.caseappCode ?? null);
    //         insertReq.input('effectivity', sql.VarChar, data.caseEffectivity ?? null);
    //         insertReq.input('roomplan', sql.VarChar, data.casermPlan ?? null);
    //         insertReq.input('HMO_LOA', sql.VarChar, data.caseLoa ?? null);
    //         insertReq.input('HMO_APPROVALNO', sql.VarChar, data.caseApprov ?? null);
    //         insertReq.input('inf_Name', sql.VarChar, data.caseInformantName ?? null);
    //         insertReq.input('inf_Add', sql.VarChar, data.caseInfAddress ?? null);
    //         insertReq.input('inf_Rel', sql.VarChar, data.caseInfRelationship?.value ?? data.caseInfRelationship ?? null);

    //         const insertQuery = `
    //             INSERT INTO [UERMMMC]..[CASES] (
    //                 CASENO, PATIENTNO, PATIENT_CATEGORY, PATIENTTYPE, DATEAD, CC, TYPE_OF_ADMISSION, 
    //                 DISC_CODE, DEPTID, PWD_IDNo, isPay, Charity, ISSENIOR, ISNEWBORN_NONPATHOLOGIC, UDF_ISPWD, 
    //                 CATEGORY, COMPANY_CODE, HMO_CODE, EMPLOYER, CARD_NO, EFFECTIVITY, CREDITLIMIT,
    //                 UDF_APPROVALCODE, ROOM_PLAN, Informant, InformantAddRESS, Informantrelation, 
    //                 UERM_STUD_EMPLOYEE, UDF_REMARKS, UDF_CaseDept, ADMITTED_BY, UDF_DATEADDED, 
    //                 DISC_CODE1, COMPANY2, HMO2, AGE, UDF_AppVersion, UDF_CaseLink, UDF_isChild, 
    //                 hmo_transloa, hmo_transapp, ForAdmission, ApplicationName, ForORScheduled, Allergies
    //             )
    //             SELECT
    //                 CASENO              = @caseNo 
    //                 , PATIENTNO         = @patientNo
    //                 , PATIENT_CATEGORY  = @casepatientCat
    //                 , PATIENTTYPE       = 'OPD'
    //                 , DATEAD            = @casedtAdmission
    //                 , CC                = @chiefComplaintTriage
    //                 , TYPE_OF_ADMISSION = @casefromER
    //                 , DISC_CODE = CASE WHEN NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.PWD_IDNo FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NOT NULL AND NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.SCIDNO FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NULL THEN 'DISAB' WHEN NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.SCIDNO FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NOT NULL AND NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.PWD_IDNo FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NULL THEN 'SEN' ELSE '' END
    //                 , DEPTID            = @caseserviceType
    //                 , PWD_IDNo          = @casepwdId
    //                 , isPay             = CASE WHEN @casepatientCat = 'PAY' THEN 1 ELSE 0 END
    //                 , Charity           = CASE WHEN @casepatientCat = 'CHA' THEN 1 ELSE 0 END
    //                 , ISSENIOR          = CASE WHEN NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.SCIDNO FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NOT NULL THEN 1 ELSE 0 END
    //                 , ISNEWBORN_NONPATHOLOGIC = 0
    //                 , UDF_ISPWD         = CASE WHEN NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.PWD_IDNo FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NOT NULL THEN 1 ELSE 0 END
    //                 , CATEGORY          = CASE WHEN LEFT(RIGHT(@caseNo, 2), 1) = 'N' THEN 'NEWBORN' ELSE NULL END
    //                 , COMPANY_CODE      = @COMPANY_CODE
    //                 , HMO_CODE          = @HMOCODE
    //                 , EMPLOYER          = @employer
    //                 , CARD_NO           = @card_No
    //                 , EFFECTIVITY       = CASE WHEN @effectivity IS NULL THEN CONVERT(VARCHAR(20), CAST(GETDATE() AS DATETIME), 101) ELSE CONVERT(VARCHAR(20), CAST(@effectivity AS DATETIME), 101) END
    //                 , CREDITLIMIT       = CAST(CASE WHEN @creditlimit IS NULL THEN 0 ELSE cast(@creditlimit as decimal(18,2)) END AS DECIMAL(18,2))
    //                 , UDF_APPROVALCODE  = @approvalCode
    //                 , ROOM_PLAN         = @roomplan
    //                 , Informant         = @inf_Name
    //                 , InformantAddRESS  = @inf_Add
    //                 , Informantrelation = @inf_Rel                          
    //                 , UERM_STUD_EMPLOYEE= @caseCensusInfirmary
    //                 , UDF_REMARKS       = @caseRemarks
    //                 , UDF_CaseDept      = 'ER'
    //                 , ADMITTED_BY       = @caseAdmittedBy
    //                 , UDF_DATEADDED     = GETDATE()
    //                 , DISC_CODE1        = 'N/A'
    //                 , COMPANY2          = 'N/A'
    //                 , HMO2              = 'N/A'
    //                 , AGE               = @caseAge
    //                 , UDF_AppVersion    = NULL
    //                 , UDF_CaseLink      = CASE WHEN LEFT(RIGHT(@caseNo, 2), 1) = 'N' THEN LEFT(@caseNo, LEN(@caseNo)-2) END
    //                 , UDF_isChild       = CASE WHEN LEFT(RIGHT(@caseNo, 2), 1) = 'N' THEN 1 ELSE 0 END
    //                 , hmo_transloa      = @HMO_LOA
    //                 , hmo_transapp      = @HMO_APPROVALNO
    //                 , ForAdmission      = 1
    //                 , ApplicationName   = 'UERMPATIENTREG'
    //                 , ForORScheduled    = @caseOrSched
    //                 , Allergies         = @caseAllergies
    //         `;

    //         await insertReq.query(insertQuery);

    //         const diagnosisReq = new sql.Request(transaction);
    //         diagnosisReq.input('caseNo', sql.VarChar, newCaseNo);
    //         diagnosisReq.input('caseadmDiagnosis', sql.VarChar, data.caseadmDiagnosis ?? null);

    //         await diagnosisReq.query(`
    //             INSERT INTO dbo.DIAGNOSIS (
    //                 CASENO,
    //                 ADMISSION
    //             )
    //             VALUES (
    //                 @caseNo,
    //                 @caseadmDiagnosis
    //             );
    //         `);

    //         const updateReq = new sql.Request(transaction);
    //         updateReq.input('caseNo', sql.VarChar, newCaseNo);
    //         updateReq.input('patientNo', sql.VarChar, data.casepatientno ?? null);

    //         await updateReq.query(`
    //             UPDATE [UERMMMC]..[PATIENTREG]
    //             SET 
    //                 CASENO = @caseNo,
    //                 FORREVIEW = 1
    //             WHERE PATIENTNO = @patientNo;
    //         `);

    //         await transaction.commit();

    //         return {
    //             patient_no: data.casepatientno,
    //             patient_id: data.patientId,
    //             case_no: newCaseNo
    //         };

    //     } catch (error) {
    //         try {
    //             if (transaction) await transaction.rollback();
    //         } catch (rollbackError) {
    //             console.error("Rollback Error:", rollbackError);
    //         }
            
    //         console.error("Database Insert Error:", error);
    //         throw error;
    //     }
    // },

    admitPatient: async (data) => {
        try {
        const pool = await poolPromise; 
        
        const result = await pool.request()
            .input('pId', sql.Int, data.PATIENTREGID)
            .input('admittingPhysician', sql.VarChar, data.admittingPhysician || null)
            .input('admittingDepartment', sql.VarChar, data.admittingDepartment || null)
            .input('attendingPhysician', sql.VarChar, data.attendingPhysician || null)
            .input('attendingDepartment', sql.VarChar, data.attendingDepartment || null)
            .query(`
            UPDATE PATIENTREG 
            SET 
                ISFORADMISSION = 1,
                FORREVIEW = 0,
                UPDATEDAT = GETDATE(),
                ADM_PHYSICIAN = @admittingPhysician,
                ADM_PHYSICIAN_DEPT = @admittingDepartment,
                ATT_PHYSICIAN = @attendingPhysician,
                ATT_PHYSICIAN_DEPT = @attendingDepartment

            WHERE PATIENTREGID = @pId;
            `);

        return result.rowsAffected[0];

        } catch (err) {
        console.error("Model Error (admitPatient):", err);
        throw err;
        }
    },

    //GET ER LIST
    // getAllErPatients: async () => {
    //     try {
    //         const pool = await poolPromise; 
            
    //         const result = await pool.request().query(`
    //         SELECT 
    //                 PR.*,  
                    
    //                 (PR.FIRSTNAME + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + PR.LASTNAME) AS fullName,
    //                 FORMAT(PR.BIRTHDATE, 'yyyy-MM-dd') as birthdateStr,
    //                 PR.SEX as gender, 
    //                 CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE, PR.ADDRESSREGION) AS addressPresent,

    //                 C.DATEDIS,
    //                 C.DISCHARGE,
    //                 C.DISCHARGEBY,
    //                 PRC.IS_APPROVED,

    //                 CASE 
    //                     WHEN PR.HMO IS NOT NULL AND LTRIM(RTRIM(PR.HMO)) NOT IN ('', 'N/A') THEN 'HMO'
    //                     WHEN PR.INFIRMARY IS NOT NULL AND LTRIM(RTRIM(PR.INFIRMARY)) NOT IN ('', 'N/A') THEN 'Infirmary'
    //                     ELSE 'Cash'
    //                 END AS paymentType,

    //                 CASE 
    //                     WHEN PR.LEVEL = 'EMERGENT' THEN 'High'
    //                     WHEN PR.LEVEL = 'URGENT' THEN 'Medium'
    //                     WHEN PR.LEVEL = 'NON-URGENT' THEN 'Low'
    //                     ELSE 'Unassigned' 
    //                 END AS priority
                    
    //             FROM PATIENTREG PR
                
    //             LEFT JOIN UERMMMC.dbo.CASES C ON PR.PATIENTNO = C.PATIENTNO
    //             LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC ON PR.PATIENTNO = PRC.PATIENTNO
                
    //             WHERE 
    //                 PR.PATIENTTYPE = 'EMERGENCY' 
    //                 AND (
    //                     PR.ISRETURNING = 1  
    //                     OR 
    //                     (
    //                         (C.DISCHARGE IN ('N', 'No') OR C.DISCHARGE IS NULL)
    //                         AND 
    //                         (C.DISCHARGEBY IS NULL OR LTRIM(RTRIM(C.DISCHARGEBY)) = '')
    //                     )
    //                 )
    //             ORDER BY PR.CREATEDAT DESC
    //         `);

    //         return result.recordset;

    //     } catch (err) {
    //         console.error("Model Error (getAllErPatients):", err);
    //         throw err;
    //     }
    // },

    getAllErPatients: async () => {
    try {
        const pool = await poolPromise; 
        
        const result = await pool.request().query(`
        SELECT 
            PR.*,  
            (PR.FIRSTNAME + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + PR.LASTNAME) AS fullName,
            CONVERT(VARCHAR(10), PR.BIRTHDATE, 120) as birthdateStr, -- Faster than FORMAT()
            PR.SEX as gender, 
            CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE, PR.ADDRESSREGION) AS addressPresent,
            C.DATEDIS,
            C.DISCHARGE,
            C.DISCHARGEBY,
            PRC.IS_APPROVED,

            CASE 
                WHEN PR.HMO IS NOT NULL AND LTRIM(RTRIM(PR.HMO)) NOT IN ('', 'N/A') THEN 'HMO'
                WHEN PR.INFIRMARY IS NOT NULL AND LTRIM(RTRIM(PR.INFIRMARY)) NOT IN ('', 'N/A') THEN 'Infirmary'
                ELSE 'Cash'
            END AS paymentType,

            CASE 
                WHEN PR.LEVEL = 'EMERGENT' THEN 'High'
                WHEN PR.LEVEL = 'URGENT' THEN 'Medium'
                WHEN PR.LEVEL = 'NON-URGENT' THEN 'Low'
                ELSE 'Unassigned' 
            END AS priority
            
        FROM PATIENTREG PR
        
        LEFT JOIN UERMMMC.dbo.CASES C ON PR.PATIENTNO = C.PATIENTNO 
            AND (C.DISCHARGE IN ('N', 'No') OR C.DISCHARGE IS NULL)
            AND (C.DISCHARGEBY IS NULL OR LTRIM(RTRIM(C.DISCHARGEBY)) = '')

        LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC ON PR.PATIENTNO = PRC.PATIENTNO
        
        WHERE 
            PR.PATIENTTYPE = 'EMERGENCY'
        ORDER BY PR.CREATEDAT DESC
        `);

        return result.recordset;

    } catch (err) {
        console.error("Model Error (getAllErPatients):", err);
        throw err;
    }
},

    searchPatients: async (query) => {
        try {
            const pool = await poolPromise;
            
            const searchPattern = `%${query}%`;
            const exactId = isNaN(query) ? 0 : parseInt(query);

            const result = await pool.request()
                .input('search', sql.NVarChar, searchPattern)
                .input('exactId', sql.Int, exactId)
                .query(`
                SELECT 
                        PR.*,  
                        (PR.FIRSTNAME + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + PR.LASTNAME) AS fullName,
                        CONVERT(VARCHAR(10), PR.BIRTHDATE, 120) as birthdateStr, 
                        PR.SEX as gender, 
                        CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE, PR.ADDRESSREGION) AS addressPresent,
                        C.DATEDIS,
                        C.DISCHARGE,
                        C.DISCHARGEBY,
                        PRC.IS_APPROVED,

                        CASE 
                            WHEN PR.HMO IS NOT NULL AND LTRIM(RTRIM(PR.HMO)) NOT IN ('', 'N/A') THEN 'HMO'
                            WHEN PR.INFIRMARY IS NOT NULL AND LTRIM(RTRIM(PR.INFIRMARY)) NOT IN ('', 'N/A') THEN 'Infirmary'
                            ELSE 'Cash'
                        END AS paymentType,

                        CASE 
                            WHEN PR.LEVEL = 'EMERGENT' THEN 'High'
                            WHEN PR.LEVEL = 'URGENT' THEN 'Medium'
                            WHEN PR.LEVEL = 'NON-URGENT' THEN 'Low'
                            ELSE 'Unassigned' 
                        END AS priority
                        
                    FROM PATIENTREG PR
                    
                    LEFT JOIN UERMMMC.dbo.CASES C ON PR.PATIENTNO = C.PATIENTNO 
                        AND (C.DISCHARGE IN ('N', 'No') OR C.DISCHARGE IS NULL)
                        AND (C.DISCHARGEBY IS NULL OR LTRIM(RTRIM(C.DISCHARGEBY)) = '')

                    LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC ON PR.PATIENTNO = PRC.PATIENTNO
                    
                    WHERE 
                        PR.PATIENTTYPE = 'EMERGENCY'
                    AND (
                        PR.LASTNAME LIKE @search 
                        OR PR.MIDDLENAME LIKE @search
                        OR PR.FIRSTNAME LIKE @search
                        OR PR.PATIENTREGID = @exactId
                        OR (PR.FIRSTNAME + ' ' + PR.LASTNAME) LIKE @search
                        OR (PR.LASTNAME + ' ' + PR.FIRSTNAME) LIKE @search
                        OR (PR.LASTNAME + ', ' + PR.FIRSTNAME) LIKE @search
                    )
                ORDER BY PR.LASTNAME, PR.FIRSTNAME
            `);
                
            return result.recordset;

        } catch (err) {
            console.error("Model Error (searchPatients):", err);
            throw err;
        }
    },

    //populate finance form

    getPatientRecords: async (PATIENTNO) => {
        const pool = await poolPromise; 
        
        const result = await pool.request()
            .input('PATIENTNO', sql.VarChar, PATIENTNO)
            .query(`
                SELECT 
                    C.DATEAD,
                    C.CASENO,
                    C.PATIENT_CATEGORY AS patientCat,
                    C.PATIENTTYPE AS patientType,
                    CASE 
                        WHEN C.LAST_ROOM IS NULL OR LTRIM(RTRIM(C.LAST_ROOM)) = '' 
                        THEN 'N/A'
                        ELSE C.LAST_ROOM
                    END AS room,
                    PHYS.DoctorName AS physician, 
                    CASE 
                        WHEN C.PN = 'Y' THEN 'YES'
                        WHEN C.PN = 'N' THEN 'NO'
                        ELSE ISNULL(C.PN, 'NO') 
                    END AS promissory,
                    CASE 
                        WHEN C.isPay = 1 AND C.Charity = 0 THEN 'PAY'
                        WHEN C.isPay = 0 AND C.Charity = 1 THEN 'SER'
                        ELSE 'N/A' 
                    END AS ward
                FROM 
                    UERMMMC.dbo.CASES C
                OUTER APPLY (
                    SELECT TOP 1 D.NAME AS DoctorName 
                    FROM UERMMMC.dbo.PROFEE P
                    INNER JOIN UERMMMC.dbo.DOCTORS D ON P.DR_CODE = D.CODE
                    WHERE P.CASENO = C.CASENO
                ) PHYS
                WHERE 
                    C.PATIENTNO = @PATIENTNO 
                ORDER BY 
                    C.DATEAD DESC;
                `);
                
            return result.recordset;
    },
    
    //FETCH FOR ADMISSION
    getAdmittedPatients: async () => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request().query(`
            SELECT 
                PR.*, 
                (PR.FIRSTNAME + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + PR.LASTNAME) AS fullName,
                FORMAT(PR.BIRTHDATE, 'yyyy-MM-dd') as birthdateStr,
                PR.SEX as gender, 
                CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE, PR.ADDRESSREGION) AS addressPresent,
                PRC.IS_APPROVED
            FROM PATIENTREG PR

            LEFT JOIN UERMMMC.dbo.PATIENTREG_CREDIT PRC ON PR.PATIENTNO = PRC.PATIENTNO

            WHERE 
                PR.PATIENTTYPE = 'EMERGENCY' 
                AND PR.ISFORADMISSION = '1'
                AND PR.FORREVIEW = '0'
            ORDER BY PR.CREATEDAT DESC 
                        
            `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (getAdmittedPatients):", err);
            throw err;
        }
    },

    searchAdmittedPatients: async (query) => {
        try {
            const pool = await poolPromise; 
            
            const searchPattern = `%${query}%`;
            const exactId = isNaN(query) ? 0 : parseInt(query);

            const result = await pool.request()
                .input('search', sql.NVarChar, searchPattern)
                .input('exactId', sql.Int, exactId)
                .query(`
                    SELECT TOP 10 
                        *,  
                        (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME) AS fullName,
                        FORMAT(BIRTHDATE, 'yyyy-MM-dd') as birthdateStr,
                        SEX as gender, 
                        CONCAT_WS(', ', ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION) AS addressPresent
                    FROM PATIENTREG
                    WHERE 
                        PATIENTTYPE = 'Emergency' 
                        AND ISFORADMISSION = '1'
                        AND (
                            LASTNAME LIKE @search 
                            OR MIDDLENAME LIKE @search
                            OR FIRSTNAME LIKE @search
                            OR PATIENTREGID = @exactId
                            OR (FIRSTNAME + ' ' + LASTNAME) LIKE @search
                            OR (LASTNAME + ' ' + FIRSTNAME) LIKE @search
                            OR (LASTNAME + ', ' + FIRSTNAME) LIKE @search
                        )
                    ORDER BY LASTNAME, FIRSTNAME
                `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (searchAdmittedPatients):", err);
            throw err;
        }
    },
};

module.exports = ErModel;
