// Application data
console.table(allProdcuts);
const products = allProdcuts.map((p) => ({
    id: p.id,
    name: p.name,
    specs: p.description,
    monthly_36m: p.monthly_price_36,
    price_36m: p.price,
}));
// const products = [{
//         id: 1,
//         name: 'TV 55" UHD (4K) Google TV',
//         specs: "Frameless, Mini LED 144 Hz, Built-in Demo",
//         monthly_36m: 3990,
//         price_36m: 143640,
//     },
//     {
//         id: 2,
//         name: 'TV 65" UHD (4K) Google TV',
//         specs: "Frameless, Mini LED 60 Hz, Built-in Demo",
//         monthly_36m: 4990,
//         price_36m: 179640,
//     },
//     {
//         id: 3,
//         name: 'TV 70" UHD (4K) Google TV',
//         specs: "Frameless, Built-in Demo",
//         monthly_36m: 6990,
//         price_36m: 251640,
//     },
//     {
//         id: 4,
//         name: 'TV 85" UHD (4K) Google TV',
//         specs: "Frameless, Mini LED 144 Hz, Built-in Demo",
//         monthly_36m: 11990,
//         price_36m: 431640,
//     },
// ];

const financingParams = {
    annualMarginRate: 0.09,
    monthlyMarginRate: 0.0075,
    minAge: 19,
    maxAge: 75,
    minSalary: 20000,
    minCredit: 50000,
    maxCredit: 1000000,
    fileFeeRate: 0.01,
    durations: [6, 12, 24, 36, 48, 60],
};

// Application state
const appState = {
    currentView: "products",
    selectedProduct: null,
    customerData: {
        name: "",
        birthDate: "",
        clientSalary: "",
        spouseSalary: "",
        duration: 36,
    },
};
let currentStep = 1;
let selectedProduct = null;
let selectedDuration = 36;

// Initialize the application
function init() {
    populateProducts();
    populateDurationButtons();
    setupEventListeners();

    // Add smooth transition classes to views
    document.getElementById("step1").classList.add("view-transition");
    document.getElementById("step2").classList.add("view-transition");
}

// Populate products grid
function populateProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    products.forEach((product) => {
        const isSelected = selectedProduct && selectedProduct.id === product.id;
        const productCard = document.createElement("div");
        productCard.className = `product-card ${isSelected ? "selected" : ""}`;
        productCard.innerHTML = `
                    <div class="tv-icon">📺</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-specs">${product.specs}</div>
                    <div class="price-info">
                        <div class="monthly-payment">${formatCurrency(
                            product.monthly_36m
                        )} DZD</div>
                        <div class="duration">per month for 36 months</div>
                    </div>
                    <button class="select-btn" onclick="selectProduct(${
                        product.id
                    })">
                        ${isSelected ? "Selected ✓" : "Select This TV"}
                    </button>
                `;

        // Add click handler to entire card for better UX
        productCard.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") {
                selectProduct(product.id);
            }
        });

        grid.appendChild(productCard);
    });
}

// Populate duration buttons
function populateDurationButtons() {
    const container = document.getElementById("duration-buttons");
    container.innerHTML = "";

    financingParams.durations.forEach((duration) => {
        const button = document.createElement("div");
        button.className = `duration-btn ${
            duration === selectedDuration ? "active" : ""
        }`;
        button.textContent = `${duration}m`;
        button.onclick = () => selectDuration(duration);
        container.appendChild(button);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById("back-btn").onclick = goToStep1;
    document.getElementById("apply-btn").onclick = applyNow;

    // Add keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && currentStep === 2) {
            changeTVProduct();
        } else if (e.key === "Enter" && currentStep === 1 && selectedProduct) {
            goToStep2();
        }
    });

    // Form input listeners for real-time validation and calculation
    const inputs = ["fullName", "birthDate", "salary", "spouseSalary"];
    inputs.forEach((inputId) => {
        const input = document.getElementById(inputId);
        input.addEventListener("input", () => {
            validateInput(inputId);
            calculateFinancing();
        });
        input.addEventListener("blur", () => validateInput(inputId));
    });
}

// Select a product
function selectProduct(productId) {
    const previousProduct = selectedProduct;
    selectedProduct = products.find((p) => p.id === productId);

    // If changing from a different product, show a subtle notification
    if (
        previousProduct &&
        previousProduct.id !== productId &&
        appState.customerData.name
    ) {
        showProductChangeNotice(previousProduct, selectedProduct);
    }

    goToStep2();
}

