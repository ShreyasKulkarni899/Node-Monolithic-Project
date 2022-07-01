const store = require("../controller/store.controller.js");
const storeRouter = require("express").Router();

// Create a new Supplier
storeRouter.post("/", store.create);

// Retrieve all supplier
storeRouter.get("/", store.findAll);

// Retrieve a single Supplier with id
storeRouter.get("/:id", store.findOne);

// Update a Supplier with id
storeRouter.put("/:id", store.update);

// Delete a Supplier with id
storeRouter.delete("/:id", store.delete);

// Delete all Supplier
storeRouter.delete("/", store.deleteAll);

module.exports = storeRouter;
