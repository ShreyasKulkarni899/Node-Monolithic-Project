const order = require("../../order/controller/order.controller.js")

const orderRouter = require("express").Router();
//Add order
orderRouter.post("/addorder", order.addOrder);
//get order by ID
orderRouter.post("/getorderbyId", order.getOrderById);
//get all orders
orderRouter.post("/getallorder", order.getAllOrder);
// Get orders by filter
orderRouter.post("/getorderbyfilter", order.getOrderByFilter);
// get order number
orderRouter.post("/getordernumber", order.getOrderNumber);
//Update order
orderRouter.post("/updateorder", order.updateOrder);
// // To change order status : [Status for order : Draft,Pending, packed/received, partial, complete, excess]
orderRouter.post("/updateorderstatus", order.updateOrderStatus);
//delete order
orderRouter.post("/deleteorder", order.deleteOrder);
//delete Order status
orderRouter.post("/deleteorderstatus", order.deleteOrderStatus);



module.exports = orderRouter;