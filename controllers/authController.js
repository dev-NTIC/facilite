const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../config/db");

exports.renderLogin = (req, res) => {
    res.render("login", {
        title: "Connexion",
        error: req.flash("error"),
    });
};

exports.renderRegister = (req, res) => {
    res.render("register", {
        title: "Inscription",
        error: null,
    });
};

exports.login = (req, res, next) => {
    passport.authenticate("local", {
        failureRedirect: "/auth/login",
        failureFlash: true,
    })(req, res, () => {
        // Redirect based on role
        if (req.user.role === "admin") {
            res.redirect("/admin/dashboard");
        } else if (req.user.role === "bank") {
            res.redirect("/bank/dashboard");
        } else {
            res.redirect("/dashboard");
        }
    });
};

exports.register = async(req, res) => {
    try {
        const { fullName, email, phone, password, confirmPassword } = req.body;

        // Validation
        if (!fullName || !email || !phone || !password) {
            return res.render("register", {
                title: "Inscription",
                error: "Tous les champs sont obligatoires",
            });
        }

        if (password !== confirmPassword) {
            return res.render("register", {
                title: "Inscription",
                error: "Les mots de passe ne correspondent pas",
            });
        }

        if (password.length < 6) {
            return res.render("register", {
                title: "Inscription",
                error: "Le mot de passe doit contenir au moins 6 caractères",
            });
        }

        // Check if user exists
        const [existing] = await db.execute(
            "SELECT * FROM users WHERE email = ? OR phone = ?", [email, phone]
        );

        if (existing.length > 0) {
            return res.render("register", {
                title: "Inscription",
                error: "Email ou téléphone déjà utilisé",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await db.execute(
            "INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)", [fullName, email, phone, hashedPassword, "user"]
        );

        req.flash(
            "success_msg",
            "Compte créé avec succès. Vous pouvez maintenant vous connecter."
        );
        res.redirect("/auth/login");
    } catch (error) {
        console.error("Registration error:", error);
        res.render("register", {
            title: "Inscription",
            error: "Erreur lors de l'inscription",
        });
    }
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
        }
        req.flash("success_msg", "Vous êtes déconnecté");
        res.redirect("/auth/login");
    });
};