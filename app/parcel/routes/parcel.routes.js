const parcel = require('../controller/parcel.controller.js');
const parcelRouter = require("express").Router();

// Create a new Parcel
parcelRouter.post("/", parcel.create);

// find all parcels
parcelRouter.get("/", parcel.findAll);

// find all parcels
parcelRouter.get("/getParcelById/:id", parcel.findOne);

// getLRNumberByOrderPurchaseReturnNumber
parcelRouter.post("/getLRNumberByOrder", parcel.getLRNumberByOrder);

// update all parcels
parcelRouter.put("/:id", parcel.update);

// Delete a DropDownList with id
parcelRouter.delete("/:id", parcel.delete);

// Delete all DropDownList
parcelRouter.delete("/", parcel.deleteAll);

module.exports = parcelRouter;