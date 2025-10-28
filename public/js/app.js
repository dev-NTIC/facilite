// AlBaraka Bank Loan Simulator - JavaScript Implementation

class FinancingCalculator {
    constructor() {
        // Financing parameters
        this.params = {
            annualMarginRate: 0.09,
            monthlyMarginRate: 0.09 / 12,
            maxIncomeRatio: 0.08,
            minSalary: 20000,
            maxAge: 75,
            minDuration: 6,
            maxDuration: 60,
            fileStudyFeeRate: 0.01,
            fileStudyFeeMin: 1000,
            minContributionRate: 0,
            conventionalMax: 1000000,
            conventionalMin: 50000
        };

        // Initialize form elements
        this.initializeElements();
        this.bindEvents();
        this.calculate(); // Initial calculation
    }

    initializeElements() {
        // Form inputs
        this.elements = {
            clientName: document.getElementById('clientName'),
            birthDate: document.getElementById('birthDate'),
            purchasePrice: document.getElementById('purchasePrice'),
            clientSalary: document.getElementById('clientSalary'),
            spouseSalary: document.getElementById('spouseSalary'),
            duration: document.getElementById('duration'),
            durationSlider: document.getElementById('durationSlider'),
            otherFinancing: document.getElementById('otherFinancing'),
            clientAdvance: document.getElementById('clientAdvance'),
            printLanguage: document.getElementById('printLanguage'),

            // Calculated fields
            totalSalaries: document.getElementById('totalSalaries'),
            financingPossible: document.getElementById('financingPossible'),
            monthlyPayment: document.getElementById('monthlyPayment'),
            incomeRatio: document.getElementById('incomeRatio'),
            totalInstallments: document.getElementById('totalInstallments'),

            // Result boxes
            maxSalaryFinancing: document.getElementById('maxSalaryFinancing'),
            maxSalaryPercentage: document.getElementById('maxSalaryPercentage'),
            maxPriceFinancing: document.getElementById('maxPriceFinancing'),
            maxConvFinancing: document.getElementById('maxConvFinancing'),
            minConvFinancing: document.getElementById('minConvFinancing'),
            finalFinancingPossible: document.getElementById('finalFinancingPossible'),
            finalFinancingPercentage: document.getElementById('finalFinancingPercentage'),

            // Action buttons
            actionButtons: document.querySelectorAll('.action-btn')
        };
    }

