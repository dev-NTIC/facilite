exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error_msg", "Veuillez vous connecter");
    res.redirect("/auth/login");
};

exports.isGuest = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }

    // Redirect based on role
    if (req.user.role === "admin") {
        res.redirect("/admin/dashboard");
    } else if (req.user.role === "bank") {
        res.redirect("/bank/dashboard");
    } else {
        res.redirect("/dashboard");
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    req.flash("error_msg", "Accès non autorisé");
    res.redirect("/auth/login");
};

exports.isBank = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "bank") {
        return next();
    }
    req.flash("error_msg", "Accès non autorisé");
    res.redirect("/auth/login");
};

exports.isUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "user") {
        return next();
    }
    req.flash("error_msg", "Accès non autorisé");
    res.redirect("/auth/login");
};