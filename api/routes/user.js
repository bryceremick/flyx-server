const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/userController");


router.post("/verify", checkAuth, userController.verify);


module.exports = router;
