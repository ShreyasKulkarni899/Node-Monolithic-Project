const allocations = require("../controllers/allocation.controller.js");
const productIncentive = require("../controllers/productIncentive.controller.js")
const allocationRouter = require("express").Router();
const productIncentiveRouter = require("express").Router();
// Create a new Allocation Model
allocationRouter.post("/", allocations.create);

// Retrieve all Allocation Model
allocationRouter.get("/", allocations.findAll);

// Retrieve a single Allocation Model with id
allocationRouter.get("/:id", allocations.findOne);

// Update a Allocation Model with id
allocationRouter.put("/:id", allocations.update);

// Delete a Allocation Model with id
allocationRouter.delete("/:id", allocations.delete);

// Delete a new Allocation Model
allocationRouter.delete("/", allocations.deleteAll);

// Create a new productIncentive Model
allocationRouter.post("/productIncentive/", productIncentive.create);

// Retrieve all productIncentive Model
allocationRouter.get("/productIncentive/", productIncentive.findAll);

// Retrieve a single productIncentive Model with id
allocationRouter.get("/productIncentive/:id", productIncentive.findOne);

// Update a productIncentive Model with id
allocationRouter.put("/productIncentive/:id", productIncentive.update);



module.exports = allocationRouter;