const express = require("express");
const router = express.Router();
const { getProductsList } = require("../controllers/productController");

router.get("/list", getProductsList);

module.exports = router;