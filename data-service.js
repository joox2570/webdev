const Sequelize = require('sequelize');

var sequelize = new Sequelize(
    'daldhlt0pojkr6', 
    'udpzinyucsjvns', 
    '45ed7f2bb74f33ac155961652756eaf92f221fbe64fe797ac92c5edd04f6ea44', 
    {
        host:'ec2-54-235-220-220.compute-1.amazonaws.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
            ssl: true
        },
        operatorsAliases: false
    }
);

const Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    martialStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

const Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports.initialize = function(){
    return new Promise(function(resolve, reject){
        sequelize.sync().then(() => {
            resolve();
        }).catch(() => {
            reject("unable to sync the database");
        });
    });
};

module.exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        Employee.findAll()
        .then(function(data){
            resolve(data);
        }).catch (() => {
            reject("no results returned");
        });
    });
};

module.exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                status: status
            }
        }).then(function(data){
            resolve(data);
        }).catch (() => {
            reject("no results returned");
        });
    });
};

module.exports.getEmployeesByDepartment = function(depNum){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                department: depNum
            }
        })
        .then(function(data){
            resolve(data);
        }).catch (() => {
            reject("no results returned");
        });
    });
};

module.exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        })
        .then(function(data){
            resolve(data);
        }).catch (() => {
            reject("no results returned");
        });
    });
};

module.exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
                employeeNum: num
            }
        })
        .then(function(data){
            resolve(data[0]);
        }).catch (() => {
            reject("no results returned");
        });
    });
};

module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        Department.findAll()
        .then(function(data){
            resolve(data);
        }).catch (() => {
            reject("no results returned");
        });
    });
};

module.exports.getDepartmentById = function(id){
    return new Promise(function(resolve, reject){
        Department.findAll({
            where: {
                departmentId: id
            }
        })
        .then(function(data){
            resolve(data[0]);
        }).catch (() => {
            reject("no results returned");
        });
    });
};

module.exports.addEmployees = function(employeeData){
    return new Promise(function(resolve, reject){
        for (x in employeeData){
            if (employeeData[x] == ''){
                employeeData[x] = null;
            }
        }
        employeeData.isManager = (employeeData.isManager) ? true : false;
        Employee.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.martialStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(() => {
            resolve()
        }).catch(() => {
            reject("unable to create employee");
        });
    });
};

module.exports.updateEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        for (x in employeeData){
            if (employeeData[x] == ''){
                employeeData[x] = null;
            }
        }
        employeeData.isManager = (employeeData.isManager) ? true : false;
        Employee.update({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.martialStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }, {
            where: {employeeNum: employeeData.employeeNum}
        }).then(() => {
            resolve()
        }).catch (() => {
            reject("unable to update employee");
        });
    });
};

module.exports.addDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for (x in departmentData){
            if (departmentData[x] == ''){
                departmentData[x] = null;
            }
        }
        Department.create({
            departmentID: departmentData.departmentID,
            departmentName: departmentData.departmentName
        }).then(() => {
            resolve()
        }).catch (() => {
            reject("unable to create department");
        });
    });
};

module.exports.updateDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for (x in departmentData){
            if (departmentData[x] == ''){
                departmentData[x] = null;
            }
        }
        Department.update({
            departmentName: departmentData.departmentName
        }, {
            where: {
                departmentId: departmentData.departmentId
            }
        }).then(() => {
            resolve();
        }).catch(() => {
            reject("unable to update department");
        });
    });
};

module.exports.deleteEmployeeByNum = function(empNum){
    return new Promise(function(resolve, reject){
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(() =>{
            resolve();
        }).catch(() =>{
            reject("unable to delete employee");
        });
    });
};