let currentFileId = null;

// View file details in modal
async function viewFile(id) {
    try {
        currentFileId = id;
        document.getElementById("loadingOverlay").classList.add("active");

        const response = await fetch(`/financing/get/${id}`);
        const data = await response.json();

        if (data.success) {
            displayFileDetails(data.financing, data.documents);
            document.getElementById("fileModal").classList.add("active");
        } else {
            alert("Erreur lors du chargement des détails");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Erreur lors du chargement des détails");
    } finally {
        document.getElementById("loadingOverlay").classList.remove("active");
    }
}

// Display file details in modal
function displayFileDetails(file, documents) {
    const modalContent = document.getElementById("modalContent");

    const statusText = {
        pending: "En attente",
        processing: "En traitement",
        approved: "Approuvé",
        rejected: "Rejeté",
    };

    modalContent.innerHTML = `
    <div class="modal-section">
      <h3>Informations générales</h3>
      <div class="modal-grid">
        <div class="modal-field">
          <div class="modal-field-label">Référence</div>
          <div class="modal-field-value">${file.reference}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Statut</div>
          <div class="modal-field-value">
            <span class="status status--${file.status}">${
        statusText[file.status]
    }</span>
          </div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Date de création</div>
          <div class="modal-field-value">${new Date(
              file.created_at
          ).toLocaleDateString("fr-FR")}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Validation Admin</div>
          <div class="modal-field-value">${
              file.admin_validated ? "✓ Validé" : "✗ En attente"
          }</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Validation Banque</div>
          <div class="modal-field-value">${
              file.bank_validated ? "✓ Validé" : "✗ En attente"
          }</div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Informations client</h3>
      <div class="modal-grid">
        <div class="modal-field">
          <div class="modal-field-label">Nom complet</div>
          <div class="modal-field-value">${file.client_name}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Téléphone</div>
          <div class="modal-field-value">${file.client_phone}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Email</div>
          <div class="modal-field-value">${file.client_email || "-"}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Date de naissance</div>
          <div class="modal-field-value">${new Date(
              file.birth_date
          ).toLocaleDateString("fr-FR")}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Adresse</div>
          <div class="modal-field-value">${file.address}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Wilaya</div>
          <div class="modal-field-value">${file.wilaya}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Situation familiale</div>
          <div class="modal-field-value">${file.marital_status}</div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Produit</h3>
      <div class="modal-grid">
        <div class="modal-field">
          <div class="modal-field-label">Produit</div>
          <div class="modal-field-value">${file.product_name}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Prix</div>
          <div class="modal-field-value">${file.product_price.toLocaleString(
              "fr-FR"
          )} DZD</div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h3>Informations financières</h3>
      <div class="modal-grid">
        <div class="modal-field">
          <div class="modal-field-label">Salaire client</div>
          <div class="modal-field-value">${file.client_salary.toLocaleString(
              "fr-FR"
          )} DZD</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Salaire conjoint</div>
          <div class="modal-field-value">${file.spouse_salary.toLocaleString(
              "fr-FR"
          )} DZD</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Salaire total</div>
          <div class="modal-field-value">${file.total_salary.toLocaleString(
              "fr-FR"
          )} DZD</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Durée</div>
          <div class="modal-field-value">${file.duration} mois</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Type d'emploi</div>
          <div class="modal-field-value">${file.employment_type}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Autres financements</div>
          <div class="modal-field-value">${file.other_financing.toLocaleString(
              "fr-FR"
          )} DZD</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Mensualité</div>
          <div class="modal-field-value">${file.monthly_payment.toLocaleString(
              "fr-FR"
          )} DZD</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Total à payer</div>
          <div class="modal-field-value">${file.total_payment.toLocaleString(
              "fr-FR"
          )} DZD</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Ratio paiement/salaire</div>
          <div class="modal-field-value">${file.payment_ratio}%</div>
        </div>
        <div class="modal-field">
          <div class="modal-field-label">Éligibilité</div>
          <div class="modal-field-value">${
              file.is_eligible ? "✓ Éligible" : "✗ Non éligible"
          }</div>
        </div>
      </div>
    </div>

    ${
        documents && documents.length > 0
            ? `
      <div class="modal-section">
        <h3>Documents joints</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${documents
              .map(
                  (doc) => `
            <div style="padding: 12px; background: #F5F5F5; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span>${doc.file_name}</span>
              <a href="/${doc.file_path}" target="_blank" class="btn btn--sm btn--outline">Télécharger</a>
            </div>
          `
              )
              .join("")}
        </div>
      </div>
    `
            : ""
    }
  `;
}

// Approve file
async function approveFile(id) {
    if (
        !confirm(
            "Êtes-vous sûr de vouloir valider ce dossier pour approbation finale?"
        )
    ) {
        return;
    }

    try {
        document.getElementById("loadingOverlay").classList.add("active");

        const response = await fetch(`/bank/approve/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
            alert("Dossier approuvé avec succès!");
            location.reload();
        } else {
            alert("Erreur: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Erreur lors de l'approbation");
    } finally {
        document.getElementById("loadingOverlay").classList.remove("active");
    }
}

// Reject file
async function rejectFile(id) {
    const reason = prompt("Raison du rejet (optionnel):");
    if (reason === null) return;

    try {
        document.getElementById("loadingOverlay").classList.add("active");

        const response = await fetch(`/bank/reject/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Dossier rejeté");
            location.reload();
        } else {
            alert("Erreur: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Erreur lors du rejet");
    } finally {
        document.getElementById("loadingOverlay").classList.remove("active");
    }
}

// Approve from modal
function approveFromModal() {
    if (currentFileId) {
        closeModal();
        approveFile(currentFileId);
    }
}

// Reject from modal
function rejectFromModal() {
    if (currentFileId) {
        closeModal();
        rejectFile(currentFileId);
    }
}

// Close modal
function closeModal() {
    document.getElementById("fileModal").classList.remove("active");
    currentFileId = null;
}

// Close modal on outside click
document.getElementById("fileModal")?.addEventListener("click", function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close with Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeModal();
    }
});