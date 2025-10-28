const db = require("../config/db");

module.exports = class FinancingModel {
    static async generateReference() {
        const year = new Date().getFullYear();
        const [rows] = await db.execute(
            "SELECT COUNT(*) as count FROM financing WHERE YEAR(created_at) = ?", [year]
        );
        const count = rows[0].count + 1;
        return `FIN-${year}-${String(count).padStart(3, "0")}`;
    }

    static async createFinancing(data) {
        const [result] = await db.execute(
            `INSERT INTO financing (
        reference, client_name, client_phone, client_email, birth_date,
        address, wilaya, marital_status, product_id, product_name, product_price,
        client_salary, spouse_salary, total_salary, duration, employment_type,
        other_financing, monthly_payment, total_payment, payment_ratio, is_eligible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                data.reference,
                data.client_name,
                data.client_phone,
                data.client_email,
                data.birth_date,
                data.address,
                data.wilaya,
                data.marital_status,
                data.product_id,
                data.product_name,
                data.product_price,
                data.client_salary,
                data.spouse_salary,
                data.total_salary,
                data.duration,
                data.employment_type,
                data.other_financing,
                data.monthly_payment,
                data.total_payment,
                data.payment_ratio,
                data.is_eligible,
            ]
        );
        return result.insertId;
    }

    static async saveDocuments(documents) {
        const values = documents.map((doc) => [
            doc.financing_id,
            doc.document_type,
            doc.file_name,
            doc.file_path,
        ]);

        await db.query(
            "INSERT INTO financing_documents (financing_id, document_type, file_name, file_path) VALUES ?", [values]
        );
    }

    static async getAllFinancing() {
        const [rows] = await db.execute(
            "SELECT * FROM financing ORDER BY created_at DESC"
        );
        return rows;
    }

    static async getFinancingByPhone(phone) {
        const [rows] = await db.execute(
            "SELECT * FROM financing WHERE client_phone = ? ORDER BY created_at DESC", [phone]
        );
        return rows;
    }

    static async getFinancingById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM financing WHERE id = ?", [id]
        );
        return rows[0];
    }

    static async getDocumentsByFinancingId(financingId) {
        const [rows] = await db.execute(
            "SELECT * FROM financing_documents WHERE financing_id = ?", [financingId]
        );
        return rows;
    }

    static async updateStatus(id, status) {
        await db.execute(
            "UPDATE financing SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, id]
        );
    }

    static async adminApprove(id, adminId) {
        await db.execute(
            `UPDATE financing 
     SET admin_validated = true, 
         admin_validated_at = CURRENT_TIMESTAMP,
         admin_validator_id = ?,
         status = 'processing'
     WHERE id = ?`, [adminId, id]
        );
    }

    static async getAdminValidatedFiles() {
        const [rows] = await db.execute(
            `SELECT * FROM financing 
     WHERE admin_validated = true 
     ORDER BY created_at DESC`
        );
        return rows;
    }

    static async bankApprove(id, bankId) {
        await db.execute(
            `UPDATE financing 
     SET bank_validated = true,
         bank_validated_at = CURRENT_TIMESTAMP,
         bank_validator_id = ?,
         status = 'approved'
     WHERE id = ?`, [bankId, id]
        );
    }
};