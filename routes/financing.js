const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../config/authCheck");
const upload = require("../config/multer");
const {
    renderCreatePage,
    createFinancing,
    getFinancingByPhone,
    updateStatus,
    getFinancingDetails,
    getFinancingById,
} = require("../controllers/financingController");

router.get("/create", renderCreatePage);
router.post(
    "/create",
    upload.fields([
        { name: "cni", maxCount: 2 },
        { name: "payslips", maxCount: 3 },
        { name: "work_certificate", maxCount: 1 },
        { name: "other_documents", maxCount: 5 },
    ]),
    createFinancing
);

router.get("/:id", isAuthenticated, getFinancingById);
// Add this line with other routes
router.get("/get/:id", isAuthenticated, getFinancingDetails);

router.post("/get", isAuthenticated, getFinancingByPhone);
router.put("/updatestatus", isAuthenticated, updateStatus);

module.exports = router;