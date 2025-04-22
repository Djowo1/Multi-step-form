document.addEventListener("DOMContentLoaded", function () {
    let currentStep = 1;
    let maxReachedStep = 1;

    const totalSteps = 4;
    let billingType = "monthly";

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
        const checkbox = card.querySelector('input[type="checkbox"]');
        const addon = card.getAttribute("data-addon");
    
        card.addEventListener("click", () => {
            // Toggle checkbox
            checkbox.checked = !checkbox.checked;
    
            if (checkbox.checked) {
                if (!selectedAddOns.includes(addon)) {
                    selectedAddOns.push(addon);
                }
                card.classList.add("selected");
            } else {
                selectedAddOns = selectedAddOns.filter(item => item !== addon);
                card.classList.remove("selected");
            }
        });

        // Clear error messages when user starts typing
["name", "email", "phone"].forEach((field) => {
    const input = document.getElementById(field);
    const errorElement = document.getElementById(`${field}-error`);
    
    input.addEventListener("input", () => {
        errorElement.textContent = "";
        document.getElementById("general-error").textContent = "";
    });
});

    });
    
    // Step Navigation
    document.getElementById("next-step-1").addEventListener("click", function () {
        if (validateStep1()) {
            currentStep = 2;
            showStep(currentStep);
            maxReachedStep = Math.max(maxReachedStep, currentStep);
        showStep(currentStep);
        }
    });

    document.getElementById("next-step-2").addEventListener("click", function () {
        if (!selectedPlan) {
            alert("Please choose a plan");
            return;
        }
    
        currentStep = 3;
        showStep(currentStep);
        maxReachedStep = Math.max(maxReachedStep, currentStep);
    
    });

    document.getElementById("back-step-2").addEventListener("click", function () {
        currentStep = 1;
        showStep(currentStep);
        maxReachedStep = Math.max(maxReachedStep, currentStep);
        showStep(currentStep);
    });

    document.getElementById("next-step-3").addEventListener("click", function () {
        currentStep = 4;
        showStep(currentStep);
        maxReachedStep = Math.max(maxReachedStep, currentStep);
        showStep(currentStep);
    });

    document.getElementById("back-step-3").addEventListener("click", function () {
        currentStep = 2;
        showStep(currentStep);
    });

    document.getElementById("back-step-4").addEventListener("click", function () {
        currentStep = 3;
        showStep(currentStep);
    });


    const billingToggle = document.getElementById("billing-toggle");

    billingToggle.addEventListener("change", function () {
        billingType = this.checked ? "yearly" : "monthly";
        updatePlanPricing();
        updateToggleLabelStyles();
    });
    
    function updateToggleLabelStyles() {
        const labels = document.querySelectorAll(".toggle-container .nice");
        const [monthlyLabel, yearlyLabel] = labels;
    
        if (billingType === "monthly") {
            monthlyLabel.classList.add("active");
            yearlyLabel.classList.remove("active");
        } else {
            yearlyLabel.classList.add("active");
            monthlyLabel.classList.remove("active");
        }
    }
    
    updateToggleLabelStyles();
    
    
    // Step 4 - Summary
    function updateSummary() {
        const summaryContainer = document.getElementById("summary-content");
        summaryContainer.innerHTML = "";
    
        let total = 0;
    
        // Plan Summary with "Change" link
        if (selectedPlan && planPrices[selectedPlan]) {
            const planLabel = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
            const planPrice = planPrices[selectedPlan][billingType];
            total += planPrice;
    
            summaryContainer.innerHTML += `
                <div class="summary-plan">
                    <div>
                        <p class="plan-label"><strong>${planLabel} (${billingType.charAt(0).toUpperCase() + billingType.slice(1)})</strong></p>
                        <button id="change-plan" class="change-link">Change</button>
                    </div>
                    <p class="plan-price"><strong>$${planPrice}/${billingType === "monthly" ? "mo" : "yr"}</strong></p>
                </div>
                <hr>
            `;
        }
    
        // Add-On Summary
        const currentAddOns = getSelectedAddOns();
        if (currentAddOns.length > 0) {
            currentAddOns.forEach(addon => {
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
    
        // Total Summary
        summaryContainer.innerHTML += `
            <div class="summary-total">
                <p>Total (per ${billingType === "monthly" ? "month" : "year"})</p>
                <p class="total-price">+$${total}/${billingType === "monthly" ? "mo" : "yr"}</p>
            </div>
        `;
    
        const changeBtn = document.getElementById("change-plan");
        if (changeBtn) {
            changeBtn.addEventListener("click", () => {
                currentStep = 2;
                showStep(currentStep);
            });
        }
    }

    updatePlanPricing();
    showStep(currentStep);

   // ✅ Enable clicking between current and previous steps until confirmation is shown
let hasConfirmed = false; 

document.querySelectorAll(".step").forEach(step => {
    step.addEventListener("click", function () {
        if (hasConfirmed) return;

        const clickedStep = parseInt(step.getAttribute("data-step"));

        if (clickedStep <= maxReachedStep) {
            currentStep = clickedStep;
            showStep(currentStep);
        }
    });
});

// Confirm button action
document.getElementById("confirm").addEventListener("click", function () {
    const step4Content = document.getElementById("step-4");

    Array.from(step4Content.children).forEach(child => {
        if (child.id !== "confirmation-message") {
            child.style.display = "none";
        }
    });

    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.classList.remove("hidden");

    hasConfirmed = true; 
});

// Validation for Step 1function validateStep1() {
    function validateStep1() {
        let isValid = true;
    
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const phoneInput = document.getElementById("phone");
    
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
    
        const namePattern = /^[a-zA-Z\s]+$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{11}$/;
    
        const nameError = document.getElementById("name-error");
        const emailError = document.getElementById("email-error");
        const phoneError = document.getElementById("phone-error");
        const generalError = document.getElementById("general-error");
    
        // Reset errors
        nameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        generalError.textContent = "";
    
        if (!name) {
            nameError.textContent = "This field is required.";
            isValid = false;
        } else if (!namePattern.test(name)) {
            nameError.textContent = "Please enter a valid name.";
            isValid = false;
        }
    
        if (!email) {
            emailError.textContent = "This field is required.";
            isValid = false;
        } else if (!emailPattern.test(email)) {
            emailError.textContent = "Enter a valid email address.";
            isValid = false;
        }
    
        if (!phone) {
            phoneError.textContent = "This field is required.";
            isValid = false;
        } else if (!/^\d+$/.test(phone)) {
            phoneError.textContent = "Please enter a valid phone number.";
            isValid = false;
        } else if (phone.length !== 11) {
            phoneError.textContent = "Please enter 11-digits only.";
            isValid = false;
        }
    
        if (!isValid) {
            generalError.textContent = "Please fix the errors and try again.";
        }
    
        return isValid;
    }
    

function getSelectedAddOns() {
    const selected = [];
    document.querySelectorAll('.addon-checkbox:checked').forEach(cb => {
        selected.push(cb.dataset.addon);
    });
    return selected;
}

});