const router = require("express").Router();
const bodyParser = require("body-parser");
const purchaseReturnController = require("../controller/purchaseReturn.controller.js");

router.post("/addPurchaseReturn", purchaseReturnController.addPurchaseReturn);
router.get(
  "/getPurchaseReturn/:id",
  purchaseReturnController.getPurchaseReturn
);

router.get(
  "/getAllPurchaseReturn",
  purchaseReturnController.getAllPurchaseReturns
);

router.put(
  "/updatePurchaseReturn",
  purchaseReturnController.updatePurchaseReturn
);

module.exports = router;
