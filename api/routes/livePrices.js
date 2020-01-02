const express = require("express");
const router = express.Router();

const livePricesController = require("../controllers/livePricesController");

router.get("/", livePricesController.priceticker);

module.exports = router;