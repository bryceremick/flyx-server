const express = require("express");
const router = express.Router();
const autocompleteController = require("../controllers/autocompleteController");

router.get('/', autocompleteController.autocomplete);

module.exports = router;