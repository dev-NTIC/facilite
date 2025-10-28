const FinancingModel = require("../models/financingModel");

exports.renderCreatePage = (req, res) => {
    console.log("calling create PAGE");
    res.render("create-financing", {
        title: "Nouvelle demande de financement",
        user: req.session.user,
    });
};

exports.createFinancing = async(req, res) => {
    try {
        console.log("=== RECEIVED DATA ===");
        console.log("Body:", req.body);
        console.log("Files:", req.files);

        const {
            productId,
            productName,
            productPrice,
            fullName,
            birthDate,
            phone,
            email,
            address,
            wilaya,
            maritalStatus,
            clientSalary,
            spouseSalary,
            duration,
            employmentType,
            otherFinancing,
            monthlyPayment,
            totalPayment,
            paymentRatio,
            isEligible,
        } = req.body;

        // Validate required fields
        if (!productId || !productName || !fullName || !birthDate || !phone) {
            return res.status(400).json({
                success: false,
                error: "Champs obligatoires manquants",
            });
        }

        const reference = await FinancingModel.generateReference();

        const financingData = {
            reference,
            client_name: fullName,
            client_phone: phone,
            client_email: email || null,
            birth_date: birthDate,
            address,
            wilaya,
            marital_status: maritalStatus,
            product_id: parseInt(productId),
            product_name: productName,
            product_price: parseFloat(productPrice),
            client_salary: parseFloat(clientSalary),
            spouse_salary: parseFloat(spouseSalary) || 0,
            total_salary: parseFloat(clientSalary) + (parseFloat(spouseSalary) || 0),
            duration: parseInt(duration),
            employment_type: employmentType,
            other_financing: parseFloat(otherFinancing) || 0,
            monthly_payment: parseFloat(monthlyPayment),
            total_payment: parseFloat(totalPayment),
            payment_ratio: parseFloat(paymentRatio),
            is_eligible: isEligible === "true",
        };

        console.log("=== FINANCING DATA ===");
        console.log(financingData);

        const financingId = await FinancingModel.createFinancing(financingData);

        // Handle file uploads
        if (req.files && Object.keys(req.files).length > 0) {
            const documents = [];

            for (const [fieldName, files] of Object.entries(req.files)) {
                for (const file of files) {
                    documents.push({
                        financing_id: financingId,
                        document_type: getDocumentType(fieldName),
                        file_name: file.originalname,
                        file_path: file.path,
                    });
                }
            }

            if (documents.length > 0) {
                await FinancingModel.saveDocuments(documents);
            }
        }

        // Redirect to dashboard with success message
        res.redirect("/dashboard?success=true&reference=" + reference);
    } catch (error) {
        console.error("Create financing error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

function getDocumentType(fieldName) {
    const typeMap = {
        cni: "cni",
        payslips: "payslip",
        work_certificate: "work_certificate",
        other_documents: "other",
    };
    return typeMap[fieldName] || "other";
}

exports.getFinancingByPhone = async(req, res) => {
    try {
        const { phone } = req.body;
        const files = await FinancingModel.getFinancingByPhone(phone);
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getFinancingById = async(req, res) => {
    try {
        const { id } = req.params;
        const financing = await FinancingModel.getFinancingById(id);
        const documents = await FinancingModel.getDocumentsByFinancingId(id);

        res.render("financing-details", {
            title: `Dossier ${financing.reference}`,
            user: req.session.user,
            financing,
            documents,
        });
    } catch (error) {
        res.status(500).send("Erreur: " + error.message);
    }
};

exports.updateStatus = async(req, res) => {
    try {
        const { id, status } = req.body;
        await FinancingModel.updateStatus(id, status);
        res.json({ success: true, message: "Statut mis à jour" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

function getDocumentType(fieldName) {
    const typeMap = {
        cni: "cni",
        payslips: "payslip",
        work_certificate: "work_certificate",
        other_documents: "other",
    };
    return typeMap[fieldName] || "other";
}

exports.getFinancingDetails = async(req, res) => {
    try {
        const { id } = req.params;

        const financing = await FinancingModel.getFinancingById(id);
        const documents = await FinancingModel.getDocumentsByFinancingId(id);

        if (!financing) {
            return res.status(404).json({
                success: false,
                error: "Dossier non trouvé",
            });
        }

        res.json({
            success: true,
            financing,
            documents,
        });
    } catch (error) {
        console.error("Get financing details error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};