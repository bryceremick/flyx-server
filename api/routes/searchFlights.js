const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const checkAuth = require("../middleware/check-auth");

router.post('/', checkAuth, searchController.searchFlights);

module.exports = router;