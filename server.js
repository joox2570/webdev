/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hyun Jun Joo  Student ID: 125930172  Date: July 24, 2018
*
* Online (Heroku) Link: https://powerful-garden-81674.herokuapp.com/
*
********************************************************************************/

const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
var data = require("./data-service.js");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
var HTTP_PORT = process.env.PORT || 8080;

app.engine('.hbs', exphbs({
    extname: '.hbs',
    helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options){
            if (arguments.length < 3){
                throw new Error("Handlebars Helper equal needs 2 parameters");
            }
            if (lvalue != rvalue){
                return options.inverse(this);
            }
            else{
                return options.fn(this);
            }
        }
    },
    defaultLayout: 'main'
}));

app.set('view engine', '.hbs');

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended : true
}));

app.use(function(req, res, next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/,"");
    next();
});

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
})

app.post("/employees/add", (req, res) => {
    data.addEmployees(req.body);
    res.redirect("/employees");
});

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body);
    res.redirect("/departments");
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body)
    .then(res.redirect("/employees"))
    .catch((err) =>{
        res.status(500).send("Unable to Update Employee");
    });
});

app.post("/department/update", (req, res) => {
    data.updateDepartment(req.body);
    res.redirect("/departments");
});

app.get("/images", function(req, res){
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), function(err, items){
        var images = [];
        images = items;
        res.render("images", {
            data: images
        });
    });
});

app.get("/", function(req, res){
    res.render('home');
});

app.get("/about", function(req, res){
    res.render('about');
});

app.get("/employees/add", function(req, res){
    data.getDepartments()
    .then(function(data){
        res.render('addEmployee', {
            departments: data
        });
    })
    .catch(function(){
        res.render('addEmployee', {
            data: []
        });
    })
});

app.get("/departments/add", function(req, res){
    res.render('addDepartment');
});

app.get("/images/add", function(req, res){
    res.render('addImage');
});

app.get("/employees", function(req, res){
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status)
        .then(function(employees) {
            if(employees.length > 0)
                res.render("employees", {
                    data: employees
                });
            else
                res.render("employees", {
                    message: "no results"
                });
        })
        .catch(function(rejectMsg) {
            res.render("employees", {
                message:rejectMsg
            });
        });
    }
    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department)
        .then(function(employees) {
            if(employees.length > 0)
                res.render("employees", {
                    data: employees
                });
            else
                res.render("employees", {
                    message: "no results"
                });
        })
        .catch(function(rejectMsg) {
            res.render("employees", {
                message:rejectMsg
            });
        });
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager)
        .then(function(employees) {
            if(employees.length > 0)
                res.render("employees", {
                    data: employees
                });
            else
                res.render("employees", {
                    message: "no results"
                });
        })
        .catch(function(rejectMsg) {
            res.render("employees", {
                message:rejectMsg
            });
        });
    }
    else {
        data.getAllEmployees()
        .then(function(employees) {
            if(employees.length > 0)
                res.render("employees", {
                    data: employees
                });
            else
                res.render("employees", {
                    message: "no results"
                });
        })
        .catch(function(rejectMsg) {
            res.render("employees", {
                message:rejectMsg
            });
        });
    }
});

app.get("/employee/:value", function(req,res){
    let viewData = {};

    data.getEmployeeByNum(req.params.value)
    .then(function(employees) {
        if(employees){
            viewData.employee = employees;
        } else{
            viewData.employee = null;
        }
    })
    .catch(function() {
        viewData.employee = null;    
    })
    .then(data.getDepartments)
    .then(function(departments){
        viewData.departments = departments;
        for(let i = 0; i < viewData.departments.length; i++){
            if(viewData.departments[i].departmentId == viewData.employee.department)
                viewData.departments[i].selected = true;
        }
    })
    .catch(function(){
        viewData.departments = [];
    })
    .then(function(){
        if(viewData.employee == null)
            res.status(404).send("Employee Not Found");
        else
            res.render('employee', {
                viewData: viewData
            });
    });
});

app.get("/employees/delete/:value", function(req,res){
    data.deleteEmployeeByNum(req.params.value)
    .then(() => {
        res.redirect('/employees');
    }).catch(() => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

app.get("/departments", function(req,res){
    data.getDepartments()
    .then(function(departments) {
        if(departments.length > 0)
            res.render("departments", {
                data: departments
            });
        else
            res.render("departments", {
                message: "no results"
            });
    })
    .catch(function(rejectMsg) {
        res.render("departments", {
            message:rejectMsg
        });
    });
});

app.get("/department/:value", function(req,res){
    data.getDepartmentById(req.params.value)
    .then(function(departments) {
        if(departments == undefined)
            res.status(404).send("Department Not Found");
        else
            res.render("department", {
                data: departments
            });
        })
    .catch(() => {
        res.status(404).send("Department Not Found");
    });
});

app.get("*", function(req, res){
    res.status(404).send("404 Page Not Found");
});

data.initialize()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(function(rejectMsg){
        console.log(rejectMsg);
    });