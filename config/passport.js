const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("./db");

module.exports = function(passport) {
    // Local Strategy
    passport.use(
        new LocalStrategy({
                usernameField: "phone",
                passwordField: "password",
            },
            async(phone, password, done) => {
                try {
                    // Find user by phone
                    const [users] = await db.execute(
                        "SELECT * FROM users WHERE phone = ? AND is_active = true", [phone]
                    );
                    if (users.length === 0) {
                        return done(null, false, {
                            message: "Numéro de téléphone incorrect",
                        });
                    }

                    const user = users[0];

                    // Check password
                    const isMatch = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (!isMatch) {
                        return done(null, false, {
                            message: "Mot de passe incorrect",
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user
    passport.deserializeUser(async(id, done) => {
        try {
            const [users] = await db.execute(
                "SELECT id, full_name, email, phone, role, is_active FROM users WHERE id = ?", [id]
            );

            if (users.length === 0) {
                return done(null, false);
            }

            done(null, users[0]);
        } catch (error) {
            done(error);
        }
    });
};