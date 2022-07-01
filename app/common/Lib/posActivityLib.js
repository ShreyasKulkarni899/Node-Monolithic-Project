const router = require("express").Router();
const bodyParser = require("body-parser");
const counter = require('../models/counterSchema');
const validator = require('../helper/validate');

router.use(
    bodyParser.urlencoded({
        extended: false
    })
);

router.use(bodyParser.json());




function getProduct(barcode, returnFunction) {
    // getProduct from iventorySchema using barcode
    // get specification related to product
    // check For special Discount in product Details
    // if present 
    //      return {product name, MRP, selling price, discount price, discount type, discount margin}
    // else
    //      search for discount and incentive documets in discountMarginandIncentiveSchema using following parameters
    //      {   department
    //          productItem
    //          productType
    //          brand
    //          curret date in between discountStartDate and discountEndDate 
    //          saleRateMin: Number,
    //          saleRateMax: Number,
    //          section: String,
    //          counter: String,
    //          season: String,
    //      }
    //      check for seasonal discount
    //      if present 
    //          calculate discount price and return 
    //          {product name, MRP, selling price, discount price, discount type, discount margin, list of incetives }
    //      else check for regular discount with same combiation 
    //          calculate discount price and return 
    //          {product name, MRP, selling price, discount price, discount type, discount margin}
    //      check for incentice calculation
}

module.exports = { getNextSequenceValue };