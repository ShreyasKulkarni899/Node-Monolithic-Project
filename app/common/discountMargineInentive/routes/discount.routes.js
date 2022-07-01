const discount = require('../controller/discount.controller.js');
const discountRouter = require("express").Router();

// create a new discount
discountRouter.post("/addDiscount", discount.create);

// get all discounts
discountRouter.get("/getAllDiscounts", discount.findAll);

// update the discount
discountRouter.put("/updateDiscount/:id", discount.update);

module.exports = discountRouter;