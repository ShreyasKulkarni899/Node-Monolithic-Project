const token = require("../controller/token.controller.js");
const tokenRouter = require("express").Router();

// Create a new  token Model
tokenRouter.post("/", token.create);

// Retrieve all  token Model
// tokenRouter.get("/", token.findAll);

// Retrieve a token Model with conditions
tokenRouter.get("/", token.getConditionalParameters);

// get BY date
tokenRouter.get("/getByDate", token.getByDate);

// Delete a token Model with id
tokenRouter.delete("/:id", token.delete);


module.exports = tokenRouter;