// Show product change notice
function showProductChangeNotice(oldProduct, newProduct) {
    // Create a temporary notice
    const notice = document.createElement("div");
    notice.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
                font-size: 0.9em;
            `;
    notice.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">TV Changed!</div>
                <div>From: ${oldProduct.name
                    .split(" ")
                    .slice(0, 3)
                    .join(" ")}</div>
                <div>To: ${newProduct.name
                    .split(" ")
                    .slice(0, 3)
                    .join(" ")}</div>
                <div style="font-size: 0.8em; margin-top: 5px; opacity: 0.9;">Your form data has been preserved</div>
            `;

    document.body.appendChild(notice);

    // Animate in
    setTimeout(() => {
        notice.style.transform = "translateX(0)";
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notice.style.transform = "translateX(100%)";
        setTimeout(() => {
            if (notice.parentNode) {
                notice.parentNode.removeChild(notice);
            }
        }, 300);
    }, 3000);
}

// Select duration
function selectDuration(duration) {
    selectedDuration = duration;

    // Update active duration button
    document.querySelectorAll(".duration-btn").forEach((btn) => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    calculateFinancing();
}

// Navigate to step 1
function goToStep1() {
    transitionToView("products");
}

// Change TV product with form data preservation
function changeTVProduct() {
    // Save current form data
    saveCustomerData();

    // Show data preservation notice
    showDataPreservedNotice();

    // Transition back to products
    transitionToView("products");
}

// Save customer data to state
function saveCustomerData() {
    appState.customerData = {
        name: document.getElementById("fullName").value,
        birthDate: document.getElementById("birthDate").value,
        clientSalary: document.getElementById("salary").value,
        spouseSalary: document.getElementById("spouseSalary").value,
        duration: selectedDuration,
    };
}

// Restore customer data from state
function restoreCustomerData() {
    if (appState.customerData.name) {
        document.getElementById("fullName").value = appState.customerData.name;
        document.getElementById("birthDate").value =
            appState.customerData.birthDate;
        document.getElementById("salary").value =
            appState.customerData.clientSalary;
        document.getElementById("spouseSalary").value =
            appState.customerData.spouseSalary;
        selectedDuration = appState.customerData.duration || 36;

        // Update duration buttons
        populateDurationButtons();

        // Recalculate with restored data
        calculateFinancing();
    }
}

// Show data preserved notice
function showDataPreservedNotice() {
    const hasData =
        appState.customerData.name || appState.customerData.clientSalary;
    if (hasData) {
        // Create notice if it doesn't exist
        let notice = document.getElementById("data-preserved-notice");
        if (!notice) {
            notice = document.createElement("div");
            notice.id = "data-preserved-notice";
            notice.className = "data-preserved-notice";
            notice.innerHTML = `
                        <span>ℹ️</span>
                        Your information will be saved while you change TV selection
                    `;
            const calculatorForm = document.querySelector(".calculator-form");
            calculatorForm.insertBefore(notice, calculatorForm.firstChild);
        }

        notice.classList.add("show");

        // Hide after 3 seconds
        setTimeout(() => {
            notice.classList.remove("show");
        }, 3000);
    }
}

// Smooth view transitions
function transitionToView(viewName) {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step1Indicator = document.getElementById("step1-indicator");
    const step2Indicator = document.getElementById("step2-indicator");

    // Add transition class
    const currentView = appState.currentView === "products" ? step1 : step2;
    currentView.classList.add("fade-out");

    setTimeout(() => {
        if (viewName === "products") {
            // Show products view
            currentStep = 1;
            appState.currentView = "products";
            step1.classList.remove("hidden", "fade-out");
            step2.classList.add("hidden");
            step1Indicator.classList.add("active");
            step2Indicator.classList.remove("active");

            // Highlight previously selected product
            highlightSelectedProduct();
        } else if (viewName === "calculator") {
            // Show calculator view
            currentStep = 2;
            appState.currentView = "calculator";
            step1.classList.add("hidden");
            step2.classList.remove("hidden", "fade-out");
            step1Indicator.classList.remove("active");
            step2Indicator.classList.add("active");

            // Display selected TV and restore data
            displaySelectedTV();
            restoreCustomerData();
        }
    }, 150);
}

// Highlight previously selected product in grid
function highlightSelectedProduct() {
    if (selectedProduct) {
        setTimeout(() => {
            const productCards = document.querySelectorAll(".product-card");
            productCards.forEach((card, index) => {
                if (products[index].id === selectedProduct.id) {
                    card.classList.add("selected");
                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                } else {
                    card.classList.remove("selected");
                }
            });
        }, 200);
    }
}

// Navigate to step 2
function goToStep2() {
    // Save the selected product to state
    appState.selectedProduct = selectedProduct;

    // Transition to calculator view
    transitionToView("calculator");
}

// Display selected TV information
function displaySelectedTV() {
    const container = document.getElementById("selected-tv-card");
    if (selectedProduct) {
        container.innerHTML = `
                    <div class="selected-tv-header">
                        <div class="selected-tv-info">
                            <div class="selected-tv-name">
                                <div class="tv-icon-small">📺</div>
                                ${selectedProduct.name}
                            </div>
                            <div class="selected-tv-specs">${
                                selectedProduct.specs
                            }</div>
                            <div class="selected-tv-price">
                                <span>Price: ${formatCurrency(
                                    selectedProduct.price_36m
                                )} DZD</span>
                                <span>•</span>
                                <span>Monthly: ${formatCurrency(
                                    selectedProduct.monthly_36m
                                )} DZD</span>
                            </div>
                        </div>
                        <button class="change-tv-btn" onclick="changeTVProduct()">
                            <span>🔄</span>
                            Change TV
                        </button>
                    </div>
                `;
    }
}

// Validate individual input
function validateInput(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + "-error");
    let isValid = true;
    let errorMessage = "";

    input.classList.remove("error");
    errorElement.textContent = "";

    switch (inputId) {
        case "fullName":
            if (!input.value.trim()) {
                isValid = false;
                errorMessage = "Full name is required";
            } else if (input.value.trim().length < 3) {
                isValid = false;
                errorMessage = "Name must be at least 3 characters";
            }
            break;

        case "birthDate":
            if (!input.value) {
                isValid = false;
                errorMessage = "Birth date is required";
            } else {
                const age = calculateAge(input.value);
                if (
                    age < financingParams.minAge ||
                    age > financingParams.maxAge
                ) {
                    isValid = false;
                    errorMessage = `Age must be between ${financingParams.minAge} and ${financingParams.maxAge} years`;
                }
            }
            break;

        case "salary":
            if (!input.value) {
                isValid = false;
                errorMessage = "Monthly salary is required";
            } else if (parseInt(input.value) < financingParams.minSalary) {
                isValid = false;
                errorMessage = `Minimum salary is ${formatCurrency(
                    financingParams.minSalary
                )} DZD`;
            }
            break;
    }

    if (!isValid) {
        input.classList.add("error");
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

// Calculate age from birth date
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age;
}

// Calculate financing details using annuity formula
function calculateFinancing() {
    if (!selectedProduct) return;

    const resultsGrid = document.getElementById("results-grid");
    const eligibilityStatus = document.getElementById("eligibility-status");
    const applyBtn = document.getElementById("apply-btn");

    // Get form values
    const salary = parseInt(document.getElementById("salary").value) || 0;
    const spouseSalary =
        parseInt(document.getElementById("spouseSalary").value) || 0;
    const totalIncome = salary + spouseSalary;

    // Calculate TV price based on original 36-month payment
    const tvPrice = selectedProduct.price_36m;

    // Annuity formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const P = tvPrice; // Principal
    const r = financingParams.monthlyMarginRate; // Monthly rate
    const n = selectedDuration; // Number of months

    let monthlyPayment;
    if (r === 0) {
        monthlyPayment = P / n;
    } else {
        monthlyPayment =
            (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const totalAmount = monthlyPayment * n;
    const profitAmount = totalAmount - P;
    const fileAmount = tvPrice * financingParams.fileFeeRate;
    const finalTotalAmount = totalAmount + fileAmount;
    const paymentToSalaryRatio =
        totalIncome > 0 ? (monthlyPayment / totalIncome) * 100 : 0;

    // Check eligibility
    const isEligible = checkEligibility(totalIncome, tvPrice);

    // Display results
    resultsGrid.innerHTML = `
                <div class="result-card">
                    <div class="result-label">Monthly Payment</div>
                    <div class="result-value">${formatCurrency(
                        Math.round(monthlyPayment)
                    )} DZD</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Total to Pay</div>
                    <div class="result-value">${formatCurrency(
                        Math.round(finalTotalAmount)
                    )} DZD</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Profit Amount</div>
                    <div class="result-value">${formatCurrency(
                        Math.round(profitAmount)
                    )} DZD</div>
                </div>
                <div class="result-card">
                    <div class="result-label">File Fee (1%)</div>
                    <div class="result-value">${formatCurrency(
                        Math.round(fileAmount)
                    )} DZD</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Payment/Income Ratio</div>
                    <div class="result-value">${paymentToSalaryRatio.toFixed(
                        1
                    )}%</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Duration</div>
                    <div class="result-value">${selectedDuration} months</div>
                </div>
            `;

    // Display eligibility status
    eligibilityStatus.className = `eligibility-status ${
        isEligible.eligible ? "eligible" : "not-eligible"
    }`;
    eligibilityStatus.innerHTML = `
                <div style="font-size: 1.5em; margin-bottom: 10px;">
                    ${isEligible.eligible ? "✅ ELIGIBLE" : "❌ NOT ELIGIBLE"}
                </div>
                <div style="font-size: 0.9em; font-weight: normal;">
                    ${isEligible.message}
                </div>
            `;
    eligibilityStatus.classList.remove("hidden");

    // Show/hide apply button
    if (isEligible.eligible) {
        applyBtn.classList.remove("hidden");
    } else {
        applyBtn.classList.add("hidden");
    }
}

// Check eligibility based on criteria
function checkEligibility(totalIncome, tvPrice) {
    const age = document.getElementById("birthDate").value ?
        calculateAge(document.getElementById("birthDate").value) :
        0;
    const fullName = document.getElementById("fullName").value.trim();
    const salary = parseInt(document.getElementById("salary").value) || 0;

    // Check all required fields
    if (!fullName || !document.getElementById("birthDate").value || !salary) {
        return {
            eligible: false,
            message: "Please fill in all required fields",
        };
    }

    // Check age eligibility
    if (age < financingParams.minAge || age > financingParams.maxAge) {
        return {
            eligible: false,
            message: `Age must be between ${financingParams.minAge} and ${financingParams.maxAge} years`,
        };
    }

    // Check minimum salary
    if (salary < financingParams.minSalary) {
        return {
            eligible: false,
            message: `Minimum monthly salary required: ${formatCurrency(
                financingParams.minSalary
            )} DZD`,
        };
    }

    // Check credit amount limits
    if (tvPrice < financingParams.minCredit) {
        return {
            eligible: false,
            message: `Minimum credit amount: ${formatCurrency(
                financingParams.minCredit
            )} DZD`,
        };
    }

    if (tvPrice > financingParams.maxCredit) {
        return {
            eligible: false,
            message: `Maximum credit amount: ${formatCurrency(
                financingParams.maxCredit
            )} DZD`,
        };
    }

    // Check payment to income ratio (should not exceed 40%)
    const P = tvPrice;
    const r = financingParams.monthlyMarginRate;
    const n = selectedDuration;
    const monthlyPayment =
        (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const ratio = (monthlyPayment / totalIncome) * 100;

    if (ratio > 40) {
        return {
            eligible: false,
            message: "Monthly payment exceeds 40% of your income. Consider longer duration or higher income.",
        };
    }

    return {
        eligible: true,
        message: "You meet all eligibility criteria. You can proceed with the application.",
    };
}

// Apply now function
function applyNow() {
    const customerName = document.getElementById("fullName").value;
    const birthDate = document.getElementById("birthDate").value;
    const salary = document.getElementById("salary").value;
    const spouseSalary = document.getElementById("spouseSalary").value;
    const productName = selectedProduct.name;
    const duration = selectedDuration;

    const mailtoLink = `mailto:sarlbomare@streamsystem.net?subject=TV Financing Application - ${productName}&body=Dear Stream System Team,%0A%0AI would like to apply for TV financing with the following details:%0A%0ACustomer Name: ${customerName}%0ABirth Date: ${birthDate}%0AProduct: ${productName}%0AFinancing Duration: ${duration} months%0AMonthly Salary: ${formatCurrency(
        salary || 0
    )} DZD%0ASpouse Salary: ${formatCurrency(
        spouseSalary || 0
    )} DZD%0A%0APlease contact me to proceed with the application.%0A%0AThank you.`;

    window.open(mailtoLink, "_blank");
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat("fr-FR").format(amount);
}

// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", init);