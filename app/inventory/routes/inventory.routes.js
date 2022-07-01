// const router = require('express').Router();
// const bodyParser = require('body-parser');
// // const productParameters = require('../models/productParameterSchema');
// const inventoryProduct = require('../models/inventorySchema');
// const counter = require('../models/counterSchema');
// const validator = require('../helper/validate');
// const counterLib = require('../projectLib/counterLib');
// const responseCode = require('../helper/responseCode');
// var returnvalue = 0

// router.use(bodyParser.urlencoded({
//     extended: false
// }));


// router.use(bodyParser.json());
const inventory = require("../../inventory/controller/inventory.controller.js");
const inventoryRouter = require("express").Router();
inventoryRouter.post("/test", inventory.test);

inventoryRouter.post("/addInventoryProduct", inventory.addInventoryProduct);

inventoryRouter.get("/getInventoryProducts", inventory.getInventoryProducts);

inventoryRouter.put('/updateInventoryProduct', inventory.updateInventoryProducts);


inventoryRouter.get("/getAllInventoryProducts", inventory.getAllInventoryProducts);

inventoryRouter.get("/getInventoryProductById", inventory.getInventoryProductsById);

inventoryRouter.get('/getProductByLocation', inventory.getProductByLocation);

module.exports = inventoryRouter;