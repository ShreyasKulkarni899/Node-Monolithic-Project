const inquiry = require("../controller/inquiryModel.controller.js");
const inquiryRouter = require("express").Router();

// Create a new  token Model
inquiryRouter.post("/", inquiry.create);

// Retrieve all  token Model
// tokenRouter.get("/", token.findAll);

// Retrieve a token Model with conditions
inquiryRouter.get("/", inquiry.getConditionalParameters);

// get the filed with approved condition
inquiryRouter.get("/filter", inquiry.getByQuery);

//Updating the token model with the tokenNumber
inquiryRouter.put("/", inquiry.update);

// Delete a token Model with id
inquiryRouter.delete("/:id", inquiry.delete);

inquiryRouter.get("/getCSV", inquiry.getCSV);

module.exports = inquiryRouter;
