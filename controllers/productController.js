const ProductModel = require("../models/productModel");

exports.renderProductsPage = async(req, res) => {
    try {
        const { user } = req.session;
        const products = await ProductModel.getAllProductsAdmin();

        res.render("admin-products", {
            title: "Admin - Gestion des produits",
            user,
            products,
        });
    } catch (error) {
        console.error("Products page error:", error);
        res.status(500).send("Erreur: " + error.message);
    }
};

exports.createProduct = async(req, res) => {
    try {
        const {
            name,
            description,
            price,
            monthly_price_36,
            specifications,
            is_active,
        } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                error: "Le nom et le prix sont obligatoires",
            });
        }

        const productData = {
            name,
            description: description || "",
            price: parseFloat(price),
            monthly_price_36: monthly_price_36 ?
                parseFloat(monthly_price_36) :
                null,
            specifications: specifications || "",
            is_active: is_active === "true" || is_active === true,
        };

        const productId = await ProductModel.createProduct(productData);

        res.json({
            success: true,
            productId,
            message: "Produit créé avec succès",
        });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.updateProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            monthly_price_36,
            specifications,
            is_active,
        } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                error: "Le nom et le prix sont obligatoires",
            });
        }

        const productData = {
            name,
            description: description || "",
            price: parseFloat(price),
            monthly_price_36: monthly_price_36 ?
                parseFloat(monthly_price_36) :
                null,
            specifications: specifications || "",
            is_active: is_active === "true" || is_active === true,
        };

        await ProductModel.updateProduct(id, productData);

        res.json({
            success: true,
            message: "Produit mis à jour avec succès",
        });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;

        await ProductModel.deleteProduct(id);

        res.json({
            success: true,
            message: "Produit supprimé avec succès",
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.getProduct = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Produit non trouvé",
            });
        }

        res.json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.getProductsList = async(req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        res.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Get products list error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};