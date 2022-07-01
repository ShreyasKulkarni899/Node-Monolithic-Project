// const router = require('express').Router();
// const bodyParser = require('body-parser');
// // const productParameters = require('../models/productParameterSchema');
// const inventoryProduct = require('../models/inventorySchema');
// // const purchase = require('../models/purchaseSchema');
// const counter = require('../models/counterSchema');
// const validator = require('../helper/validate');
// const responseCode = require('../helper/responseCode');
// const generalLib = require('../projectLib/generalLib');
// const purchaseSchema = require('../models/purchaseSchema');
// const { query } = require('express-validator');

const purchase = require("../../purchase/controller/purchase.controller.js");
const purchaseRouter = require("express").Router();
//router.use(bodyParser.urlencoded({
//    extended: false
//}));

//router.use(bodyParser.json());

purchaseRouter.post("/test", purchase.test);

// add purchase
// store purchase details in purchase collection
// add purchase id to all products create products with invetory 
// add barcode to each product. 
// store products in iventory collection

//storeId
//storeName
//SuppplierId

purchaseRouter.post("/addPurchase", purchase.addPurchase);

//./getPurchase                                     Status: Done
// get purchase from purchases table by id          Status: Done
// get all products from inventroies by purchaseId  Status: Done
// add both data and return                         Status: Done
purchaseRouter.get('/getPurchase', purchase.getPurchase);

// Update Purchase
// points to be discussed:
// jar update chya time la specific product(already inserted) reqData madhe nasel tar delete karaycha ka 
// how to calculate incentive(if multiple seasonal(like winter 2 ahet(both are seasonal)))
// when to calculate incentive(update time la)
// 
purchaseRouter.put('/updatePurchase', purchase.updatePurchase);

module.exports = purchaseRouter;