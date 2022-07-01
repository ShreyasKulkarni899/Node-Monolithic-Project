const dummyProductRouter = require("express").Router();
const dummyProduct = require("../controller/dummyProduct.controller.js");

// Create a new Parcel
dummyProductRouter.post("/", dummyProduct.create);


// find all product
dummyProductRouter.get("/", dummyProduct.findAll);

// find all product
dummyProductRouter.post("/search", dummyProduct.search);

// find product by id
dummyProductRouter.get("/:id", dummyProduct.findOne);

// find product by unwind
// dummyProductRouter.get("/getDummyProductByIdUnwind", dummyProduct.findUnwindOne);

// update all parcels
dummyProductRouter.put("/:id", dummyProduct.update);

// Delete a DropDownList with id
dummyProductRouter.delete("/:id", dummyProduct.delete);

//Delete All Dummy Products
dummyProductRouter.delete("/", dummyProduct.deleteAll);

module.exports = dummyProductRouter;
