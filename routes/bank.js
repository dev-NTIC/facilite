const express = require("express");
const router = express.Router();
const { isBank } = require("../config/authCheck");
const {
    renderBankDashboard,
    bankApprove,
    bankReject,
} = require("../controllers/bankController");

router.get("/dashboard", isBank, renderBankDashboard);
router.post("/approve/:id", isBank, bankApprove);
router.post("/reject/:id", isBank, bankReject);

module.exports = router;