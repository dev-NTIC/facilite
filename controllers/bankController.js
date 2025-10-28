const FinancingModel = require("../models/financingModel");

exports.renderBankDashboard = async(req, res) => {
    try {
        const { user } = req;

        // Get only admin-validated files
        const files = await FinancingModel.getAdminValidatedFiles();

        const stats = {
            total: files.length,
            approved: files.filter(
                (f) => f.bank_validated && f.status === "approved"
            ).length,
            pending: files.filter(
                (f) => !f.bank_validated && f.status === "processing"
            ).length,
            rejected: files.filter((f) => f.status === "rejected").length,
        };

        res.render("bank-dashboard", {
            title: "Banque - Validation",
            user,
            files,
            stats,
        });
    } catch (error) {
        console.error("Bank dashboard error:", error);
        res.status(500).send("Erreur: " + error.message);
    }
};

exports.bankApprove = async(req, res) => {
    try {
        const { id } = req.params;
        await FinancingModel.bankApprove(id, req.user.id);
        res.json({
            success: true,
            message: "Dossier approuvé - Financement validé",
        });
    } catch (error) {
        console.error("Bank approve error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.bankReject = async(req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Update status to rejected
        await FinancingModel.updateStatus(id, "rejected");

        // Could store rejection reason if you add a field to database
        // await FinancingModel.updateRejectionReason(id, reason);

        res.json({
            success: true,
            message: "Dossier rejeté par la banque",
        });
    } catch (error) {
        console.error("Bank reject error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};