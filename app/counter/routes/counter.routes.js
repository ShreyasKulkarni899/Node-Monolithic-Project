 const counter = require('../controller/counter.controller.js');
 const counterRouter = require("express").Router();

 // Create a new Counter
 counterRouter.post("/addCounter", counter.create);

 // Update a Counter with id
 counterRouter.put("/getNextValue", counter.getNextValue);

 //get the current counter 
 counterRouter.get("/getCurrentValue", counter.getCurrentValue);

 module.exports = counterRouter;