document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    const totalSteps = 4;
    let billingType = "monthly"; // or 'yearly'

    let selectedPlan = null;
    let selectedAddOns = [];

    const planPrices = {
        arcade: { monthly: 9, yearly: 90 },
        advanced: { monthly: 12, yearly: 120 },
        pro: { monthly: 15, yearly: 150 },
    };

    const addonPrices = {
        online: { label: "Online Services", monthly: 1, yearly: 10 },
        storage: { label: "Larger Storage", monthly: 2, yearly: 20 },
        profile: { label: "Customizable Profile", monthly: 2, yearly: 20 },
    };

    function showStep(step) {
        document.querySelectorAll(".step-content").forEach(el => el.classList.remove("active"));
        document.getElementById(`step-${step}`).classList.add("active");

        document.querySelectorAll(".step").forEach(el => el.classList.remove("active"));
        document.querySelector(`.step[data-step='${step}']`).classList.add("active");

        if (step === 4) updateSummary();
    }

    function updatePlanPricing() {
        Object.keys(planPrices).forEach(plan => {
            const card = document.querySelector(`.plan-card[data-plan="${plan}"]`);
            const priceSpan = card.querySelector(".price");
            const bonusSpan = card.querySelector(".bonus");

            priceSpan.textContent = `$${planPrices[plan][billingType]}/${billingType === "monthly" ? "mo" : "yr"}`;
            bonusSpan.style.display = billingType === "yearly" ? "block" : "none";
        });
    }

    // Step 2 - Plan selection
    document.querySelectorAll(".plan-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".plan-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedPlan = card.getAttribute("data-plan");
        });
    });

    // Step 3 - Add-on selection
    document.querySelectorAll(".addon-card").forEach(card => {
        card.addEventListener("click", () => {
            const addon = card.getAttribute("data-addon");
            if (selectedAddOns.includes(addon)) {
                selectedAddOns = selectedAddOns.filter(item => item !== addon);
                card.classList.remove("selected");
            } else {
                selectedAddOns.push(addon);
                card.classList.add("selected");
            }
        });
    });

    // Step Navigation
    document.getElementById("next-step-1").addEventListener("click", function () {
        if (validateStep1()) {
            currentStep = 2;
            showStep(currentStep);
        }
    });

    document.getElementById("next-step-2").addEventListener("click", function () {
        currentStep = 3;
        showStep(currentStep);
    });

    document.getElementById("next-step-3").addEventListener("click", function () {
        currentStep = 4;
        showStep(currentStep);
    });

    document.getElementById("back-step-2").addEventListener("click", () => showStep(1));
    document.getElementById("back-step-3").addEventListener("click", () => showStep(2));
    document.getElementById("back-step-4").addEventListener("click", () => showStep(3));

    document.getElementById("billing-toggle").addEventListener("change", function () {
        billingType = this.checked ? "yearly" : "monthly";
        updatePlanPricing();
    });

    // Step 4 - Summary
    function updateSummary() {
        const summaryContainer = document.getElementById("summary-content");
        summaryContainer.innerHTML = "";

        let total = 0;

        // Plan Summary
        if (selectedPlan && planPrices[selectedPlan]) {
            const planLabel = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
            const planPrice = planPrices[selectedPlan][billingType];
            total += planPrice;

            summaryContainer.innerHTML += `
                <div class="summary-item">
                    <p><strong>Plan:</strong> ${planLabel}</p>
                    <p>$${planPrice}/${billingType === "monthly" ? "mo" : "yr"}</p>
                </div>
            `;
        }

        // Add-On Summary
        if (selectedAddOns.length > 0) {
            summaryContainer.innerHTML += `<h3>Selected Add-ons:</h3>`;
            selectedAddOns.forEach(addon => {
                const addonInfo = addonPrices[addon];
                if (addonInfo) {
                    const price = addonInfo[billingType];
                    total += price;
                    summaryContainer.innerHTML += `
                        <div class="summary-item">
                            <p><strong>${addonInfo.label}</strong></p>
                            <p>+$${price}/${billingType === "monthly" ? "mo" : "yr"}</p>
                        </div>
                    `;
                }
            });
        }

        summaryContainer.innerHTML += `
            <hr>
            <div class="summary-item">
                <p><strong>Total:</strong></p>
                <p><strong  class="total-price">$${total}/${billingType === "monthly" ? "mo" : "yr"}</strong></p>
            </div>
        `;
    }

    updatePlanPricing();
    showStep(currentStep);
});

// Confirm button action
document.getElementById("confirm").addEventListener("click", function () {
    document.querySelector("h2").style.display = "none";
    document.querySelector("p").style.display = "none";
    document.getElementById("summary-content").style.display = "none";
    document.getElementById("back-step-4").style.display = "none";
    document.getElementById("confirm").style.display = "none";

    document.getElementById("confirmation-message").classList.remove("hidden");
});

// Validation for Step 1
function validateStep1() {
    let isValid = true;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const namePattern = /^[a-zA-Z\s]+$/;
    const phonePattern = /^[0-9]{11}$/;

    document.getElementById("name-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("phone-error").textContent = "";
    document.getElementById("general-error").textContent = "";

    if (!name || !namePattern.test(name)) {
        document.getElementById("name-error").textContent = "Enter a valid name.";
        isValid = false;
    }

    if (!email.includes("@")) {
        document.getElementById("email-error").textContent = "Enter a valid email.";
        isValid = false;
    }

    if (!phonePattern.test(phone)) {
        document.getElementById("phone-error").textContent = "Enter a 11-digit phone number.";
        isValid = false;
    }

    if (!isValid) {
        document.getElementById("general-error").textContent = "Please fix the errors and try again.";
    }

    return isValid;
}

document.getElementById("confirm").addEventListener("click", function () {
    // Hide everything except confirmation message and image
    const step4Content = document.getElementById("step-4");

    // Hide all children inside step-4
    Array.from(step4Content.children).forEach(child => {
        if (child.id !== "confirmation-message") {
            child.style.display = "none";
        }
    });

    // Show the confirmation message
    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.classList.remove("hidden");
});