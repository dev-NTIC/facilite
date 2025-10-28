const db = require("../config/db");

module.exports = class ProductModel {
    static async getAllProducts() {
        const [rows] = await db.execute(
            "SELECT * FROM products WHERE is_active = true ORDER BY name ASC"
        );
        return rows;
    }

    static async getAllProductsAdmin() {
        const [rows] = await db.execute(
            "SELECT * FROM products ORDER BY created_at DESC"
        );
        return rows;
    }

    static async getProductById(id) {
        const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
            id,
        ]);
        return rows[0];
    }

    static async createProduct(data) {
        const [result] = await db.execute(
            `INSERT INTO products (name, description, price, monthly_price_36, specifications, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`, [
                data.name,
                data.description,
                data.price,
                data.monthly_price_36,
                data.specifications,
                data.is_active !== undefined ? data.is_active : true,
            ]
        );
        return result.insertId;
    }

    static async updateProduct(id, data) {
        await db.execute(
            `UPDATE products 
       SET name = ?, description = ?, price = ?, monthly_price_36 = ?, 
           specifications = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`, [
                data.name,
                data.description,
                data.price,
                data.monthly_price_36,
                data.specifications,
                data.is_active,
                id,
            ]
        );
    }

    static async deleteProduct(id) {
        // Check if product is used in any financing
        const [financing] = await db.execute(
            "SELECT COUNT(*) as count FROM financing WHERE product_id = ?", [id]
        );

        if (financing[0].count > 0) {
            throw new Error(
                "Ce produit ne peut pas être supprimé car il est utilisé dans des dossiers de financement"
            );
        }

        await db.execute("DELETE FROM products WHERE id = ?", [id]);
    }

    static async toggleActive(id) {
        await db.execute(
            "UPDATE products SET is_active = NOT is_active WHERE id = ?", [id]
        );
    }
};