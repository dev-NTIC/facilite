const express = require("express");
const router = express.Router();
const { isAdmin } = require("../config/authCheck");

const {
    renderAdminDashboard,
    approveFinancing,
    rejectFinancing,
} = require("../controllers/adminController");

const {
    renderProductsPage,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductsList,
} = require("../controllers/productController");

router.get("/dashboard", isAdmin, renderAdminDashboard);
router.post("/approve/:id", isAdmin, approveFinancing);
router.post("/reject/:id", isAdmin, rejectFinancing);

// Product routes
router.get("/products", isAdmin, renderProductsPage);
router.post("/products/create", isAdmin, createProduct);
router.put("/products/update/:id", isAdmin, updateProduct);
router.delete("/products/delete/:id", isAdmin, deleteProduct);
router.get("/products/get/:id", isAdmin, getProduct);

module.exports = router;