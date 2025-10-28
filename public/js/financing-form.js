// ============================================
// PRODUCT SELECTION SYSTEM - COMPLETE & FIXED
// ============================================

let allProducts = [];
let selectedProduct = null;

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    showStep(currentStep);
    attachEventListeners();
});

// Load all products from API
async function loadProducts() {
    try {
        const response = await fetch("/products/list");
        const data = await response.json();

        if (data.success && data.products) {
            allProducts = data.products;
            displayProducts(allProducts);
        }
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Display products in dropdown
function displayProducts(products) {
    const dropdown = document.getElementById("productDropdown");

    if (!dropdown) return;

    if (products && products.length > 0) {
        dropdown.innerHTML = products
            .map(
                (product) => `
      <div class="product-item" onclick="selectProduct(${product.id})">
        <div class="product-item-name">${product.name}</div>
        <div class="product-item-desc">${product.description || ""}</div>
        <div class="product-item-price">${product.price.toLocaleString(
            "fr-FR"
        )} DZD</div>
      </div>
    `
            )
            .join("");
        dropdown.classList.add("active");
    } else {
        dropdown.innerHTML =
            '<div class="product-item" style="pointer-events:none; text-align:center;">Aucun produit trouvé</div>';
        dropdown.classList.add("active");
    }
}

// Search/Filter products on input
document
    .getElementById("productSearch")
    .addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === "") {
            // Show all products when search is empty
            displayProducts(allProducts);
        } else {
            // Filter products
            const filtered = allProducts.filter(
                (product) =>
                product.name.toLowerCase().includes(searchTerm) ||
                (product.description &&
                    product.description
                    .toLowerCase()
                    .includes(searchTerm)) ||
                (product.specifications &&
                    product.specifications
                    .toLowerCase()
                    .includes(searchTerm))
            );
            displayProducts(filtered);
        }
    });

// Prevent dropdown from closing when clicking inside search
document
    .getElementById("productSearch")
    .addEventListener("click", function(e) {
        e.stopPropagation();
        if (allProducts.length > 0 && !selectedProduct) {
            displayProducts(allProducts);
        }
    });

// Select a product
function selectProduct(id) {
    selectedProduct = allProducts.find((p) => p.id === id);

    if (!selectedProduct) return;

    // Update form data
    formData.product = selectedProduct.id;
    formData.productPrice = selectedProduct.price;
    formData.productName = selectedProduct.name;

    // Update hidden fields
    document.getElementById("selectedProductId").value = selectedProduct.id;
    document.getElementById("productName").value = selectedProduct.name;
    document.getElementById("productPrice").value = selectedProduct.price;

    // Update display elements
    document.getElementById("displayProductName").textContent =
        selectedProduct.name;
    document.getElementById("displayProductDesc").textContent =
        selectedProduct.description || "";
    document.getElementById("displayProductPrice").textContent =
        selectedProduct.price.toLocaleString("fr-FR") + " DZD";

    if (selectedProduct.monthly_price_36) {
        document.getElementById("displayProductMonthly").textContent =
            selectedProduct.monthly_price_36.toLocaleString("fr-FR") +
            " DZD/mois (36 mois)";
    } else {
        document.getElementById("displayProductMonthly").textContent = "";
    }

    // Update search input
    document.getElementById("productSearch").value = selectedProduct.name;

    // Show selected product card, hide dropdown
    document.getElementById("selectedProductDisplay").style.display = "block";
    document.getElementById("productDropdown").classList.remove("active");
}

// Cancel product selection
document
    .getElementById("cancelProductBtn")
    .addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Clear selection
        selectedProduct = null;
        formData.product = null;
        formData.productPrice = null;
        formData.productName = null;

        // Clear form fields
        document.getElementById("selectedProductId").value = "";
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productSearch").value = "";

        // Hide selected card
        document.getElementById("selectedProductDisplay").style.display =
            "none";

        // Show dropdown with all products
        displayProducts(allProducts);

        // Focus on search input
        document.getElementById("productSearch").focus();
    });

// Current steprs
let currentStep = 1;
const totalSteps = 4;

// Form data
let formData = {
    product: null,
    productPrice: 0,
    productName: "",
    personalInfo: {},
    financialInfo: {},
    documents: [],
};

// Navigation
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    showStep(currentStep);
    attachEventListeners();
});

// Show specific step
function showStep(step) {
    // Hide all steps
    document
        .querySelectorAll(".form-step")
        .forEach((s) => s.classList.remove("active"));
    document.querySelectorAll(".step").forEach((s) => {
        s.classList.remove("active", "completed");
    });

    // Show current step
    document
        .querySelector(`.form-step[data-step="${step}"]`)
        .classList.add("active");
    document
        .querySelector(`.step[data-step="${step}"]`)
        .classList.add("active");

    // Mark completed steps
    for (let i = 1; i < step; i++) {
        document
            .querySelector(`.step[data-step="${i}"]`)
            .classList.add("completed");
    }

    // Update buttons
    prevBtn.style.display = step === 1 ? "none" : "inline-block";
    nextBtn.style.display = step === totalSteps ? "none" : "inline-block";
    submitBtn.style.display = step === totalSteps ? "inline-block" : "none";

    currentStep = step;
}