    bindEvents() {
        // Input change events
        const inputs = [
            'purchasePrice', 'clientSalary', 'spouseSalary',
            'duration', 'otherFinancing', 'clientAdvance'
        ];

        inputs.forEach(inputId => {
            if (this.elements[inputId]) {
                this.elements[inputId].addEventListener('input', () => this.calculate());
            }
        });

        // Duration slider sync
        this.elements.durationSlider.addEventListener('input', () => {
            this.elements.duration.value = this.elements.durationSlider.value;
            this.calculate();
        });

        this.elements.duration.addEventListener('input', () => {
            this.elements.durationSlider.value = this.elements.duration.value;
            this.calculate();
        });

        // Birth date change for age validation
        this.elements.birthDate.addEventListener('change', () => this.validateAge());

        // Action button events
        this.elements.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.handleSimulationTypeChange(type);
            });
        });

        // Format number inputs on blur
        const numberInputs = [
            'purchasePrice', 'clientSalary', 'spouseSalary', 'otherFinancing', 'clientAdvance'
        ];

        numberInputs.forEach(inputId => {
            if (this.elements[inputId]) {
                this.elements[inputId].addEventListener('blur', (e) => {
                    this.formatNumberInput(e.target);
                });
            }
        });
    }

    calculate() {
        try {
            // Get input values
            const purchasePrice = this.parseNumber(this.elements.purchasePrice.value) || 0;
            const clientSalary = this.parseNumber(this.elements.clientSalary.value) || 0;
            const spouseSalary = this.parseNumber(this.elements.spouseSalary.value) || 0;
            const duration = parseInt(this.elements.duration.value) || 36;
            const otherFinancing = this.parseNumber(this.elements.otherFinancing.value) || 0;
            const clientAdvance = this.parseNumber(this.elements.clientAdvance.value) || 0;

            // Calculate total salaries
            const totalSalaries = clientSalary + spouseSalary;
            this.updateElement('totalSalaries', this.formatCurrency(totalSalaries));

            // Validate minimum salary
            this.validateSalary(totalSalaries);

            // Calculate maximum financing based on salary (8% rule)
            const maxMonthlyPayment = totalSalaries * this.params.maxIncomeRatio;
            const maxSalaryFinancing = this.calculatePrincipalFromPayment(
                maxMonthlyPayment,
                duration
            );

            // Calculate monthly payment for current purchase price
            const netFinancing = Math.max(0, purchasePrice - clientAdvance);
            const monthlyPayment = this.calculateMonthlyPayment(netFinancing, duration);

            // Calculate income ratio
            const incomeRatio = totalSalaries > 0 ? (monthlyPayment / totalSalaries) * 100 : 0;

            // Calculate total installments
            const totalInstallments = monthlyPayment * duration;

            // Determine financing possible (minimum of constraints)
            const constraints = [
                maxSalaryFinancing,
                purchasePrice, // Max based on price (100%)
                this.params.conventionalMax // Conventional maximum
            ];

            const financingPossible = Math.min(...constraints.filter(c => c > 0));
            const financingPossiblePercentage = purchasePrice > 0 ?
                (financingPossible / purchasePrice) * 100 : 0;

            // Update calculated fields
            this.updateElement('monthlyPayment', this.formatCurrency(monthlyPayment));
            this.updateElement('incomeRatio', this.formatPercentage(incomeRatio));
            this.updateElement('totalInstallments', this.formatCurrency(totalInstallments));
            this.updateElement('financingPossible', this.formatCurrency(financingPossible));

            // Update result boxes
            this.updateElement('maxSalaryFinancing', this.formatCurrency(maxSalaryFinancing));
            this.updateElement('maxSalaryPercentage', this.formatPercentage(
                purchasePrice > 0 ? (maxSalaryFinancing / purchasePrice) * 100 : 0
            ));
            this.updateElement('maxPriceFinancing', this.formatCurrency(purchasePrice));
            this.updateElement('maxConvFinancing', this.formatCurrency(this.params.conventionalMax));
            this.updateElement('minConvFinancing', this.formatCurrency(this.params.conventionalMin));
            this.updateElement('finalFinancingPossible', this.formatCurrency(financingPossible));
            this.updateElement('finalFinancingPercentage', this.formatPercentage(financingPossiblePercentage));

            // Validate constraints
            this.validateConstraints({
                totalSalaries,
                incomeRatio,
                duration,
                purchasePrice,
                financingPossible
            });

        } catch (error) {
            console.error('Calculation error:', error);
        }
    }

    calculateMonthlyPayment(principal, months) {
        if (principal <= 0 || months <= 0) return 0;

        const r = this.params.monthlyMarginRate;
        if (r === 0) return principal / months;

        // Murabaha formula: PMT = P * [r * (1 + r)^n] / [(1 + r)^n - 1]
        const factor = Math.pow(1 + r, months);
        return principal * (r * factor) / (factor - 1);
    }

    calculatePrincipalFromPayment(monthlyPayment, months) {
        if (monthlyPayment <= 0 || months <= 0) return 0;

        const r = this.params.monthlyMarginRate;
        if (r === 0) return monthlyPayment * months;

        // Reverse formula: P = PMT * [(1 + r)^n - 1] / [r * (1 + r)^n]
        const factor = Math.pow(1 + r, months);
        return monthlyPayment * (factor - 1) / (r * factor);
    }

    validateAge() {
        const birthDate = new Date(this.elements.birthDate.value);
        if (!birthDate) return true;

        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ? age - 1 : age;

        const isValid = actualAge <= this.params.maxAge;
        this.toggleValidationError('birthDate', !isValid, `Age maximum autorisé: ${this.params.maxAge} ans`);

        return isValid;
    }

    validateSalary(totalSalaries) {
        const isValid = totalSalaries >= this.params.minSalary;
        this.toggleValidationError('clientSalary', !isValid,
            `Salaire minimum requis: ${this.formatCurrency(this.params.minSalary)}`);
        return isValid;
    }

    validateConstraints(data) {
        const errors = [];

        // Check salary minimum
        if (data.totalSalaries < this.params.minSalary) {
            errors.push('Salaire insuffisant');
        }

        // Check income ratio
        if (data.incomeRatio > this.params.maxIncomeRatio * 100) {
            errors.push('Ratio revenu/échéance dépassé (max 8%)');
        }

        // Check duration
        if (data.duration < this.params.minDuration || data.duration > this.params.maxDuration) {
            errors.push(`Durée doit être entre ${this.params.minDuration} et ${this.params.maxDuration} mois`);
        }

        // Visual feedback
        const isValid = errors.length === 0;
        document.body.classList.toggle('has-validation-errors', !isValid);

        return isValid;
    }

    toggleValidationError(fieldId, show, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.nextElementSibling;

        field.classList.toggle('error', show);

        if (show && message) {
            let errorMsg = errorElement && errorElement.classList.contains('validation-error')
                ? errorElement
                : document.createElement('div');

            if (!errorElement || !errorElement.classList.contains('validation-error')) {
                errorMsg.className = 'validation-error';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }

            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        } else if (errorElement && errorElement.classList.contains('validation-error')) {
            errorElement.classList.remove('show');
        }
    }

    handleSimulationTypeChange(type) {
        // Handle different simulation types
        const typeConfig = {
            vehicle: {
                title: 'Simulation d\'achat véhicule',
                maxAmount: 5000000,
                defaultDuration: 60
            },
            property: {
                title: 'Simulation Achat/Location Immobilier',
                maxAmount: 50000000,
                defaultDuration: 180 // 15 years
            },
            equipment: {
                title: 'Simulation d\'achat équipement',
                maxAmount: 2000000,
                defaultDuration: 36
            }
        };

        const config = typeConfig[type];
        if (config) {
            // Update UI for different simulation type
            console.log(`Switching to: ${config.title}`);

            // You could modify form behavior here
            // For now, just log the change
            alert(`Changement vers: ${config.title}`);
        }
    }

    // Utility functions
    parseNumber(value) {
        if (typeof value === 'string') {
            return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
        }
        return parseFloat(value) || 0;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount) + ' DA';
    }

    formatPercentage(value) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value) + '%';
    }

    formatNumberInput(input) {
        const value = this.parseNumber(input.value);
        if (value > 0) {
            input.value = value.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    updateElement(elementId, value) {
        const element = this.elements[elementId];
        if (element) {
            if (element.tagName === 'INPUT') {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set default values
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        birthDateInput.value = '1985-11-06'; // Example date
    }

    const purchasePriceInput = document.getElementById('purchasePrice');
    if (purchasePriceInput) {
        purchasePriceInput.value = '116000';
    }

    const clientSalaryInput = document.getElementById('clientSalary');
    if (clientSalaryInput) {
        clientSalaryInput.value = '50000';
    }

    // Initialize the calculator
    const calculator = new FinancingCalculator();

    // Make calculator globally available for debugging
    window.calculator = calculator;
});

// Additional utility functions for enhanced functionality
function exportResults() {
    const results = {
        timestamp: new Date().toISOString(),
        purchasePrice: document.getElementById('purchasePrice').value,
        totalSalaries: document.getElementById('totalSalaries').value,
        monthlyPayment: document.getElementById('monthlyPayment').textContent,
        financingPossible: document.getElementById('finalFinancingPossible').textContent
    };

    console.log('Simulation Results:', results);
    return results;
}

function printSimulation() {
    window.print();
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        switch (e.key) {
            case 'p':
                e.preventDefault();
                printSimulation();
                break;
            case 'r':
                e.preventDefault();
                location.reload();
                break;
        }
    }
});