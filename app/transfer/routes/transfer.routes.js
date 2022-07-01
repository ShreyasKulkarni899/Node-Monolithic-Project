// routes here for transfer
const transfer = require("../controller/transferController.js");
const transferRouter = require("express").Router();

// Create a new transfer Model
transferRouter.post("/", transfer.create);

// Retrieve all transfer Model
//transferRouter.get("/", transfer.findAll);

// Retrieve a single transfer Model with id
transferRouter.get("/:id", transfer.findOne);

// Update a transfer Model with id
transferRouter.put("/:id", transfer.update);

module.exports = transferRouter;