const productRouter = require("express").Router();
const product = require("../controller/product.controller.js");

// Create a new Parcel
productRouter.post("/", product.create);

// find all product
productRouter.get("/", product.findAll);

productRouter.get("/getProduct", product.findByProductId);
// find product by id
productRouter.get("/:id", product.findOne);

// find product by product id
productRouter.get("/findbyproductid", product.findByProductId);

// find product by unwind
// productRouter.get("/getproductByIdUnwind", product.findUnwindOne);

// update all parcels
productRouter.put("/:id", product.update);

// Delete a DropDownList with id
productRouter.delete("/:id", product.delete);

//Delete All Dummy Products
productRouter.delete("/", product.deleteAll);

module.exports = productRouter;