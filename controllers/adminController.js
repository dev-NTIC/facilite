const FinancingModel = require("../models/financingModel");

exports.renderAdminDashboard = async(req, res) => {
    try {
        const { user } = req.session;

        // Get all financing files
        const files = await FinancingModel.getAllFinancing();

        // Calculate stats
        const stats = {
            total: files.length,
            approved: files.filter((f) => f.status === "approved").length,
            pending: files.filter((f) => f.status === "pending").length,
            processing: files.filter((f) => f.status === "processing").length,
            rejected: files.filter((f) => f.status === "rejected").length,
        };
        console.log(user);
        res.render("admin-dashboard", {
            title: "Admin - Tableau de bord",
            user,
            files,
            stats,
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).send("Erreur: " + error.message);
    }
};

exports.approveFinancing = async(req, res) => {
    try {
        const { id } = req.params;
        await FinancingModel.adminApprove(id, req.user.id);
        res.json({
            success: true,
            message: "Dossier approuvé - Envoyé à la banque pour validation finale",
        });
    } catch (error) {
        console.error("Approve error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.rejectFinancing = async(req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        await FinancingModel.updateStatus(id, "rejected");
        // You can add reason to database if needed

        res.json({
            success: true,
            message: "Dossier rejeté",
        });
    } catch (error) {
        console.error("Reject error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};