// Next step
nextBtn.addEventListener("click", function() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    }
});

// Previous step
prevBtn.addEventListener("click", function() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
});

// Validate current step
function validateStep(step) {
    const currentStepElement = document.querySelector(
        `.form-step[data-step="${step}"]`
    );
    const inputs = currentStepElement.querySelectorAll(
        "input[required], select[required]"
    );
    let isValid = true;

    inputs.forEach((input) => {
        if (!input.value) {
            input.style.borderColor = "#EF4444";
            isValid = false;
        } else {
            input.style.borderColor = "#E5E5E5";
        }
    });

    // Step-specific validation
    // Step-specific validation
    if (step === 1) {
        const selectedProductId =
            document.getElementById("selectedProductId").value;
        if (!selectedProductId || !selectedProduct) {
            alert("Veuillez sélectionner un produit TV");
            return false;
        }
        formData.product = selectedProduct.id;
        formData.productPrice = selectedProduct.price;
        formData.productName = selectedProduct.name;
    }

    if (step === 2) {
        // Validate age
        const birthDate = document.getElementById("birthDate").value;
        if (birthDate) {
            const age = calculateAge(birthDate);
            if (age < 19 || age > 75) {
                alert("L'âge doit être entre 19 et 75 ans");
                return false;
            }
        }
    }

    if (step === 3) {
        // Validate salary
        const clientSalary =
            parseInt(document.getElementById("clientSalary").value) || 0;
        if (clientSalary < 20000) {
            alert("Le salaire minimum requis est de 20,000 DZD");
            return false;
        }

        // Calculate financing
        calculateFinancing();
    }

    if (!isValid) {
        alert("Veuillez remplir tous les champs obligatoires");
    }

    return isValid;
}

// Calculate age
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Calculate financing
function calculateFinancing() {
    const clientSalary =
        parseFloat(document.getElementById("clientSalary").value) || 0;
    const spouseSalary =
        parseFloat(document.getElementById("spouseSalary").value) || 0;
    const duration = parseInt(document.getElementById("duration").value) || 36;
    const principal = formData.productPrice;

    const totalSalary = clientSalary + spouseSalary;
    const monthlyRate = 0.09 / 12; // 9% annual / 12

    // Calculate monthly payment using annuity formula
    const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, duration))) /
        (Math.pow(1 + monthlyRate, duration) - 1);

    const totalPayment = monthlyPayment * duration;
    const paymentRatio = (monthlyPayment / totalSalary) * 100;

    // Check eligibility
    const age = calculateAge(document.getElementById("birthDate").value);
    const isEligible =
        age >= 19 && age <= 75 && totalSalary >= 20000 && paymentRatio <= 8.0;

    // Display results
    document.getElementById("displayMonthly").textContent =
        Math.round(monthlyPayment).toLocaleString("fr-FR") + " DZD";
    document.getElementById("displayTotal").textContent =
        Math.round(totalPayment).toLocaleString("fr-FR") + " DZD";
    document.getElementById("displayRatio").textContent =
        paymentRatio.toFixed(1) + "%";

    const eligibilityElement = document.getElementById("displayEligible");
    if (isEligible) {
        eligibilityElement.textContent = "ÉLIGIBLE ✓";
        eligibilityElement.className = "result-value eligible";
    } else {
        eligibilityElement.textContent = "NON ÉLIGIBLE ✗";
        eligibilityElement.className = "result-value not-eligible";
    }

    // Store in form data
    formData.financialInfo = {
        clientSalary,
        spouseSalary,
        totalSalary,
        duration,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        paymentRatio: paymentRatio.toFixed(1),
        isEligible,
    };
}

// Attach event listeners
function attachEventListeners() {
    // Real-time calculation on financial inputs
    ["clientSalary", "spouseSalary", "duration"].forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("input", function() {
                if (currentStep === 3 && formData.productPrice > 0) {
                    calculateFinancing();
                }
            });
        }
    });

    // Product selection
    // Product selection
    document.querySelectorAll('input[name="productId"]').forEach((radio) => {
        radio.addEventListener("change", function() {
            formData.product = this.value;
            formData.productPrice = parseInt(this.dataset.price);
            formData.productName = this.dataset.name;

            // Update hidden fields
            document.getElementById("productName").value = this.dataset.name;
            document.getElementById("productPrice").value = this.dataset.price;
        });
    });
}

// Form submission
// Form submission with loading spinner
document
    .getElementById("financingForm")
    .addEventListener("submit", function(e) {
        e.preventDefault();

        if (!validateStep(4)) {
            return;
        }

        // Show loading overlay
        document.getElementById("loadingOverlay").classList.add("active");

        // Populate hidden fields with calculated values
        document.getElementById("monthlyPayment").value =
            formData.financialInfo.monthlyPayment || 0;
        document.getElementById("totalPayment").value =
            formData.financialInfo.totalPayment || 0;
        document.getElementById("paymentRatio").value =
            formData.financialInfo.paymentRatio || 0;
        document.getElementById("isEligible").value =
            formData.financialInfo.isEligible || false;

        // Populate hidden product fields
        document.getElementById("productName").value =
            formData.productName || "";
        document.getElementById("productPrice").value =
            formData.productPrice || 0;

        // Submit form to backend
        this.submit();
    });