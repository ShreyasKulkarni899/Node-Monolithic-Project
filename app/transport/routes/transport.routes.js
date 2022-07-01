// routes here for transport
const transport = require("../../transport/controller/transport.controller.js");
const transportRouter = require("express").Router();

// Create a new transport Model
transportRouter.post("/", transport.create);

// Retrieve all transport Model
transportRouter.get("/", transport.findAll);

// Retrieve a single transport Model with id
transportRouter.get("/:id", transport.findOne);

// Update a transport Model with id
transportRouter.put("/:id", transport.update);

// Delete a transport Model with id
transportRouter.delete("/:id", transport.delete);

// Create a new transport Model
transportRouter.delete("/", transport.deleteAll);

module.exports = transportRouter;