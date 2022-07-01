const supplier = require("../controllers/supplier.controller.js");
const supplierRouter = require("express").Router();

// Create a new Supplier
supplierRouter.post("/", supplier.create);

// Retrieve all supplier
supplierRouter.get("/", supplier.findAll);

// Retrieve a single Supplier with id
supplierRouter.get("/filter", supplier.findOne);

// Update a Supplier with id
supplierRouter.put("/:id", supplier.update);

// Delete a Supplier with id
supplierRouter.delete("/:id", supplier.delete);

// Delete all Supplier
supplierRouter.delete("/", supplier.deleteAll);

module.exports = supplierRouter;