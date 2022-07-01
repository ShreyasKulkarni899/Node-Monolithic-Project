const router = require("express").Router();
const UserController = require("../controller/userSchema.controller.js");
const verifyTokenMiddleware = require("../middleware/verifyToken.js");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/verify", verifyTokenMiddleware, UserController.getUsers);
module.exports = router;
