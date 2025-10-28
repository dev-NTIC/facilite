const FinancingModel = require("../models/financingModel");

exports.renderDashboard = async(req, res) => {
    try {
        const { user } = req.session;
        const { success, reference } = req.query; // Add this line

        const files = await FinancingModel.getAllFinancing();

        const stats = {
            total: files.length,
            approved: files.filter((f) => f.status === "approved").length,
            pending: files.filter((f) => f.status === "pending").length,
            processing: files.filter((f) => f.status === "processing").length,
            rejected: files.filter((f) => f.status === "rejected").length,
        };

        res.render("dashboard", {
            title: "Tableau de bord",
            user,
            files,
            stats,
            success, // Add this
            reference, // Add this
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).send("Erreur: " + error.message);
    }
};