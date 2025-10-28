const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../config/authCheck");
const {
    renderProfile,
    updateProfile,
    changePassword,
} = require("../controllers/profileController");

router.get("/", isAuthenticated, renderProfile);
router.post("/update", isAuthenticated, updateProfile);
router.post("/change-password", isAuthenticated, changePassword);

module.exports = router;
