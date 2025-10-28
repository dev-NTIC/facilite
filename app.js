const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
require("dotenv").config();

const app = express();

// Passport config
require("./config/passport")(passport);

// Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const financingRoutes = require("./routes/financing");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");
const bankRoutes = require("./routes/bank");
const profileRoutes = require("./routes/profile");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/documents", express.static("documents"));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "stream-system-secret-key-2025",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const ProductModel = require("./models/productModel");

app.get("/", async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts();
        console.log(products);
        res.render("index", {
            title: "Stream System - Financement TV",
            user: req.user,
            products: products,
        });
    } catch (error) {
        console.error("Homepage error:", error);
        res.render("index", {
            title: "Stream System - Financement TV",
            user: req.user,
            products: [],
        });
    }
});

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/financing", financingRoutes);
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/bank", bankRoutes);
app.use("/profile", profileRoutes);

// Error handling
app.use((req, res, next) => {
    res.status(404).send("Page non trouvée");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Erreur serveur: " + err.message);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("\n" + "=".repeat(70));
    console.log("🎉 Stream System Server Started!");
    console.log("=".repeat(70));
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`🔐 Login: http://localhost:${PORT}/auth/login`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log("=".repeat(70) + "\n");
});

module.exports = app;
