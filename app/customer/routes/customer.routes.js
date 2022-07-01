const customer = require("../../customer/controllers/customer.controller.js");
const { updateOrderStatus, getOrderNumber, deleteOrderStatus, getOrderByFilter, deleteOrder, updateOrder, getAllOrder, getOrderById } = require("../../order/controller/order.controller.js");
const customerRouter = require("express").Router();

// Create a new customer Model
customerRouter.post("/", customer.create);

// Retrieve all customer Model
customerRouter.get("/", customer.findAll);

// Retrieve a single customer Model with id
customerRouter.get("/:id", customer.findOne);

// Update a customer Model with id
customerRouter.put("/:id", customer.update);

// Delete a customer Model with id
customerRouter.delete("/:id", customer.delete);

// Create a new customer Model
customerRouter.delete("/", customer.deleteAll);

module.exports = customerRouter;

//jw token cron job  customer login employee login admin login