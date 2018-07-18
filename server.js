/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hyun Jun Joo  Student ID: 125930172  Date: June 22, 2018
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
    defaultLayout: 'main'}));
app.set('view engine', '.hbs');

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
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

const upload = multer({storage: storage});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
})

app.post("/employees/add", (req, res) => {
    data.addEmployees(req.body);
    res.redirect("/employees");
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body)
    .then(res.redirect("/employees"));
});

app.get("/images", function(req, res){
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), function(err, items){
        var images = [];
        images = items;
        res.render("images", {data: images});
    });
});

app.get("/", function(req, res){
    res.render('home');
});

app.get("/about", function(req, res){
    res.render('about');
});

app.get("/employees/add", function(req, res){
    res.render('addEmployee');
});

app.get("/images/add", function(req, res){
    res.render('addImage');
});

app.get("/employees", function(req, res){
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status)
        .then(function(employees) {res.render("employees", {data: employees})})
        .catch(function(rejectMsg) {res.render("employees", {message:rejectMsg})});
    }
    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department)
        .then(function(employees) {res.render("employees", {data: employees})})
        .catch(function(rejectMsg) {res.render("employees", {message:rejectMsg})});
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager)
        .then(function(employees) {res.render("employees", {data: employees})})
        .catch(function(rejectMsg) {res.render("employees", {message:rejectMsg})});
    }
    else {
        data.getAllEmployees()
        .then(function(employees) {res.render("employees", {data: employees})})
        .catch(function(rejectMsg) {res.render("employees", {message:rejectMsg})});
    }
});

app.get("/employee/:value", function(req,res){
    data.getEmployeeByNum(req.params.value)
    .then(function(employees) {res.render("employee", {employee: employees})})
    .catch(function(rejectMsg) {res.render("employee", {message: rejectMsg})});
});

app.get("/departments", function(req,res){
    data.getDepartments()
    .then(function(data) {res.render("departments", {department: data})})
    .catch(function(rejectMsg) {res.render("departments", {message:rejectMsg})});
});

app.get("*", function(req, res){
    res.status(404).send("404 Page Not Found");
});

data.initialize()
.then(() => {app.listen(HTTP_PORT, onHttpStart)})
.catch(function(rejectMsg){
    console.log(rejectMsg);
});