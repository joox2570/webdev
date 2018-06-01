var express = require("express");
var HTTP_PORT = process.env.PORT || 8080;
var app = express();
var path = require("path");
var data = require("./data-service.js");

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/employees", function(req, res){
    data.getAllEmployees()
    .then(function(employees) {res.json(employees)})
    .catch(function(rejectMsg) {res.json({message:rejectMsg})});
});

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