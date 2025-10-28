let isEditMode = false;

// Open add product modal
function openAddProductModal() {
    isEditMode = false;
    document.getElementById("modalTitle").textContent = "Ajouter un produit";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productActive").checked = true;
    document.getElementById("productModal").classList.add("active");
}

// Open edit product modal
async function openEditProductModal(id) {
    try {
        isEditMode = true;
        document.getElementById("loadingOverlay").classList.add("active");

        const response = await fetch(`/admin/products/get/${id}`);
        const data = await response.json();

        if (data.success) {
            const product = data.product;
            document.getElementById("modalTitle").textContent =
                "Modifier le produit";
            document.getElementById("productId").value = product.id;
            document.getElementById("productName").value = product.name;
            document.getElementById("productDescription").value =
                product.description || "";
            document.getElementById("productPrice").value = product.price;
            document.getElementById("productMonthly").value =
                product.monthly_price_36 || "";
            document.getElementById("productSpecs").value =
                product.specifications || "";
            document.getElementById("productActive").checked =
                product.is_active;
            document.getElementById("productModal").classList.add("active");
        } else {
            alert("Erreur lors du chargement du produit");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Erreur lors du chargement du produit");
    } finally {
        document.getElementById("loadingOverlay").classList.remove("active");
    }
}

// Close product modal
function closeProductModal() {
    document.getElementById("productModal").classList.remove("active");
}

// Handle form submission
document
    .getElementById("productForm")
    .addEventListener("submit", async function(e) {
        e.preventDefault();

        const productData = {
            name: document.getElementById("productName").value,
            description: document.getElementById("productDescription").value,
            price: document.getElementById("productPrice").value,
            monthly_price_36: document.getElementById("productMonthly").value,
            specifications: document.getElementById("productSpecs").value,
            is_active: document.getElementById("productActive").checked,
        };

        try {
            document.getElementById("loadingOverlay").classList.add("active");

            let response;
            if (isEditMode) {
                const id = document.getElementById("productId").value;
                response = await fetch(`/admin/products/update/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });
            } else {
                response = await fetch("/admin/products/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });
            }

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert("Erreur: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Erreur lors de l'enregistrement");
        } finally {
            document
                .getElementById("loadingOverlay")
                .classList.remove("active");
        }
    });

// Delete product
async function deleteProduct(id) {
    if (!confirm(
            "Êtes-vous sûr de vouloir supprimer ce produit?\n\nNote: Vous ne pouvez pas supprimer un produit utilisé dans des dossiers de financement."
        )) {
        return;
    }

    try {
        document.getElementById("loadingOverlay").classList.add("active");

        const response = await fetch(`/admin/products/delete/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert("Erreur: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Erreur lors de la suppression");
    } finally {
        document.getElementById("loadingOverlay").classList.remove("active");
    }
}

// Close modal on outside click
document.getElementById("productModal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeProductModal();
    }
});

// Close with Escape key
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeProductModal();
    }
});