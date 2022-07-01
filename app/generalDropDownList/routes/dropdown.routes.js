const dropdownList = require('../controller/dropdown.controller.js');
const dropdownListRouter = require("express").Router();

// Create a new DropDownList
dropdownListRouter.post("/addDropdown", dropdownList.create);

// Retrieve all DropDownList
// dropdownListRouter.get("/", dropdownList.findAll);

// Retrieve a single DropDownList with id
dropdownListRouter.get("/getDropdown", dropdownList.findOne);

// Update a DropDownList with id
dropdownListRouter.put("/updateDropdown/:id", dropdownList.update);

// Delete a DropDownList with id
dropdownListRouter.delete("/deleteDropdown/:id", dropdownList.delete);

// Delete all DropDownList
dropdownListRouter.delete("/deleteAllDropdown", dropdownList.deleteAll);

module.exports = dropdownListRouter;
