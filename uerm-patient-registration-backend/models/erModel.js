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
                hmo: toStr(body.hmoName),
                infirmary: toStr(body.infirmary),

                personnel: toStr(body.personnelTriage),
                dateAccomplished: body.dateTriage ? new Date(body.dateTriage) : new Date(),
                isAdmitted: 0,

                personnelSignature: body.personnelSignature,
                patientSignature: body.patientSignature
            };

            const pool = await poolPromise; 
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            const request = new sql.Request(transaction);

            request.input('lastName', sql.NVarChar, t.lastName)
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
                    cpName, cpAddress, cpMobile, hmo, seniorId, 
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
            // 1. Prepare Data
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

            // 2. Get Shared Connection
            const pool = await poolPromise;
            transaction = new sql.Transaction(pool);
            await transaction.begin();

            const request = new sql.Request(transaction); 

            // 3. Bind Inputs
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

            // 4. Execute Main Query (Upsert Logic)
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

            // 5. Handle Signature
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
                            patient_id = @pId 
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

            return { 
                patient_no: dbPatientNo,
                patient_id: dbPatientPk
            };

        } catch (err) {
            if (transaction) {
                try { await transaction.rollback(); } catch (e) { console.error("Rollback failed", e); }
            }
            throw err; 
        }
    },

    admitPatient: async (patientId) => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request()
                .input('pId', sql.Int, patientId)
                .query(`
                    UPDATE PatientRegistration 
                    SET isAdmitted = 1 
                    WHERE patient_id = @pId
                `);

            return result.rowsAffected[0];

        } catch (err) {
            console.error("Model Error (admitPatient):", err);
            throw err;
        }
    },

    getAllErPatients: async () => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request().query(`
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

            return result.recordset;

        } catch (err) {
            console.error("Model Error (getAllErPatients):", err);
            throw err;
        }
    },

    getPatientsForReview: async () => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request().query(`
                SELECT 
                    *,  
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdateStr,
                    sex as gender, 
                    CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent
                FROM PatientRegistration
                WHERE 
                    (forReview = 1 OR forReview = 0)
                ORDER BY createdAt DESC
            `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (getPatientsForReview):", err);
            throw err;
        }
    },

    getAdmittedPatients: async () => {
        try {
            const pool = await poolPromise; 
            
            const result = await pool.request().query(`
                SELECT 
                    *,  
                    (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,
                    FORMAT(birthdate, 'yyyy-MM-dd') as birthdateStr,
                    sex as gender, 
                    CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent
                FROM PatientRegistration
                WHERE 
                    patientType = 'Emergency' 
                    AND isAdmitted = '1'
                ORDER BY createdAt DESC
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
                        (firstName + ' ' + ISNULL(middleName + ' ', '') + lastName) AS fullName,                    
                        sex as gender, 
                        CONCAT_WS(', ', addressStreet, addressBarangay, addressCity, addressProvince, addressRegion) AS addressPresent
                    FROM PatientRegistration
                    WHERE 
                        patientType = 'Emergency' 
                        AND isAdmitted IN (0, 1)  
                        AND (
                            lastName LIKE @search 
                            OR firstName LIKE @search
                            OR patient_id = @exactId
                            
                            OR (firstName + ' ' + lastName) LIKE @search
                            
                            OR (lastName + ' ' + firstName) LIKE @search
                            
                            OR (lastName + ', ' + firstName) LIKE @search
                        )
                    ORDER BY lastName, firstName
                `);

            return result.recordset;

        } catch (err) {
            console.error("Model Error (searchPatients):", err);
            throw err;
        }
    }

};

module.exports = ErModel;