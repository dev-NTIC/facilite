// Login Form Handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        // TODO: Add actual authentication logic here
        // For now, just redirect to dashboard
        console.log("Login attempt:", { phone, password });

        // Store user session (simplified)
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", "Ahmed Benali");

        // Redirect to dashboard
        window.location.href = "dashboard.html";
        // Register Form Handler
        const registerForm = document.getElementById("registerForm");
        if (registerForm) {
            registerForm.addEventListener("submit", function(e) {
                e.preventDefault();

                const fullName = document.getElementById("fullName").value;
                const email = document.getElementById("email").value;
                const phone = document.getElementById("phone").value;
                const password = document.getElementById("password").value;
                const confirmPassword =
                    document.getElementById("confirmPassword").value;

                // Validate passwords match
                if (password !== confirmPassword) {
                    alert("Les mots de passe ne correspondent pas!");
                    return;
                }

                // TODO: Add actual registration logic here
                console.log("Registration:", { fullName, email, phone });

                // Success message and redirect
                alert(
                    "Inscription réussie! Vous allez être redirigé vers la page de connexion."
                );
                window.location.href = "/auth/login";
            });
        }
    });
}