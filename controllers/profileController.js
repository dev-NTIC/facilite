const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.renderProfile = async (req, res) => {
    try {
        const { user } = req;

        // Get user's financing statistics
        const [files] = await db.execute(
            "SELECT * FROM financing WHERE client_phone = ?",
            [user.phone]
        );

        const stats = {
            total: files.length,
            approved: files.filter((f) => f.status === "approved").length,
            pending: files.filter(
                (f) => f.status === "pending" || f.status === "processing"
            ).length,
            rejected: files.filter((f) => f.status === "rejected").length,
        };

        res.render("profile", {
            title: "Mon Profil",
            user,
            stats,
        });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).send("Erreur: " + error.message);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { full_name, email, phone } = req.body;
        const userId = req.user.id;

        // Check if email or phone already exists for another user
        const [existing] = await db.execute(
            "SELECT * FROM users WHERE (email = ? OR phone = ?) AND id != ?",
            [email, phone, userId]
        );

        if (existing.length > 0) {
            req.flash(
                "error",
                "Email ou téléphone déjà utilisé par un autre compte"
            );
            return res.redirect("/profile");
        }

        // Update user information
        await db.execute(
            "UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?",
            [full_name, email, phone, userId]
        );

        req.flash("success_msg", "Profil mis à jour avec succès");
        res.redirect("/profile");
    } catch (error) {
        console.error("Update profile error:", error);
        req.flash("error", "Erreur lors de la mise à jour");
        res.redirect("/profile");
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;
        const userId = req.user.id;

        // Validate passwords match
        if (new_password !== confirm_password) {
            req.flash(
                "error",
                "Les nouveaux mots de passe ne correspondent pas"
            );
            return res.redirect("/profile");
        }

        // Get current user password
        const [users] = await db.execute(
            "SELECT password FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            req.flash("error", "Utilisateur non trouvé");
            return res.redirect("/profile");
        }

        // Verify current password
        const isMatch = await bcrypt.compare(
            current_password,
            users[0].password
        );

        if (!isMatch) {
            req.flash("error", "Mot de passe actuel incorrect");
            return res.redirect("/profile");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update password
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [
            hashedPassword,
            userId,
        ]);

        req.flash("success_msg", "Mot de passe changé avec succès");
        res.redirect("/profile");
    } catch (error) {
        console.error("Change password error:", error);
        req.flash("error", "Erreur lors du changement de mot de passe");
        res.redirect("/profile");
    }
};
