const incentive = require("../controller/incentive.controller.js");
const incentiveRouter = require("express").Router();

//Test
incentiveRouter.post("/test", incentive.test);

//addIncentive
incentiveRouter.post('/addIncentiveSetting', incentive.addIncentiveSetting);

// get all incentive
incentiveRouter.get('/getAllIncentives', incentive.getAllIncentives);

//updateIncentive
incentiveRouter.put('/updateIncentive', incentive.updateIncentive);

module.exports = router;