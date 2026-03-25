const { sql, poolPromise } = require('../config/sqlHelper');

const toDecimal = (val) => (val === "" || val === undefined || val === null) ? null : parseFloat(val);
const toInt = (val) => (val === "" || val === undefined || val === null) ? null : parseInt(val, 10);
const toStr = (val) => (val === "" || val === undefined) ? null : val;

const processBase64 = (base64String) => {
    if (!base64String) return null;
    const cleanString = base64String.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(cleanString, 'base64');
};

const ErModel = {
    
    registerTriage: async (body) => {
        let pool;
        let transaction;

        try {
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
                pwdId: toStr(body.pwdTriage),
                hmo: toStr(body.hmoName),
                infirmary: toStr(body.infirmary),

                personnel: toStr(body.personnelTriage),
                dateAccomplished: body.dateTriage ? new Date(body.dateTriage) : new Date(),

                personnelSignature: body.personnelSignature,
                patientSignature: body.patientSignature
            };

            const pool = await poolPromise; 
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            const request = new sql.Request(transaction);

            request.input('lastName', sql.NVarChar, t.lastName ? t.lastName.toUpperCase() : null)
                .input('firstName', sql.NVarChar, t.firstName ? t.firstName.toUpperCase() : null)
                .input('middleName', sql.NVarChar, t.middleName ? t.middleName.toUpperCase() : null)
                .input('suffix', sql.NVarChar, t.suffix ? t.suffix.toUpperCase() : null)
                .input('birthdate', sql.VarChar, t.birthdate) 
                .input('age', sql.Int, t.age)
                .input('gender', sql.NVarChar, t.gender ? t.gender.toUpperCase() : null)
                .input('civilStatus', sql.NVarChar, t.civilStatus ? t.civilStatus.toUpperCase() : null)
                .input('infirmary', sql.NVarChar, t.infirmary ? t.infirmary.toUpperCase() : null)
                .input('patientType', sql.NVarChar, t.patientType ? t.patientType.toUpperCase() : null)
                .input('chiefComplaint', sql.NVarChar, t.chiefComplaint ? t.chiefComplaint.toUpperCase() : null)
                .input('temp', sql.Decimal(5, 2), t.temp)
                .input('heartRate', sql.Int, t.heartRate)
                .input('oxygen', sql.Decimal(5, 2), t.oxygen)
                .input('bp', sql.NVarChar, t.bp ? t.bp.toUpperCase() : null)
                .input('respiRate', sql.Int, t.respiRate)
                .input('painScore', sql.Int, t.painScore)
                .input('avpu', sql.NVarChar, t.avpu ? t.avpu.toUpperCase() : null)
                .input('contagious', sql.NVarChar, t.contagious ? t.contagious.toUpperCase() : null)
                .input('isolation', sql.NVarChar, t.isolation ? t.isolation.toUpperCase() : null)
                .input('cpd', sql.NVarChar, t.cpd ? t.cpd.toUpperCase() : null)
                .input('level', sql.NVarChar, t.level ? t.level.toUpperCase() : null)
                .input('remarks', sql.NVarChar, t.remarks ? t.remarks.toUpperCase() : null)
                .input('checkforPresense', sql.NVarChar, t.checkforPresense ? t.checkforPresense.toUpperCase() : null)
                .input('cpName', sql.NVarChar, t.contactPerson ? t.contactPerson.toUpperCase() : null)
                .input('cpAddress', sql.NVarChar, t.contactAddress ? t.contactAddress.toUpperCase() : null)
                .input('cpMobile', sql.NVarChar, t.contactNumber ? t.contactNumber.toUpperCase() : null)
                .input('hmo', sql.NVarChar, t.hmo ? t.hmo.toUpperCase() : null)
                .input('seniorId', sql.NVarChar, t.seniorId ? t.seniorId.toUpperCase() : null)
                .input('pwdId', sql.NVarChar, t.pwdId ? t.pwdId.toUpperCase() : null)
                .input('personnel', sql.NVarChar, t.personnel ? t.personnel.toUpperCase() : null)
                .input('dateAccomplished', sql.Date, t.dateAccomplished)

            const result = await request.query(`
                INSERT INTO PATIENTREG (
                    LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX, BIRTHDATE, AGE, SEX, 
                    CIVILSTATUS, INFIRMARY,
                    PATIENTTYPE, CHIEFCOMPLAINT, TEMP, HEARTRATE, OXYGEN, BP, RESPIRATE, PAINSCORE,
                    AVPU, CONTAGIOUS, ISOLATION, CPD, LEVEL, REMARKS, SYMPTOMS,
                    CPNAME, CPADDRESS, CPMOBILE, HMO, SENIORID, PWD,
                    PERSONNEL, DATEACCOMPLISHED, CREATEDAT
                )
                OUTPUT INSERTED.ID
                VALUES (
                    @lastName, @firstName, @middleName, @suffix, @birthdate, @age, @gender, 
                    @civilStatus, @infirmary,
                    @patientType, @chiefComplaint, @temp, @heartRate, @oxygen, @bp, @respiRate, @painScore,
                    @avpu, @contagious, @isolation, @cpd, @level, @remarks, @checkforPresense,
                    @cpName, @cpAddress, @cpMobile, @hmo, @seniorId, @pwdId,
                    @personnel, @dateAccomplished, GETDATE()
                )
            `);

            const patientId = result.recordset[0]?.ID;

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
                    INSERT INTO PATIENTREG_PTSIGNATURE (ID, SIGNATURE, CREATED) 
                    VALUES (@pId, @signData, GETDATE())
                `);
            }

            await transaction.commit();
            return patientId;

        } catch (err) {
            if (transaction) {
                try { await transaction.rollback(); } catch (e) { console.error("Rollback failed", e); }
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
                IF EXISTS (SELECT 1 FROM PATIENTREG WHERE ID = @patientId)
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
                        PATIENTTYPE = 'Emergency'
                    OUTPUT inserted.ID, inserted.PATIENTNO
                    WHERE ID = @patientId
                END
                ELSE
                BEGIN
                    INSERT INTO PATIENTREG (
                        PATIENTNO, 
                        LASTNAME, FIRSTNAME, MIDDLENAME, SUFFIX, BIRTHDATE, AGE, SEX,
                        WEIGHT, BROUGHTBY, PHILHEALTHCATEG, PTCONDITION,
                        CHIEFCOMPLAINT, TEMP, HEARTRATE, OXYGEN, BP, RESPIRATE, PAINSCORE,
                        AVPU, CONTAGIOUS, ISOLATION, CPD, LEVEL, REMARKS, SYMPTOMS,
                        PERSONNEL, DATEACCOMPLISHED, PATIENTTYPE
                    )
                    OUTPUT inserted.ID, inserted.PATIENTNO
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

            const dbPatientPk = result.recordset[0].ID; 
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
                            ID = @pId 
                        WHERE PATIENTNO = @pNo
                    END
                    ELSE
                    BEGIN
                        INSERT INTO PATIENTREG_TPSIGNATURE (ID, PATIENTNO, TPSIGNATURE, NAME) 
                        VALUES (@pId, @pNo, @signData, @personnelName)
                    END
                `);
            }

            await transaction.commit();

            return { 
                PATIENTNO: dbPatientNo,
                ID: dbPatientPk
            };

        } catch (err) {
            if (transaction) {
                try { await transaction.rollback(); } catch (e) { console.error("Rollback failed", e); }
            }
            throw err; 
        }
    },

    generateCaseNumber: async (data) => {
        try {
            const pool = await sql.connect(); 
            const request = pool.request();

            const generateCaseQuery = `
                DECLARE @tmpVal VARCHAR(8);
                
                IF (SELECT MAX(CONVERT(INT,LEFT(RTRIM(CASENO),7))) + 1  FROM [UERMMMC]..[CASES] WITH(NOLOCK) WHERE RIGHT(CASENO, 1) = 'B') IS NULL
                BEGIN
                    SELECT '0000001B' AS 'NewCaseNo'
                END
                ELSE
                BEGIN
                    SET @tmpVal = (SELECT CONVERT(VARCHAR(8), (MAX(CONVERT(INT, LEFT(RTRIM(caseno),7))) + 1)) FROM [UERMMMC]..[CASES] WITH(NOLOCK) 
                        WHERE RIGHT(RTRIM(CASENO), 1) = 'B')
                    SELECT REPLICATE('0', 7-LEN(@tmpVal)) + CONVERT(VARCHAR, @tmpVal) + 'B' AS 'NewCaseNo'
                END
            `;

            const caseResult = await request.query(generateCaseQuery);
            
            const newCaseNo = caseResult.recordset[0].NewCaseNo;

            request.input('caseNo', sql.VarChar, newCaseNo);
            request.input('patientNo', sql.VarChar, data.casepatientno);
            request.input('caseAge', sql.Int, data.caseAge || 0);
            request.input('casedtAdmission', sql.VarChar, data.casedtAdmission);
            request.input('casepwdId', sql.VarChar, data.casepwdId || '');
            request.input('caseSeniorId', sql.VarChar, data.caseSeniorId || '');
            
            request.input('chiefComplaintTriage', sql.VarChar, data.chiefComplaintTriage || '');
            request.input('caseadmDiagnosis', sql.VarChar, data.caseadmDiagnosis || '');
            request.input('casefromER', sql.VarChar, data.casefromER || '');
            request.input('caseserviceType', sql.VarChar, data.caseserviceType || '');
            request.input('caseAllergies', sql.VarChar, data.caseAllergies || '');
            request.input('caseerPhysician', sql.VarChar, data.caseerPhysician || '');
            
            request.input('caseCensusInfirmary', sql.VarChar, data.caseCensusInfirmary || '');
            request.input('caseDepartment', sql.VarChar, data.caseDepartment || '');
            request.input('caseAdmittedBy', sql.VarChar, data.caseAdmittedBy || '');
            request.input('casepdfRemarks', sql.VarChar, data.casepdfRemarks || '');
            request.input('caseRemarks', sql.VarChar, data.caseRemarks || '');
            
            request.input('COMPANY_CODE', sql.VarChar, data.caseCompany || '');
            request.input('HMOCODE', sql.VarChar, data.caseHmo || '');
            request.input('employer', sql.VarChar, data.caseEmployer || '');
            request.input('card_No', sql.VarChar, data.caseCardNo || '');
            request.input('creditlimit', sql.VarChar, data.casecovAmount || '0.00');
            request.input('approvalCode', sql.VarChar, data.caseappCode || '');
            request.input('effectivity', sql.VarChar, data.caseEffectivity || '');
            request.input('roomplan', sql.VarChar, data.casermPlan || '');
            request.input('HMO_LOA', sql.VarChar, data.caseLoa || '');
            request.input('HMO_APPROVALNO', sql.VarChar, data.caseApprov || '');
            
            request.input('inf_Name', sql.VarChar, data.caseInformantName || '');
            request.input('inf_Add', sql.VarChar, data.caseInfAddress || '');
            request.input('inf_Rel', sql.VarChar, data.caseInfRelationship?.value || data.caseInfRelationship || '');

            const insertQuery = `
                INSERT INTO [UERMMMC]..[CASES] (
                    CASENO, PATIENTNO, PATIENT_CATEGORY, PATIENTTYPE, DATEAD, CC, TYPE_OF_ADMISSION, DEPTID, PHIC_CODE, DocPresentedOn, WATCHERSID, PWD_IDNo, FROM_ER
                    , IsConfidential, INDIGENT, isPay, Charity, VIP, IsSenior, isNEWBORN_NONPATHOLOGIC, UDF_IsPWD, MEDICAL_SOCIAL_SERVICE, CATEGORY, COMPANY_CODE, HMO_CODE, EMPLOYER, CARD_NO, EFFECTIVITY, CREDITLIMIT
                    , UDF_APPROVALCODE, ROOM_PLAN, PERSON_RES_ACCT, ADDRESS_PERSON_RES, RELTOPAT, CONTACTNOS_PERSON_RES, EMAILADD_PERSON_RES, EMPLOYER_PERSON_RES, EMPLOYERADD_PERSON_RES,EMPLOYERCONTACTNOS_PERSON_RES
                    , UDF_PERSON_RES_ACCT2, UDF_ADDRESS_PERSON_RES2, UDF_RELTOPAT2, UDF_CONTACTNOS_PERSON_RES2, UDF_EMAILADD_PERSON_RES2, UDF_EMPLOYER_PERSON_RES2, UDF_EMPLOYERADD_PERSON_RES2, UDF_EMPLOYERCONTACTNOS_PERSON_RES2
                    , Informant, InformantAddRESS, Informantrelation, UERM_STUD_EMPLOYEE, DEPT_CODE, UDF_REMARKS, UDF_CaseDept, ADMITTED_BY, UDF_DATEADDED, AR_ACCT, Username, DISC_CODE, DISC_CODE1, COMPANY2, HMO2, AGE, EMPADDRESS
                    , ADMITTED_PER, MEDICAL_COORDINATOR, CERTIFICATE_NO, AGREEMENT_NO, ORIGINAL_EFFECTIVITY_DATE, REFERRINGMRMS, PATRON, CHARGETO, CLINICALIM, DISCHARGEBY, MED_CASE_NO, PREV_ADMISSION_DATE, PREV_ADMISSION_DIAGNOSIS
                    , Refuse_Reason, Refuse_Admission, LAST_BILLING_ACCESSED_BY, FOR_PHIC_DED_REMARKS, DISPOSITION, SUSPENDEDBY, PROCESSEDBY, PROCEDUREDONEINER, NEXTSKED, FOR_PROMI_REMARKS, PLATE_NO, EMP_DEPENDENT, EMP_RELATION
                    , MANNER_OF_ENTERING, CONDITION_OF_ADM, DISC2_REMARKS, TRACKINGNO, VERIFIEDBY, CC2, INF_DIAG, SOCIALSERVICERemarks, CREDIT_LIMIT, TYPECASE, IPDCaseNo
                    , LAST_ROOM, ROOM_RATE, UDF_AppVersion, UDF_PreviousBal, isExcemptedFromCloseAcct, UDF_CaseLink, UDF_isChild, hmo_transloa, hmo_transapp, EmpCode
                )
                SELECT
                    CASENO              = ISNULL(@caseNo, '') 
                    , PATIENTNO          = @patientNo
                    , PATIENT_CATEGORY  = ''
                    , PATIENTTYPE       = 'OPD'
                    , DATEAD            = @casedtAdmission
                    , CC                = @chiefComplaintTriage
                    , TYPE_OF_ADMISSION = 'FER'
                    , DEPTID            = ''
                    , PHIC_CODE         = ''
                    , DocPresentedOn    = ''
                    , WATCHERSID        = ''
                    , PWD_IDNo          = @casepwdId
                    , FROM_ER           = ''
                    , ISCONFIDENTIAL    = ''
                    , INDIGENT          = ''
                    , IS_PAY            = ''
                    , CHARITY           = ''
                    , VIP               = ''
                    , ISSENIOR          = CASE WHEN NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.SCIDNO FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NOT NULL THEN 1 ELSE 0 END
                    , ISNEWBORN_NONPATHOLOGIC = 0
                    , UDF_ISPWD         = CASE WHEN NULLIF(LTRIM(RTRIM(ISNULL((SELECT A.PWD_IDNo FROM [UERMMMC]..[PATIENTINFO] A WITH(NOLOCK) WHERE A.PATIENTNO = @patientNo), ''))), '') IS NOT NULL THEN 1 ELSE 0 END
                    , MEDICAL_SOCIAL_SERVICE  = 'D'        
                    , CATEGORY          = CASE WHEN LEFT(RIGHT(ISNULL(@caseNo, ''), 2), 1) = 'N' THEN 'NEWBORN' ELSE '' END
                    , COMPANY_CODE      = @COMPANY_CODE
                    , HMO_CODE           = @HMOCODE
                    , EMPLOYER          = ISNULL(@employer, '')
                    , CARD_NO           = ISNULL(@card_No, '')
                    , EFFECTIVITY       = CASE WHEN ISNULL(@effectivity, '') = '' THEN CONVERT(VARCHAR(20), CAST(GETDATE() AS DATETIME), 101) ELSE CONVERT(VARCHAR(20), CAST(@effectivity AS DATETIME), 101) END
                    , CREDITLIMIT       = CAST(CASE WHEN ISNULL(@creditlimit, '') = '' THEN 0 ELSE cast(@creditlimit as decimal(18,2)) END AS DECIMAL(18,2))
                    , UDF_APPROVALCODE  = ISNULL(@approvalCode, '')
                    , ROOM_PLAN         = ISNULL(@roomplan, '')
                    , PERSON_RES_ACCT   = ''
                    , ADDRESS_PERSON_RES= ''
                    , RELTOPAT          = ''
                    , CONTACTNOS_PERSON_RES= ''
                    , EMAILADD_PERSON_RES= ''
                    , EMPLOYER_PERSON_RES= ''
                    , EMPLOYERADD_PERSON_RES= ''
                    , EMPLOYERCONTACTNOS_PERSON_RES= ''
                    , UDF_PERSON_RES_ACCT2= ''
                    , UDF_ADDRESS_PERSON_RES2= ''
                    , UDF_RELTOPAT2     = ''
                    , UDF_CONTACTNOS_PERSON_RES2= ''
                    , UDF_EMAILADD_PERSON_RES2= ''
                    , UDF_EMPLOYER_PERSON_RES2= ''
                    , UDF_EMPLOYERADD_PERSON_RES2= ''
                    , UDF_EMPLOYERCONTACTNOS_PERSON_RES2= ''
                    , Informant         = ISNULL(@inf_Name, '')
                    , InformantAddRESS  = ISNULL(@inf_Add, '')
                    , Informantrelation = ISNULL(@inf_Rel, '')                          
                    , UERM_STUD_EMPLOYEE= @caseCensusInfirmary
                    , DEPT_CODE         = ''
                    , UDF_REMARKS       = @caseRemarks
                    , UDF_CaseDept      = @caseDepartment
                    , ADMITTED_BY       = @caseAdmittedBy
                    , UDF_DATEADDED     = GETDATE()
                    , AR_ACCT           = ''
                    , Username          = '' 
                    , DISC_CODE         = '' 
                    , DISC_CODE1        = 'N/A'
                    , COMPANY2          = 'N/A'
                    , HMO2              = 'N/A'
                    , AGE               = @caseAge
                    , EMPADDRESS        = ''
                    , ADMITTED_PER      = ''
                    , MEDICAL_COORDINATOR= ''
                    , CERTIFICATE_NO    = ''
                    , AGREEMENT_NO      = ''
                    , ORIGINAL_EFFECTIVITY_DATE= ''
                    , REFERRINGMRMS     = ''
                    , PATRON            = ''
                    , CHARGETO          = ''
                    , CLINICALIM        = ''
                    , DISCHARGEBY       = ''
                    , MED_CASE_NO       = ''
                    , PREV_ADMISSION_DATE= ''
                    , PREV_ADMISSION_DIAGNOSIS= ''
                    , Refuse_Reason     = ''
                    , Refuse_Admission  = ''
                    , LAST_BILLING_ACCESSED_BY= ''
                    , FOR_PHIC_DED_REMARKS= ''
                    , DISPOSITION       = ''
                    , SUSPENDEDBY       = ''
                    , PROCESSEDBY       = ''
                    , PROCEDUREDONEINER = ''
                    , NEXTSKED          = ''    
                    , FOR_PROMI_REMARKS = ''
                    , PLATE_NO          = ''
                    , EMP_DEPENDENT     = ''
                    , EMP_RELATION      = ''
                    , MANNER_OF_ENTERING= ''
                    , CONDITION_OF_ADM  = ''
                    , DISC2_REMARKS     = ''
                    , TRACKINGNO        = ''
                    , VERIFIEDBY        = ''
                    , CC2               = ''
                    , INF_DIAG          = ''
                    , SOCIALSERVICERemarks= ''
                    , CREDIT_LIMIT      = 0
                    , TYPECASE          = ''
                    , IPDCaseNo         = ''
                    , LAST_ROOM         = ''
                    , ROOM_RATE         = 0.00
                    , UDF_AppVersion    = NULL
                    , UDF_PreviousBal   = 0.00
                    , isExcemptedFromCloseAcct = CASE WHEN @caseDepartment = 'ER' THEN 1 ELSE 0 END
                    , UDF_CaseLink      = CASE WHEN LEFT(RIGHT(ISNULL(@caseNo, ''), 2), 1) = 'N' THEN LEFT(ISNULL(@caseNo,''), LEN(ISNULL(@caseNo,''))-2) END
                    , UDF_isChild       = CASE WHEN LEFT(RIGHT(ISNULL(@caseNo, ''), 2), 1) = 'N' THEN 1 ELSE 0 END
                    , hmo_transloa      = @HMO_LOA
                    , hmo_transapp      = @HMO_APPROVALNO
                    , EmpCode           = '';
            `;

            await request.query(insertQuery);

            return {
                patient_no: data.casepatientno,
                patient_id: data.patientId,
                case_no: newCaseNo
            };

        } catch (error) {
            console.error("Database Insert Error:", error);
            throw error;
        }
    },

    admitPatient: async (patientId) => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request()
                .input('pId', sql.Int, patientId)
                .query(`
                    UPDATE PATIENTREG 
                    SET ISADMITTED = 0 
                    WHERE ID = @pId
                `);

            return result.rowsAffected[0];

        } catch (err) {
            console.error("Model Error (admitPatient):", err);
            throw err;
        }
    },

    //GET ER LIST
    getAllErPatients: async () => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request().query(`
            SELECT 
                    PR.*,  
                    
                    (PR.FIRSTNAME + ' ' + ISNULL(PR.MIDDLENAME + ' ', '') + PR.LASTNAME) AS fullName,
                    FORMAT(PR.BIRTHDATE, 'yyyy-MM-dd') as birthdateStr,
                    PR.SEX as gender, 
                    CONCAT_WS(', ', PR.ADDRESSSTREET, PR.ADDRESSBARANGAY, PR.ADDRESSCITY, PR.ADDRESSPROVINCE, PR.ADDRESSREGION) AS addressPresent,

                    C.DATEDIS,
                    C.DISCHARGE,
                    C.DISCHARGEBY

                FROM PATIENTREG PR
                
                LEFT JOIN UERMMMC.dbo.CASES C ON PR.PATIENTNO = C.PATIENTNO

                WHERE 
                    PR.PATIENTTYPE = 'Emergency' 
                    AND (PR.ISADMITTED IS NULL OR PR.ISADMITTED = 0)
                    
                    AND (
                        C.DISCHARGE IN ('N', 'No')       
                        OR C.DISCHARGE IS NULL     
                    )
                    AND (
                        C.DISCHARGEBY IS NULL            
                        OR LTRIM(RTRIM(C.DISCHARGEBY)) = ''  
                    )
                ORDER BY PR.CREATEDAT DESC
            `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (getAllErPatients):", err);
            throw err;
        }
    },

    //populate finance form
    fetchErPatientsForFinance: async () => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request().query(`
            WITH LatestERCase AS (
                SELECT 
                    *,
                    ROW_NUMBER() OVER(PARTITION BY PATIENTNO ORDER BY DATEAD DESC) as RowNum
                FROM UERMMMC.dbo.CASES
                WHERE UDF_CaseDept = 'ER'
                    AND PATIENTTYPE = 'OPD'
                    AND ForAdmission = 1
            )
            
            SELECT
                C.CASENO,
                C.PATIENTNO, 
                C.DATEAD, 
                C.PATIENT_CATEGORY,
                C.PATIENTTYPE AS patientType,
                C.CC AS chiefComplaint, 
                C.LAST_ROOM,
                PI.SEX AS gender,
                PI.AGE AS age, 
                PI.UDF_PHILHEALTHNO AS philhealthNo,
                PI.ADDRESS AS address,
                SS.Classification AS ssClass,
                SS.Validity AS expiration,
                PR.ISRETURNING AS visitType,
                (ISNULL(PI.FIRSTNAME, '') + ' ' + ISNULL(PI.MIDDLENAME + ' ', '') + ISNULL(PI.LASTNAME, '')) AS fullName,
                FORMAT(PI.DBIRTH, 'yyyy-MM-dd') AS birthdateStr,
                R.TYPE_CODE AS typeCode,

                (
                    SELECT COUNT(SS_SUB.id) 
                    FROM UERMHIMS.dbo.SocialServiceClass SS_SUB
                    INNER JOIN UERMMMC.dbo.CASES C_SUB 
                        ON SS_SUB.CaseNo = C_SUB.CASENO
                    INNER JOIN UERMMMC.dbo.ROOMS R_SUB 
                        ON C_SUB.LAST_ROOM = R_SUB.ROOMNO
                    WHERE SS_SUB.PatientNo = C.PATIENTNO
                    AND R_SUB.TYPE_CODE = 'SER'
                    AND SS_SUB.Classification = 'R' 
                ) AS ssEntryCount

            FROM LatestERCase C  
            LEFT JOIN UERMMMC.dbo.PATIENTINFO PI 
                ON C.PATIENTNO = PI.PATIENTNO
            OUTER APPLY (
                SELECT TOP 1 Classification, Validity 
                FROM UERMHIMS.dbo.SocialServiceClass 
                -- LTRIM and RTRIM destroy invisible spaces on both sides!
                WHERE LTRIM(RTRIM(PatientNo)) = LTRIM(RTRIM(C.PATIENTNO))
                ORDER BY id DESC 
            ) SS
            LEFT JOIN UERMMMC.dbo.PATIENTREG PR 
                ON PI.PATIENTNO = PR.PATIENTNO
            LEFT JOIN UERMMMC.dbo.ROOMS R 
                ON C.LAST_ROOM = R.ROOMNO   
            WHERE C.RowNum = 1   
            ORDER BY C.DATEAD DESC
                `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (fetchErPatientsForFinance):", err);
            throw err;
        }
    },

    getAdmittedPatients: async () => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request().query(`
                SELECT 
                    *,  
                    (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME) AS fullName,
                    FORMAT(BIRTHDATE, 'yyyy-MM-dd') as birthdateStr,
                    SEX as gender, 
                    CONCAT_WS(', ', ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION) AS addressPresent
                FROM PATIENTREG
                WHERE 
                    PATIENTTYPE = 'Emergency' 
                    AND ISADMITTED = '0'
                ORDER BY CREATEDAT DESC
                
            `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (getAdmittedPatients):", err);
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
                    SELECT TOP 20 
                        *, 
                        (FIRSTNAME + ' ' + ISNULL(MIDDLENAME + ' ', '') + LASTNAME) AS fullName,                    
                        SEX as gender, 
                        CONCAT_WS(', ', ADDRESSSTREET, ADDRESSBARANGAY, ADDRESSCITY, ADDRESSPROVINCE, ADDRESSREGION) AS addressPresent
                    FROM PATIENTREG
                    WHERE 
                        PATIENTTYPE = 'Emergency' 
                        AND ISADMITTED IN (0, 1)  
                        AND (
                            LASTNAME LIKE @search 
                            OR FIRSTNAME LIKE @search
                            OR ID = @exactId
                            
                            OR (FIRSTNAME + ' ' + LASTNAME) LIKE @search
                            
                            OR (LASTNAME + ' ' + FIRSTNAME) LIKE @search
                            
                            OR (LASTNAME + ', ' + FIRSTNAME) LIKE @search
                        )
                    ORDER BY LASTNAME, FIRSTNAME
                `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (searchPatients):", err);
            throw err;
        }
    }

};

module.exports = ErModel;