/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hyun Jun Joo  Student ID: 125930172  Date: June 1, 2018
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

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));

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
})

app.get("/images", function(req, res){
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), function(err, items){
        var images = [];
        images = items;
        res.json({"images" : images});
    });
});

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/employees/add", function(req, res){
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.get("/images/add", function(req, res){
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.get("/employees", function(req, res){
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status)
        .then(function(employees) {res.json(employees)})
        .catch(function(rejectMsg) {res.json({message:rejectMsg})});
    }
    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department)
        .then(function(employees) {res.json(employees)})
        .catch(function(rejectMsg) {res.json({message:rejectMsg})});
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager)
        .then(function(employees) {res.json(employees)})
        .catch(function(rejectMsg) {res.json({message:rejectMsg})});
    }
    else {
        data.getAllEmployees()
        .then(function(employees) {res.json(employees)})
        .catch(function(rejectMsg) {res.json({message:rejectMsg})});
    }
});

app.get("/employee/:value", function(req,res){
    data.getEmployeeByNum(req.params.value)
    .then(function(employees) {res.json(employees)})
    .catch(function(rejectMsg) {res.json({message:rejectMsg})});
})

app.get("/managers", function(req, res){
    data.getManagers()
    .then(function(employees) {res.json(employees)})
    .catch(function(rejectMsg) {res.json({message:rejectMsg})});
});

app.get("/departments", function(req,res){
    data.getDepartments()
    .then(function(departments) {res.json(departments)})
    .catch(function(rejectMsg) {res.json({message:rejectMsg})});
});

app.get("*", function(req, res){
    res.status(404).send("404 Page Not Found");
});

data.initialize()
.then(() => {app.listen(HTTP_PORT, onHttpStart)})
.catch(function(rejectMsg){
    console.log(rejectMsg);
});