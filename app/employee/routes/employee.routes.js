const employee = require("../../employee/controllers/employee.controller");
const employeeRouter = require("express").Router();

// Create a new  Employee Model
employeeRouter.post("/", employee.create);

// Retrieve all  Employee Model
employeeRouter.get("/", employee.findAll);

// Retrieve a single Employee Model with id
employeeRouter.get("/:id", employee.findOne);

// Update a  Employee Model with id
employeeRouter.put("/:id", employee.update);

// Delete a Employee Model with id
employeeRouter.delete("/:id", employee.delete);

// Delete a new Employee Model
employeeRouter.delete("/", employee.deleteAll);

module.exports = employeeRouter;
