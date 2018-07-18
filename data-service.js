var employees = [];
var departments = [];
const fs = require('fs');

module.exports.initialize = function(){
    return new Promise(function(resolve, reject){
        try{
            fs.readFile('./data/employees.json', function(err, data) {
                if (err) throw err;
                employees = JSON.parse(data);
            });
            fs.readFile('./data/departments.json', (err, data2) => {
                if (err) throw err;
                departments = JSON.parse(data2);
            });
            resolve('Operation Successful');
        } catch (err) {
            reject('Unable to read file');
        }
    });
};

module.exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        try{
            if(employees.length == 0) throw err;
            resolve(employees);
        } catch (err){
            reject('no results returned');
        }
    });
};

module.exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        var emp = [];
        for(var i = 0; i < employees.length; i++){
            if(employees[i].status == status)
                emp.push(employees[i]);
        }
        if(emp.length == 0)
            reject('no results returned');
        else
            resolve(emp);    
    })
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function(resolve, reject){
        var emp = [];
        for(var i = 0; i < employees.length; i++){
            if(employees[i].department == department)
                emp.push(employees[i]);
        }
        if(emp.length == 0)
            reject('no results returned');
        else
            resolve(emp);
    })
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve, reject){
        var emp = [];
        for(var i = 0; i < employees.length; i++){
            if(employees[i].employeeManagerNum == manager)
                emp.push(employees[i]);
        }
        if(emp.length == 0)
            reject('no results returned');
        else
            resolve(emp);
    })
}

module.exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve, reject){
        for(var i = 0; i < employees.length; i++){
            if(employees[i].employeeNum == num)
                resolve(employees[i]);
        }
        reject('no results returned');
    })
}

module.exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        var managers = [];
        for(var i = 0; i < employees.length; i++){
            if(employees[i].isManager == true)
                managers.push(employees[i]);
        }
        if(managers.length == 0)
            reject('no results returned');
        else
            resolve(managers);
    });
};

module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        if(departments.length == 0)
            reject('no results returned');
        else
            resolve(departments);
    });
};

module.exports.addEmployees = function(employeeData){
    return new Promise(function(resolve, reject){
        employees.isManager = undefined ? false : true;
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    });
};

module.exports.updateEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        var found = false;
        for(var i = 0; i < employees.length && !found; i++){
            if(employees[i].employeeNum == employeeData.employeeNum){
                found = true;
                employees[i] = employeeData;
            }
        }
        resolve();
    });
};