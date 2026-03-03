const sqlHelper = require('../config/sqlHelper'); 
const md5 = require('md5'); 

const UserModel = {
    getUser: async (employeeCode) => {
        const query = `
            SELECT 
                E.EmployeeCode,
                E.FirstName,
                E.LastName,
                E.WebPassword,
                CONCAT(E.LastName, ', ', E.FirstName) AS FullName,
                D.description AS Department_Description
            FROM [UE database]..Employee E
            LEFT JOIN [UERMMMC]..SECTIONS D ON E.DeptCode = D.CODE
            WHERE E.EmployeeCode = @EmployeeCode
        `;
        
        const result = await sqlHelper.query(query, { EmployeeCode: employeeCode });
        return result.length > 0 ? result[0] : null;
    },

    matchPassword: (inputPassword, storedHash) => {
        if (inputPassword && storedHash) {
            return md5(inputPassword.trim()) === storedHash.trim();
        }
        return false;
    },

    
};

module.exports = UserModel;