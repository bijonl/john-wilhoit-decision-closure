/* =====================================================
   GLOBAL VARIABLES AND DOM REFERENCES
===================================================== */

/* ---------- Form and navigation ---------- */

const dcForm = document.getElementById("dc-form");

const sections = Array.from(
    document.querySelectorAll("#dc-form .form-section")
);

const activeSection = document.querySelector(
    ".form-section.active-section"
);

const app = document.getElementById("dk-app");


/* ---------- Record identification ---------- */

// // Generate one record ID for this page session.
// const recordId = `WAT-${Date.now()}-${Math.random()
//     .toString(36)
//     .slice(2, 7)
//     .toUpperCase()}`;

const closedRecordIdOutput = document.getElementById(
    "dc-closed-record-id"
);

const closedRecordTimestampOutput = document.getElementById(
    "dc-closed-record-timestamp"
);


/* ---------- Required acknowledgements ---------- */

const REQUIRED_CHECKBOX_IDS = [
    "dc-ack-consequence-accepted",
    "dc-ack-decision-basis",
    "dc-ack-final-closure"
];


/* ---------- Proposed action and conditional fields ---------- */

const actionRadios = document.querySelectorAll(
    'input[name="proposedAction"]'
);

const modifyFields = document.getElementById("dc-modify-fields");
const deferFields = document.getElementById("dc-defer-fields");

const modifyInputs = modifyFields?.querySelectorAll("textarea") ?? [];
const deferInputs = deferFields?.querySelectorAll("textarea") ?? [];

const riskQuestion = document.getElementById("dc-risk-question");
const consequenceQuestion = document.getElementById(
    "dc-consequence-question"
);

const finalAction = document.getElementById("dc-final-action");
const statedConsequence = document.getElementById("dc-final-consequence");

const consequenceAcceptanceField = document.getElementById(
    "dc-consequence-acceptance-field"
);

const consequenceInput = document.getElementById(
    "dc-consequenceStatement"
);

const approvalAuthorityInput = document.getElementById(
    "dc-approvalAuthority"
);

const approvalAuthority = document.getElementById(
    "dc-final-approval-authority"
);


/* ---------- Risk repeater ---------- */

const riskEntries = document.getElementById("dc-risk-entries");
const riskEntriesContainer = riskEntries;
const addRiskButton = document.getElementById("dc-add-risk");

const acceptedRisksOutput = document.getElementById(
    "record-accepted-risks"
);


/* ---------- Conditions repeater ---------- */

const conditionsContainer = document.getElementById(
    "dc-condition-register"
);

const conditionRegister = conditionsContainer;

const addConditionButton = document.getElementById("dc-add-condition");

const conditionTemplate = document.getElementById(
    "dc-condition-template"
);

const noConditionsCheckbox = document.getElementById(
    "dc-no-unresolved-conditions"
);

const nextConditionsButton = document.querySelector(
    "#decision-closure-conditions-section .section-next"
);

const recordNoConditions = document.getElementById("record-no-conditions");

const recordConditionEntries = document.getElementById(
    "record-condition-entries"
);

let conditionCounter = 0;


/* ---------- Recovery fields ---------- */

const recoveryField = document.getElementById("dc-recovery");

const recoveryInput = recoveryField;

const recoveryReasonField = document.getElementById(
    "dc-recovery-reason-field"
);

const recoveryReasonInput = document.getElementById(
    "dc-recovery-not-applicable-reason"
);

const recoveryReason = recoveryReasonInput;

const recoveryReasonInputElement = recoveryReasonInput;

const recoveryNotApplicable = document.getElementById(
    "dc-recovery-not-applicable"
);

const recoveryOutput = document.getElementById("record-recovery");


/* ---------- Assumptions repeater ---------- */

const assumptionsContainer = document.getElementById(
    "assumption-container"
);

const assumptionContainer = assumptionsContainer;

const addAssumptionButton = document.getElementById(
    "dc-add-assumption"
);

const noAssumptionsCheckbox = document.getElementById(
    "dc-no-assumptions"
);

const assumptionsOutput = document.getElementById("record-assumptions");


/* ---------- Decision details and review outputs ---------- */

const decisionDetailFields = [
    {
        input: "dc-dealReference",
        output: "record-deal-reference"
    },
    {
        input: "dc-propertyIdentifier",
        output: "record-property-identifier"
    },
    {
        input: "dc-date",
        output: "record-decision-date",
        type: "date"
    },
    {
        input: "dc-fundingDate",
        output: "record-funding-date",
        type: "date"
    },
    {
        input: "dc-decisionOwner",
        output: "record-decision-owner"
    },
    {
        input: "dc-approvalAuthority",
        output: "record-approval-authority"
    }
];

const capitalEventRadios = document.querySelectorAll(
    'input[name="capitalEvent"]'
);

const capitalEventOutput = document.getElementById("record-capital-event");

const proposedActionRadios = document.querySelectorAll(
    'input[name="proposedAction"]'
);

const proposedActionOutput = document.getElementById(
    "record-proposed-action"
);

const materialEvidenceInput = document.getElementById(
    "dc-materialEvidence"
);

const materialEvidenceOutput = document.getElementById(
    "record-material-evidence"
);

const consequenceQuestionInput = document.getElementById(
    "dc-consequence-question"
);

const recordConsequenceQuestion = document.getElementById(
    "record-consequence-question"
);

const recordConsequence = document.getElementById("record-consequence");

const decisionBasisInput = document.getElementById("dc-decisionBasis");

const decisionBasisOutput = document.getElementById(
    "record-decision-basis"
);

const accountabilityApprovalAuthorityOutput = document.getElementById(
    "record-accountability-approval-authority"
);

const confirmingPersonInput = document.getElementById("dc-confirmingPerson");

const confirmingPersonOutput = document.getElementById(
    "record-confirming-person"
);


/* ---------- Stage 1 summary outputs ---------- */

const stage1RecordIdOutput = document.getElementById(
    "byw-stage1-record-id"
);

const transactionSummaryOutput = document.getElementById("byw-transaction");

const actionSummaryOutput = document.getElementById("byw-action");

const decisionDateSummaryOutput = document.getElementById(
    "byw-decision-date"
);

const consequenceSummaryOutput = document.getElementById(
    "byw-consequence"
);

const assumptionsSummaryOutput = document.getElementById(
    "byw-assumptions"
);

const conditionCountsOutput = document.getElementById(
    "byw-condition-counts"
);


/* ---------- Observers ---------- */

let riskObserver;
let conditionReviewObserver;
let consequenceQuestionObserver;
let assumptionObserver;
let summaryObserver;


/* =====================================================
   1. VALIDATION HELPERS
===================================================== */

// Determine whether a field is currently relevant to validation.
function isFieldActive(field) {
    if (!field || field.disabled) {
        return false;
    }

    if (
        field.closest("template") ||
        field.closest("[hidden]") ||
        field.closest('[aria-hidden="true"]') ||
        field.offsetParent === null
    ) {
        return false;
    }

    return true;
}


// Check whether a field contains a non-whitespace value.
function isBlank(field) {
    return !String(field.value ?? "").trim();
}


// Retrieve a readable field label for validation messages.
function getFieldLabel(field) {
    const label = field.closest("label");

    if (label) {
        return (
            label.querySelector(".field-label")?.textContent.trim() ||
            label.textContent.trim() ||
            field.name ||
            "Required field"
        );
    }

    const wrapper = field.closest(".form-field");

    return (
        wrapper?.querySelector(".field-label")?.textContent.trim() ||
        field.name ||
        "Required field"
    );
}


// Add or remove invalid styling and accessibility attributes.
function markFieldInvalid(field, invalid) {
    if (!field) {
        return;
    }

    const wrapper = field.closest(".form-field");

    if (wrapper) {
        wrapper.classList.toggle("field-invalid", invalid);
    }

    if (invalid) {
        field.setAttribute("aria-invalid", "true");
    } else {
        field.removeAttribute("aria-invalid");
    }
}


/* =====================================================
   2. CONDITIONAL FIELD VALIDATION
===================================================== */

function validateConditionalFields(section, errors) {
    const action = section.querySelector(
        'input[name="proposedAction"]:checked'
    )?.value;


    // MODIFY: require the material change and modification condition.
    if (
        section.id === "decision-closure-action-section" &&
        action === "modify"
    ) {
        ["dc-materialChange", "dc-modifyCondition"].forEach(id => {
            const field = document.getElementById(id);

            if (field && isFieldActive(field) && isBlank(field)) {
                errors.push({
                    field,
                    message: `${getFieldLabel(field)} is required.`
                });
            }
        });
    }


    // DEFER: require the reconsideration requirements.
    if (
        section.id === "decision-closure-action-section" &&
        action === "defer"
    ) {
        const field = document.getElementById(
            "dc-reconsiderationRequirements"
        );

        if (field && isFieldActive(field) && isBlank(field)) {
            errors.push({
                field,
                message: `${getFieldLabel(field)} is required.`
            });
        }
    }


    // RECOVERY: require either a recovery plan or a reason
    // explaining why recovery is not applicable.
    if (section.id === "decision-closure-recovery-section") {
        if (recoveryNotApplicable?.checked) {
            if (
                recoveryReasonInput &&
                isFieldActive(recoveryReasonInput) &&
                isBlank(recoveryReasonInput)
            ) {
                errors.push({
                    field: recoveryReasonInput,
                    message: "Explain why recovery is not applicable."
                });
            }
        } else if (
            recoveryInput &&
            isFieldActive(recoveryInput) &&
            isBlank(recoveryInput)
        ) {
            errors.push({
                field: recoveryInput,
                message:
                    'Provide a recovery plan or select "Recovery is not applicable".'
            });
        }
    }


    // CONDITIONS: validate conditional fields on each condition card.
    section.querySelectorAll("[data-condition-card]").forEach(card => {
        const timing = card.querySelector(
            '[data-field="timing"]:checked'
        )?.value;

        const status = card.querySelector(
            '[data-field="status"]:checked'
        )?.value;


        // Accepted-exception classifications require acceptance details.
        if (timing === "accepted-exception") {
            card.querySelectorAll(
                "[data-accepted-fields] input, [data-accepted-fields] textarea"
            ).forEach(field => {
                if (isFieldActive(field) && isBlank(field)) {
                    errors.push({
                        field,
                        message: `${getFieldLabel(field)} is required.`
                    });
                }
            });
        }


        // Resolved conditions require an explanation.
        if (["satisfied", "waived", "failed", "changed"].includes(status)) {
            card.querySelectorAll(
                "[data-resolution-fields] textarea, [data-resolution-fields] input"
            ).forEach(field => {
                if (isFieldActive(field) && isBlank(field)) {
                    errors.push({
                        field,
                        message: `${getFieldLabel(field)} is required.`
                    });
                }
            });
        }


        // Changed classifications require a reclassification explanation.
        if (status === "changed") {
            card.querySelectorAll(
                "[data-reclassification-fields] textarea, [data-reclassification-fields] input"
            ).forEach(field => {
                if (isFieldActive(field) && isBlank(field)) {
                    errors.push({
                        field,
                        message: `${getFieldLabel(field)} is required.`
                    });
                }
            });
        }
    });
}


/* =====================================================
   3. REPEATABLE ENTRY VALIDATION
===================================================== */

function validateRepeatableFields(section, errors) {

    // RISKS: require at least one risk entry and complete values.
    if (section.id === "decision-closure-evidence-section") {
        const risks = Array.from(
            section.querySelectorAll('textarea[name="acceptedRisks[]"]')
        ).filter(isFieldActive);

        if (!risks.length || risks.some(isBlank)) {
            risks.filter(isBlank).forEach(field => {
                errors.push({
                    field,
                    message:
                        'Complete each risk entry, or enter "None identified".'
                });
            });

            if (!risks.length) {
                errors.push({
                    field: section.querySelector("#dc-add-risk"),
                    message:
                        'Add a risk entry and describe the known risks, or enter "None identified".'
                });
            }
        }
    }


    // CONDITIONS: either confirm none exist or provide at least one card.
    if (section.id === "decision-closure-conditions-section") {
        if (noConditionsCheckbox?.checked) {
            return;
        }

        const cards = Array.from(
            section.querySelectorAll("[data-condition-card]")
        );

        if (!cards.length) {
            errors.push({
                field: section.querySelector("#dc-add-condition"),
                message:
                    "Add at least one condition, or confirm that no unresolved conditions exist."
            });
        }
    }


    // ASSUMPTIONS: require entries unless none have been identified.
    if (section.id === "decision-closure-recovery-section") {
        if (noAssumptionsCheckbox?.checked) {
            return;
        }

        const assumptions = Array.from(
            section.querySelectorAll('textarea[name="keyAssumptions[]"]')
        ).filter(isFieldActive);

        if (!assumptions.length) {
            errors.push({
                field: section.querySelector("#dc-add-assumption"),
                message:
                    "Add an assumption or confirm that none have been identified."
            });
        } else {
            assumptions.filter(isBlank).forEach(field => {
                errors.push({
                    field,
                    message:
                        'Complete each assumption entry, or select "None identified".'
                });
            });
        }
    }
}


/* =====================================================
   4. SECTION COMPLETENESS VALIDATION
===================================================== */

function getSectionErrors(section) {
    const errors = [];

    if (!section) {
        return errors;
    }


    // Validate ordinary fields. Conditional and repeatable fields
    // are handled separately below.
    const fields = section.querySelectorAll(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="radio"]):not([type="checkbox"]), textarea, select'
    );

    fields.forEach(field => {
        if (!isFieldActive(field)) {
            return;
        }

        if (
            field.matches('[data-field="waiverScope"]') ||
            field.id === "dc-recovery" ||
            field.name === "keyAssumptions[]" ||
            field.name === "acceptedRisks[]" ||
            field.closest("[data-resolution-fields]") ||
            field.closest("[data-accepted-fields]") ||
            field.closest("[data-reclassification-fields]")
        ) {
            return;
        }

        if (isBlank(field)) {
            errors.push({
                field,
                message: `${getFieldLabel(field)} is required.`
            });
        }
    });


    // RADIO GROUPS: every active group needs a selection.
    const radioGroups = new Map();

    section.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (!isFieldActive(radio)) {
            return;
        }

        if (!radioGroups.has(radio.name)) {
            radioGroups.set(radio.name, []);
        }

        radioGroups.get(radio.name).push(radio);
    });

    radioGroups.forEach(radios => {
        if (!radios.some(radio => radio.checked)) {
            errors.push({
                field: radios[0],
                message: `Select an option for ${getFieldLabel(radios[0])}.`
            });
        }
    });


    // ACKNOWLEDGEMENTS: validate designated mandatory checkboxes.
    REQUIRED_CHECKBOX_IDS.forEach(id => {
        const checkbox = section.querySelector(`#${id}`);

        if (checkbox && isFieldActive(checkbox) && !checkbox.checked) {
            errors.push({
                field: checkbox,
                message: `${getFieldLabel(checkbox)} must be checked.`
            });
        }
    });


    validateConditionalFields(section, errors);
    validateRepeatableFields(section, errors);

    return errors;
}


function isSectionComplete(section) {
    return getSectionErrors(section).length === 0;
}


/* =====================================================
   5. SECTION DISPLAY AND NAVIGATION
===================================================== */

function showSection(section) {
    if (!section) {
        return;
    }

    sections.forEach(item => {
        item.classList.remove("active-section");
    });

    section.classList.add("active-section");

    updateAllNavigation();

    if (app) {
        window.scrollTo({
            top: app.offsetTop,
            behavior: "smooth"
        });
    }
}


function updateSectionNavigation(section) {
    if (!section) {
        return;
    }

    const nextButton = section.querySelector(
        ".section-navigation .section-next"
    );

    if (nextButton) {
        nextButton.disabled = !isSectionComplete(section);

        nextButton.setAttribute(
            "aria-disabled",
            String(nextButton.disabled)
        );
    }


    section.querySelectorAll(
        ".section-navigation button[data-go-to]"
    ).forEach(button => {
        const target = document.getElementById(button.dataset.goTo);

        if (!target) {
            return;
        }

        const currentIndex = sections.indexOf(section);
        const targetIndex = sections.indexOf(target);

        if (targetIndex > currentIndex) {
            button.disabled = !isSectionComplete(section);

            button.setAttribute(
                "aria-disabled",
                String(button.disabled)
            );
        } else {
            button.disabled = false;
            button.setAttribute("aria-disabled", "false");
        }
    });
}


function updateAllNavigation() {
    sections.forEach(updateSectionNavigation);
}


/* =====================================================
   6. NEXT, BACK, AND DIRECT NAVIGATION EVENTS
===================================================== */

dcForm?.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button || !dcForm.contains(button)) {
        return;
    }

    if (button.id === "test-pdf-button") {
        return;
    }

    const currentSection = button.closest(".form-section");

    if (!currentSection) {
        const targetId = button.dataset.goTo || button.dataset.target;

        if (targetId) {
            showSection(document.getElementById(targetId));
        }

        return;
    }

    const isNavigationButton = button.matches(
        ".section-next, .section-prev, .section-navigation [data-go-to]"
    );

    if (!isNavigationButton) {
        const targetId = button.dataset.goTo || button.dataset.target;

        if (targetId) {
            showSection(document.getElementById(targetId));
        }

        return;
    }

    event.preventDefault();


    // BACK: no validation required.
    if (button.matches(".section-prev")) {
        const currentIndex = sections.indexOf(currentSection);
        const previousSection = sections[currentIndex - 1];

        if (previousSection) {
            showSection(previousSection);
        }

        return;
    }


    // NEXT: resolve the destination.
    let nextSection;

    if (button.dataset.goTo) {
        nextSection = document.getElementById(button.dataset.goTo);
    } else {
        const currentIndex = sections.indexOf(currentSection);
        nextSection = sections[currentIndex + 1];
    }

    if (!nextSection) {
        return;
    }


    // Validate when moving forward.
    const currentIndex = sections.indexOf(currentSection);
    const targetIndex = sections.indexOf(nextSection);

    if (targetIndex > currentIndex) {
        const errors = getSectionErrors(currentSection);

        if (errors.length) {
            updateSectionNavigation(currentSection);

            const firstError = errors[0];

            if (firstError.field) {
                firstError.field.focus({ preventScroll: true });

                firstError.field.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            console.warn(
                "Section is incomplete:",
                currentSection.id,
                errors.map(error => error.message)
            );

            return;
        }
    }


    // Refresh review content before opening the review section.
    if (
        nextSection.id === "review-section" &&
        typeof updateReview === "function"
    ) {
        updateReview();
    }

    showSection(nextSection);
});


/* =====================================================
   7. LIVE NAVIGATION VALIDATION
===================================================== */

dcForm?.addEventListener("input", event => {
    const section = event.target.closest(".form-section");

    if (section) {
        updateSectionNavigation(section);
    }
});


dcForm?.addEventListener("change", event => {
    const section = event.target.closest(".form-section");

    if (section) {
        updateSectionNavigation(section);
        updateAllNavigation();
    }
});


/* =====================================================
   8. RECORD ID AND EDIT CONTROLS
===================================================== */

// Display the generated record ID wherever it is shown.
if (closedRecordIdOutput) {
    closedRecordIdOutput.textContent = recordId;
}

setSummaryValue("byw-stage1-record-id", recordId);


// Edit controls use the shared navigation function.
document.querySelectorAll(".edit-record-control").forEach(button => {
    button.addEventListener("click", () => {
        showSection(document.getElementById(button.dataset.target));
    });
});


/* =====================================================
   9. INITIAL SECTION STATE
===================================================== */

if (activeSection) {
    updateSectionNavigation(activeSection);
}

updateAllNavigation();


/* =====================================================
   10. PROPOSED ACTION AND CONDITIONAL FIELDS
===================================================== */

function updateApprovalAuthority() {
    if (approvalAuthority) {
        approvalAuthority.textContent = approvalAuthorityInput?.value ?? "";
    }

    updateAccountabilityReview();
}


approvalAuthorityInput?.addEventListener(
    "input",
    updateApprovalAuthority
);


function updateStatedConsequence() {
    if (statedConsequence && consequenceInput) {
        statedConsequence.textContent = consequenceInput.value;
    }
}


consequenceInput?.addEventListener("input", updateStatedConsequence);


function updateProposedAction() {
    const selected = document.querySelector(
        'input[name="proposedAction"]:checked'
    )?.value;

    if (modifyFields) {
        modifyFields.hidden = selected !== "modify";
    }

    if (deferFields) {
        deferFields.hidden = selected !== "defer";
    }

    modifyInputs.forEach(input => {
        input.required = selected === "modify";
    });

    deferInputs.forEach(input => {
        input.required = selected === "defer";
    });


    if (riskQuestion) {
        riskQuestion.textContent =
            selected === "defer" || selected === "decline"
                ? "What risks remain with this choice?"
                : "What known risks is ownership accepting?";
    }


    if (consequenceAcceptanceField) {
        consequenceAcceptanceField.hidden = !(
            selected === "advance" || selected === "modify"
        );
    }


    if (consequenceQuestion) {
        consequenceQuestion.textContent =
            selected === "defer" || selected === "decline"
                ? "What consequence is ownership knowingly accepting by authorizing this decision?"
                : "What material consequence follows from this decision?";
    }


    if (finalAction) {
        const actionLabels = {
            advance: "Advance",
            modify: "Modify",
            defer: "Defer",
            decline: "Decline"
        };

        finalAction.textContent = actionLabels[selected] || "Not selected";
    }
}


actionRadios.forEach(radio => {
    radio.addEventListener("change", updateProposedAction);
});

updateProposedAction();
updateApprovalAuthority();
updateStatedConsequence();


/* =====================================================
   11. REPEATABLE RISK ENTRIES
===================================================== */

addRiskButton?.addEventListener("click", () => {
    const riskCount =
        riskEntries.querySelectorAll(".risk-entry").length + 1;

    const riskEntry = document.createElement("div");
    riskEntry.className = "risk-entry form-field";

    riskEntry.innerHTML = `
        <label>
            <span class="field-label">
                Risk ${riskCount}
                <button type="button" class="basic-app-button remove-risk">
                    Remove risk
                </button>
            </span>

            <textarea
                name="acceptedRisks[]"
                placeholder="Describe a known risk, or enter None identified."
                required
            ></textarea>
        </label>
    `;

    riskEntries.appendChild(riskEntry);
});


riskEntries?.addEventListener("click", event => {
    const removeButton = event.target.closest(".remove-risk");

    if (!removeButton) {
        return;
    }

    removeButton.closest(".risk-entry").remove();

    riskEntries.querySelectorAll(".risk-entry").forEach((entry, index) => {
        const label = entry.querySelector(".field-label");
        const button = label.querySelector(".remove-risk");

        label.firstChild.textContent = `Risk ${index + 1} `;

        if (button) {
            label.appendChild(button);
        }
    });
});


/* =====================================================
   12. NO-CONDITIONS DECLARATION
===================================================== */

function updateNoConditionsState() {
    if (!conditionsContainer || !noConditionsCheckbox) {
        return;
    }

    const cards = conditionsContainer.querySelectorAll(
        "[data-condition-card]"
    );

    if (noConditionsCheckbox.checked && cards.length > 0) {
        noConditionsCheckbox.checked = false;
    }

    const noConditionsDeclared = noConditionsCheckbox.checked;

    conditionsContainer.hidden = noConditionsDeclared;

    cards.forEach(card => {
        card.querySelectorAll("input, textarea, select").forEach(field => {
            field.disabled = noConditionsDeclared;
        });
    });

    noConditionsCheckbox.disabled = cards.length > 0;

    if (nextConditionsButton) {
        nextConditionsButton.disabled =
            cards.length === 0 && !noConditionsDeclared;
    }

    updateConditionRepeaterState();
    updateConditionCounts();
    updateConditionReview();
}


noConditionsCheckbox?.addEventListener(
    "change",
    updateNoConditionsState
);


/* =====================================================
   13. CONDITIONAL CONDITION FIELDS
===================================================== */

function updateConditionFields(card) {
    const status = card.querySelector(
        '[data-field="status"]:checked'
    )?.value;

    const timing = card.querySelector(
        '[data-field="timing"]:checked'
    )?.value;

    const resolutionFields = card.querySelector("[data-resolution-fields]");
    const acceptedFields = card.querySelector("[data-accepted-fields]");

    const reclassificationFields = card.querySelector(
        "[data-reclassification-fields]"
    );

    const resolutionNote = card.querySelector(
        '[data-field="resolutionNote"]'
    );

    const acceptedBy = card.querySelector('[data-field="acceptedBy"]');
    const acceptedAt = card.querySelector('[data-field="acceptedAt"]');

    const reclassificationNote = card.querySelector(
        '[data-field="reclassificationNote"]'
    );

    const waiverScope = card.querySelector('[data-field="waiverScope"]');


    const needsResolutionNote = Boolean(status && status !== "open");

    if (resolutionFields) {
        resolutionFields.hidden = !needsResolutionNote;
    }

    if (resolutionNote) {
        resolutionNote.required = needsResolutionNote;
    }


    const needsAcceptance =
        status === "waived" || timing === "accepted-exception";

    if (acceptedFields) {
        acceptedFields.hidden = !needsAcceptance;
    }

    if (acceptedBy) {
        acceptedBy.required = needsAcceptance;
    }

    if (acceptedAt) {
        acceptedAt.required = needsAcceptance;
    }


    const originalTiming = card.dataset.initialTiming || "";

    const needsReclassification =
        Boolean(originalTiming) && timing !== originalTiming;

    if (reclassificationFields) {
        reclassificationFields.hidden = !needsReclassification;
    }

    if (reclassificationNote) {
        reclassificationNote.required = needsReclassification;
    }

    if (waiverScope) {
        waiverScope.required = status === "waived";
    }
}


/* =====================================================
   14. CONDITION NUMBERING AND CREATION
===================================================== */

function updateConditionNumbers() {
    conditionsContainer?.querySelectorAll(
        "[data-condition-card]"
    ).forEach((card, index) => {
        const number = card.querySelector('[data-display="number"]');

        if (number) {
            number.textContent = index + 1;
        }
    });
}


addConditionButton?.addEventListener("click", () => {
    noConditionsCheckbox.checked = false;

    conditionCounter += 1;

    const conditionId = `DC-COND-${Date.now()}-${conditionCounter}`;

    const fragment = conditionTemplate.content.cloneNode(true);
    const card = fragment.querySelector("[data-condition-card]");

    card.dataset.conditionId = conditionId;

    const idDisplay = card.querySelector(
        '[data-display="condition-id"]'
    );

    if (idDisplay) {
        idDisplay.textContent = conditionId;
    }


    // Give each condition card independent radio groups.
    card.querySelectorAll('input[type="radio"][data-field]').forEach(radio => {
        radio.name = `${conditionId}-${radio.dataset.field}`;
    });


    // Start with no timing selection.
    card.querySelectorAll('[data-field="timing"]').forEach(radio => {
        radio.checked = false;
    });


    conditionsContainer.appendChild(fragment);

    const newCard = conditionsContainer.lastElementChild;

    updateConditionFields(newCard);
    updateConditionNumbers();
    updateNoConditionsState();

    newCard.querySelector('[data-field="condition"]')?.focus();
});


/* =====================================================
   15. CONDITION REMOVAL AND CHANGE EVENTS
===================================================== */

conditionsContainer?.addEventListener("click", event => {
    const removeButton = event.target.closest('[data-action="remove"]');

    if (!removeButton) {
        return;
    }

    removeButton.closest("[data-condition-card]").remove();

    updateConditionNumbers();
    updateNoConditionsState();
});


conditionsContainer?.addEventListener("change", event => {
    const card = event.target.closest("[data-condition-card]");

    if (!card) {
        return;
    }

    if (event.target.matches('[data-field="timing"]')) {
        const selectedTiming = event.target.value;

        if (!card.dataset.initialTiming) {
            card.dataset.initialTiming = selectedTiming;
        }
    }

    updateConditionFields(card);

    const lastUpdated = card.querySelector(
        '[data-display="last-updated"]'
    );

    if (lastUpdated) {
        lastUpdated.textContent = new Date().toLocaleString();
    }
});


/* =====================================================
   16. CONDITION NEXT-BUTTON VALIDATION
===================================================== */

nextConditionsButton?.addEventListener("click", event => {
    const cards = conditionsContainer.querySelectorAll(
        "[data-condition-card]"
    );

    if (noConditionsCheckbox.checked && cards.length === 0) {
        return;
    }

    if (cards.length === 0) {
        event.preventDefault();
        noConditionsCheckbox.focus();
        return;
    }

    for (const card of cards) {
        const fields = card.querySelectorAll("input, textarea, select");

        for (const field of fields) {
            if (field.disabled) {
                continue;
            }

            if (!field.checkValidity()) {
                event.preventDefault();
                field.reportValidity();
                field.focus();
                return;
            }
        }
    }
});


/* =====================================================
   17. INITIAL CONDITION REGISTER STATE
===================================================== */

updateConditionNumbers();

conditionsContainer?.querySelectorAll(
    "[data-condition-card]"
).forEach(updateConditionFields);

updateNoConditionsState();


/* =====================================================
   18. ASSUMPTION NUMBERING AND STATE
===================================================== */

function updateAssumptionNumbers() {
    if (!assumptionsContainer || !noAssumptionsCheckbox) {
        return;
    }

    const entries = assumptionsContainer.querySelectorAll(
        ".assumption-entry"
    );

    const noneSelected = noAssumptionsCheckbox.checked;

    entries.forEach((entry, index) => {
        const label = entry.querySelector(".field-label");

        if (!label) {
            return;
        }

        const removeButton = label.querySelector(".remove-assumption");

        const textarea = entry.querySelector(
            'textarea[name="keyAssumptions[]"]'
        );

        label.firstChild.textContent = `Assumption ${index + 1} `;

        if (removeButton) {
            removeButton.hidden = entries.length === 1;
            label.appendChild(removeButton);
        }

        if (textarea) {
            textarea.required = !noneSelected;
            textarea.disabled = noneSelected;
        }

        entry.hidden = noneSelected;
    });

    if (addAssumptionButton) {
        addAssumptionButton.disabled = noneSelected;
    }
}


addAssumptionButton?.addEventListener("click", () => {
    noAssumptionsCheckbox.checked = false;

    const entry = document.createElement("div");
    entry.className = "assumption-entry form-field";

    entry.innerHTML = `
        <label>
            <span class="field-label">
                Assumption
                <button type="button" class="basic-app-button remove-assumption">
                    Remove assumption
                </button>
            </span>

            <textarea
                name="keyAssumptions[]"
                placeholder="Describe a material fact or expectation this decision depends on."
                required
            ></textarea>
        </label>
    `;

    assumptionsContainer.insertBefore(entry, addAssumptionButton);

    updateAssumptionNumbers();
    updateAssumptionsReview();
    updateAssumptions();

    entry.querySelector("textarea")?.focus();
});


assumptionsContainer?.addEventListener("click", event => {
    const removeButton = event.target.closest(".remove-assumption");

    if (!removeButton) {
        return;
    }

    removeButton.closest(".assumption-entry").remove();

    updateAssumptionNumbers();
    updateAssumptionsReview();
    updateAssumptions();
});


noAssumptionsCheckbox?.addEventListener("change", () => {
    if (noAssumptionsCheckbox.checked) {
        assumptionsContainer.querySelectorAll(
            'textarea[name="keyAssumptions[]"]'
        ).forEach(textarea => {
            textarea.value = "";
        });
    }

    updateAssumptionNumbers();
    updateAssumptionsReview();
    updateAssumptions();
});


updateAssumptionNumbers();


/* =====================================================
   19. DECISION DETAILS REVIEW
===================================================== */

decisionDetailFields.forEach(({ input, output, type }) => {
    const inputElement = document.getElementById(input);
    const outputElement = document.getElementById(output);

    if (!inputElement || !outputElement) {
        return;
    }

    function updateValue() {
        const value = inputElement.value.trim();

        if (type === "date" && value) {
            const [year, month, day] = value.split("-");
            outputElement.textContent = `${month}/${day}/${year}`;
        } else {
            outputElement.textContent = value;
        }
    }

    inputElement.addEventListener("input", updateValue);
    inputElement.addEventListener("change", updateValue);

    updateValue();
});


/* =====================================================
   20. CAPITAL EVENT REVIEW
===================================================== */

function updateCapitalEvent() {
    const selected = document.querySelector(
        'input[name="capitalEvent"]:checked'
    );

    if (capitalEventOutput) {
        capitalEventOutput.textContent = selected
            ? selected.parentElement.textContent.trim()
            : "";
    }
}


capitalEventRadios.forEach(radio => {
    radio.addEventListener("change", updateCapitalEvent);
});

updateCapitalEvent();


/* =====================================================
   21. PROPOSED ACTION REVIEW
===================================================== */

function updateRecordProposedAction() {
    const selected = document.querySelector(
        'input[name="proposedAction"]:checked'
    );

    if (proposedActionOutput) {
        proposedActionOutput.textContent = selected
            ? selected.value.toUpperCase()
            : "";
    }
}


proposedActionRadios.forEach(radio => {
    radio.addEventListener("change", updateRecordProposedAction);
});

updateRecordProposedAction();


/* =====================================================
   22. MATERIAL EVIDENCE REVIEW
===================================================== */

function updateMaterialEvidence() {
    if (materialEvidenceOutput && materialEvidenceInput) {
        materialEvidenceOutput.textContent =
            materialEvidenceInput.value.trim();
    }
}


materialEvidenceInput?.addEventListener("input", updateMaterialEvidence);

updateMaterialEvidence();


/* =====================================================
   23. ACCEPTED RISKS REVIEW
===================================================== */

function updateAcceptedRisks() {
    if (!riskEntriesContainer || !acceptedRisksOutput) {
        return;
    }

    const riskInputs = riskEntriesContainer.querySelectorAll(
        'textarea[name="acceptedRisks[]"]'
    );

    acceptedRisksOutput.replaceChildren();

    if (riskInputs.length === 0) {
        acceptedRisksOutput.textContent = "No risks entered.";
        return;
    }

    riskInputs.forEach((input, index) => {
        const risk = document.createElement("div");
        risk.className = "review-field";

        const label = document.createElement("strong");
        label.textContent = `Risk ${index + 1}:`;

        const value = document.createElement("span");
        value.textContent = input.value.trim();

        risk.append(label, document.createTextNode(" "), value);

        acceptedRisksOutput.appendChild(risk);
    });
}


riskEntriesContainer?.addEventListener("input", event => {
    if (event.target.matches('textarea[name="acceptedRisks[]"]')) {
        updateAcceptedRisks();
    }
});


riskObserver = new MutationObserver(updateAcceptedRisks);

if (riskEntriesContainer) {
    riskObserver.observe(riskEntriesContainer, {
        childList: true,
        subtree: true
    });
}

updateAcceptedRisks();


/* =====================================================
   24. CONDITION REGISTER REVIEW
===================================================== */

function updateConditionReview() {
    if (
        !conditionRegister ||
        !recordNoConditions ||
        !recordConditionEntries
    ) {
        return;
    }

    const cards = conditionRegister.querySelectorAll(
        "[data-condition-card]"
    );

    const noConditionsDeclared = noConditionsCheckbox.checked;

    recordConditionEntries.replaceChildren();

    recordNoConditions.textContent = noConditionsDeclared
        ? "No unresolved conditions identified."
        : "";

    if (noConditionsDeclared || cards.length === 0) {
        if (!noConditionsDeclared) {
            recordNoConditions.textContent = "No conditions entered.";
        }

        return;
    }


    cards.forEach((card, index) => {
        const entry = document.createElement("div");
        entry.className = "review-field";

        const title = document.createElement("h4");
        title.textContent = `Condition ${index + 1}`;

        const conditionId = card.dataset.conditionId || "";

        const conditionText =
            card.querySelector('[data-field="condition"]')?.value.trim() || "";

        const timing = card.querySelector(
            '[data-field="timing"]:checked'
        );

        const owner =
            card.querySelector('[data-field="owner"]')?.value.trim() || "";

        const dueDate =
            card.querySelector('[data-field="dueDate"]')?.value || "";

        const evidence =
            card.querySelector('[data-field="evidence"]')?.value.trim() || "";

        const waiverScope =
            card.querySelector('[data-field="waiverScope"]')?.value.trim() || "";

        const status = card.querySelector(
            '[data-field="status"]:checked'
        );

        const resolutionNote =
            card.querySelector('[data-field="resolutionNote"]')?.value.trim() || "";

        const acceptedBy =
            card.querySelector('[data-field="acceptedBy"]')?.value.trim() || "";

        const acceptedAt =
            card.querySelector('[data-field="acceptedAt"]')?.value || "";

        const reclassificationNote =
            card.querySelector('[data-field="reclassificationNote"]')?.value.trim() || "";

        const lastUpdated =
            card.querySelector('[data-display="last-updated"]')?.textContent.trim() || "";


        function addDetail(label, value) {
            const row = document.createElement("p");

            const strong = document.createElement("strong");
            strong.textContent = `${label}: `;

            row.appendChild(strong);
            row.appendChild(
                document.createTextNode(value || "Not provided")
            );

            entry.appendChild(row);
        }


        entry.appendChild(title);

        addDetail("Condition ID", conditionId);
        addDetail("Condition", conditionText);

        addDetail(
            "When it must be met",
            timing?.parentElement.textContent.trim() || ""
        );

        addDetail("Owner", owner);

        if (dueDate) {
            const [year, month, day] = dueDate.split("-");
            addDetail("Due date", `${month}/${day}/${year}`);
        } else {
            addDetail("Due date", "");
        }

        addDetail("Evidence required", evidence);
        addDetail("Permitted waiver scope", waiverScope);

        addDetail(
            "Status",
            status?.parentElement.textContent.trim() || ""
        );

        addDetail("Resolution note", resolutionNote);

        if (acceptedBy) {
            addDetail("Accepted by", acceptedBy);
        }

        if (acceptedAt) {
            addDetail("Acceptance date and time", acceptedAt);
        }

        if (reclassificationNote) {
            addDetail(
                "Reclassification explanation",
                reclassificationNote
            );
        }

        addDetail("Last updated", lastUpdated);

        recordConditionEntries.appendChild(entry);
    });
}


conditionRegister?.addEventListener("input", updateConditionReview);
conditionRegister?.addEventListener("change", updateConditionReview);


conditionReviewObserver = new MutationObserver(updateConditionReview);

if (conditionRegister) {
    conditionReviewObserver.observe(conditionRegister, {
        childList: true,
        subtree: true
    });
}


noConditionsCheckbox?.addEventListener("change", updateConditionReview);

updateConditionReview();


/* =====================================================
   25. CONSEQUENCE REVIEW
===================================================== */

function updateRecordConsequenceQuestion() {
    if (recordConsequenceQuestion && consequenceQuestionInput) {
        recordConsequenceQuestion.textContent =
            consequenceQuestionInput.textContent.trim();
    }
}


function updateRecordConsequence() {
    if (recordConsequence && consequenceInput) {
        recordConsequence.textContent = consequenceInput.value.trim();
    }
}


consequenceInput?.addEventListener("input", updateRecordConsequence);


consequenceQuestionObserver = new MutationObserver(
    updateRecordConsequenceQuestion
);

if (consequenceQuestionInput) {
    consequenceQuestionObserver.observe(consequenceQuestionInput, {
        childList: true,
        characterData: true,
        subtree: true
    });
}


updateRecordConsequenceQuestion();
updateRecordConsequence();


/* =====================================================
   26. RECOVERY REVIEW
===================================================== */

// Checkbox-driven recovery state is the single source of truth.
function updateRecoveryFields() {
    const notApplicable = Boolean(recoveryNotApplicable?.checked);

    if (recoveryReasonField) {
        recoveryReasonField.hidden = !notApplicable;
    }

    if (recoveryReasonInput) {
        recoveryReasonInput.required = notApplicable;
    }

    if (recoveryInput) {
        recoveryInput.required = !notApplicable;
    }

    if (notApplicable) {
        if (recoveryInput) {
            recoveryInput.value = "";
        }
    } else if (recoveryReasonInput) {
        recoveryReasonInput.value = "";
    }

    updateRecoveryReview();
}


function updateRecoveryReview() {
    if (!recoveryOutput) {
        return;
    }

    recoveryOutput.replaceChildren();

    if (recoveryNotApplicable?.checked) {
        const status = document.createElement("p");
        status.textContent = "Recovery: Not applicable";

        const reason = document.createElement("p");

        const label = document.createElement("strong");
        label.textContent = "Reason: ";

        reason.append(
            label,
            document.createTextNode(
                recoveryReasonInput?.value.trim() || "Not provided"
            )
        );

        recoveryOutput.append(status, reason);
        return;
    }

    recoveryOutput.textContent =
        recoveryInput?.value.trim() || "Not provided";
}


recoveryInput?.addEventListener("input", updateRecoveryReview);
recoveryReasonInput?.addEventListener("input", updateRecoveryReview);

recoveryNotApplicable?.addEventListener(
    "change",
    updateRecoveryFields
);

updateRecoveryFields();


/* =====================================================
   27. ASSUMPTIONS REVIEW
===================================================== */

function updateAssumptionsReview() {
    if (!assumptionsOutput || !assumptionContainer) {
        return;
    }

    assumptionsOutput.replaceChildren();

    if (noAssumptionsCheckbox?.checked) {
        assumptionsOutput.textContent = "No key assumptions identified.";
        return;
    }

    const assumptionInputs = assumptionContainer.querySelectorAll(
        'textarea[name="keyAssumptions[]"]'
    );

    const enteredAssumptions = Array.from(assumptionInputs)
        .map(input => input.value.trim())
        .filter(Boolean);

    if (enteredAssumptions.length === 0) {
        assumptionsOutput.textContent = "No assumptions entered.";
        return;
    }

    enteredAssumptions.forEach((assumption, index) => {
        const entry = document.createElement("p");
        const label = document.createElement("strong");

        label.textContent = `Assumption ${index + 1}: `;

        entry.append(label, document.createTextNode(assumption));

        assumptionsOutput.appendChild(entry);
    });
}


assumptionContainer?.addEventListener("input", event => {
    if (event.target.matches('textarea[name="keyAssumptions[]"]')) {
        updateAssumptionsReview();
    }
});


assumptionContainer?.addEventListener("change", event => {
    if (event.target === noAssumptionsCheckbox) {
        const assumptionInputs = assumptionContainer.querySelectorAll(
            'textarea[name="keyAssumptions[]"]'
        );

        assumptionInputs.forEach(input => {
            input.required = !noAssumptionsCheckbox.checked;

            if (noAssumptionsCheckbox.checked) {
                input.value = "";
            }
        });

        if (addAssumptionButton) {
            addAssumptionButton.disabled = noAssumptionsCheckbox.checked;
        }

        updateAssumptionsReview();
        updateAssumptions();
    }
});


assumptionObserver = new MutationObserver(() => {
    updateAssumptionsReview();
    updateAssumptions();
});

if (assumptionContainer) {
    assumptionObserver.observe(assumptionContainer, {
        childList: true,
        subtree: true
    });
}


updateAssumptionsReview();


/* =====================================================
   28. DECISION BASIS REVIEW
===================================================== */

function updateDecisionBasisReview() {
    if (decisionBasisOutput && decisionBasisInput) {
        decisionBasisOutput.textContent =
            decisionBasisInput.value.trim() || "Not provided";
    }
}


decisionBasisInput?.addEventListener("input", updateDecisionBasisReview);

updateDecisionBasisReview();


/* =====================================================
   29. ACCOUNTABILITY REVIEW
===================================================== */

function updateAccountabilityReview() {
    if (accountabilityApprovalAuthorityOutput) {
        accountabilityApprovalAuthorityOutput.textContent =
            approvalAuthorityInput?.value.trim() || "Not provided";
    }

    if (confirmingPersonOutput) {
        confirmingPersonOutput.textContent =
            confirmingPersonInput?.value.trim() || "Not provided";
    }
}


approvalAuthorityInput?.addEventListener(
    "input",
    updateAccountabilityReview
);

confirmingPersonInput?.addEventListener(
    "input",
    updateAccountabilityReview
);

updateAccountabilityReview();


/* =====================================================
   30. STAGE 1 SUMMARY HELPERS
===================================================== */

function setSummaryValue(id, value) {
    const output = document.getElementById(id);

    if (output) {
        output.textContent = value || "—";
    }
}


/* =====================================================
   31. TRANSACTION SUMMARY
===================================================== */

function updateTransaction() {
    const selected = document.querySelector(
        'input[name="capitalEvent"]:checked'
    );

    const labels = {
        acquisition: "Acquisition",
        refinance: "Refinance",
        recapitalization: "Recapitalization",
        "major-capital": "Major capital",
        disposition: "Disposition",
        other: "Other"
    };

    setSummaryValue("byw-transaction", labels[selected?.value]);
}


/* =====================================================
   32. CLOSED DECISION SUMMARY
===================================================== */

function updateClosedDecision() {
    const selected = document.querySelector(
        'input[name="proposedAction"]:checked'
    );

    const labels = {
        advance: "ADVANCE",
        modify: "MODIFY",
        defer: "DEFER",
        decline: "DECLINE"
    };

    setSummaryValue("byw-action", labels[selected?.value]);
}


/* =====================================================
   33. DECISION DATE SUMMARY
===================================================== */

function updateDecisionDate() {
    const value = document.getElementById("dc-date")?.value;

    if (!value) {
        setSummaryValue("byw-decision-date", "");
        return;
    }

    const [year, month, day] = value.split("-");

    setSummaryValue("byw-decision-date", `${month}/${day}/${year}`);
}


/* =====================================================
   34. CONSEQUENCE SUMMARY
===================================================== */

function updateConsequence() {
    setSummaryValue(
        "byw-consequence",
        document.getElementById("dc-consequenceStatement")?.value.trim()
    );
}


/* =====================================================
   35. ASSUMPTIONS SUMMARY
===================================================== */

function updateAssumptions() {
    if (!assumptionsSummaryOutput) {
        return;
    }

    assumptionsSummaryOutput.replaceChildren();

    if (noAssumptionsCheckbox?.checked) {
        const item = document.createElement("li");
        item.textContent = "No key assumptions identified.";

        assumptionsSummaryOutput.appendChild(item);
        return;
    }

    const inputs = document.querySelectorAll(
        '#assumption-container textarea[name="keyAssumptions[]"]'
    );

    const assumptions = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(Boolean);

    if (assumptions.length === 0) {
        const item = document.createElement("li");
        item.textContent = "—";

        assumptionsSummaryOutput.appendChild(item);
        return;
    }

    assumptions.forEach(assumption => {
        const item = document.createElement("li");
        item.textContent = assumption;

        assumptionsSummaryOutput.appendChild(item);
    });
}


/* =====================================================
   36. CONDITION REPEATER STATE
===================================================== */

function updateConditionRepeaterState() {
    const noConditions = Boolean(noConditionsCheckbox?.checked);

    if (!conditionsContainer || !addConditionButton) {
        return;
    }

    addConditionButton.disabled = noConditions;

    conditionsContainer.querySelectorAll(
        "[data-condition-card] input, " +
        "[data-condition-card] textarea, " +
        "[data-condition-card] select, " +
        "[data-condition-card] button"
    ).forEach(field => {
        field.disabled = noConditions;
    });

    updateAllNavigation();
}


/* =====================================================
   37. CONDITION SUMMARY COUNTS
===================================================== */

function updateConditionCounts() {
    const noConditions = Boolean(noConditionsCheckbox?.checked);

    const cards = document.querySelectorAll(
        "#dc-condition-register [data-condition-card]"
    );

    if (noConditions) {
        setSummaryValue(
            "byw-condition-counts",
            "No unresolved conditions identified."
        );

        return;
    }

    if (!cards.length) {
        setSummaryValue(
            "byw-condition-counts",
            "No conditions entered."
        );

        return;
    }

    const counts = {
        open: 0,
        satisfied: 0,
        waived: 0,
        failed: 0,
        changed: 0
    };

    cards.forEach(card => {
        const status = card.querySelector(
            '[data-field="status"]:checked'
        )?.value;

        if (status && Object.hasOwn(counts, status)) {
            counts[status]++;
        }
    });

    setSummaryValue(
        "byw-condition-counts",
        `Total: ${cards.length} | Open: ${counts.open} | Satisfied: ${counts.satisfied} | Waived: ${counts.waived} | Failed: ${counts.failed} | Changed: ${counts.changed}`
    );
}


/* =====================================================
   38. STAGE 1 SUMMARY EVENT LISTENERS
===================================================== */

capitalEventRadios.forEach(input => {
    input.addEventListener("change", updateTransaction);
});


proposedActionRadios.forEach(input => {
    input.addEventListener("change", updateClosedDecision);
});


document.getElementById("dc-date")?.addEventListener(
    "input",
    updateDecisionDate
);


approvalAuthorityInput?.addEventListener(
    "input",
    updateApprovalAuthority
);


consequenceInput?.addEventListener("input", updateConsequence);


assumptionContainer?.addEventListener("input", updateAssumptions);
assumptionContainer?.addEventListener("change", updateAssumptions);


conditionRegister?.addEventListener("input", updateConditionCounts);
conditionRegister?.addEventListener("change", updateConditionCounts);


/* =====================================================
   39. DYNAMIC SUMMARY OBSERVER
===================================================== */

summaryObserver = new MutationObserver(() => {
    updateAssumptions();
    updateConditionCounts();
});


if (assumptionContainer) {
    summaryObserver.observe(assumptionContainer, {
        childList: true,
        subtree: true
    });
}


if (conditionRegister) {
    summaryObserver.observe(conditionRegister, {
        childList: true,
        subtree: true
    });
}


/* =====================================================
   40. INITIAL SUMMARY POPULATION
===================================================== */

updateTransaction();
updateClosedDecision();
updateDecisionDate();
updateApprovalAuthority();
updateConsequence();
updateAssumptions();
updateConditionCounts();
updateConditionRepeaterState();


/* =====================================================
   41. CLOSE DECISION AND GENERATE RECORD
===================================================== */

// This button is a submit button. Handle it through the form's
// submit event so both button clicks and Enter-key submissions work.
//
// This handler records the submission time and updates the visible
// record metadata. Connect your existing PDF-generation routine here.
dcForm?.addEventListener("submit", event => {
    const submitter = event.submitter;

    if (submitter?.id !== "dc-close-and-generate-btn") {
        return;
    }

    // Stop the browser's default submission only if this form is
    // intended to be handled entirely by JavaScript.
    event.preventDefault();

    const submittedAt = new Date();

    const timestamp = submittedAt.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    if (closedRecordIdOutput) {
        closedRecordIdOutput.textContent = recordId;
    }

    if (closedRecordTimestampOutput) {
        closedRecordTimestampOutput.textContent = timestamp;
    }

    // Refresh review and summary content before generating the PDF.
    updateCapitalEvent();
    updateRecordProposedAction();
    updateAcceptedRisks();
    updateConditionReview();
    updateRecoveryReview();
    updateAssumptionsReview();
    updateDecisionBasisReview();
    updateAccountabilityReview();

    updateTransaction();
    updateClosedDecision();
    updateDecisionDate();
    updateConsequence();
    updateAssumptions();
    updateConditionCounts();

    /*
       Call your existing PDF-generation function here.

       Example:
       generateDecisionClosurePDF({
           recordId,
           submittedAt,
           timestamp
       });

       After the PDF has been generated successfully, set the
       View PDF and Download PDF links in #success-section to the
       resulting PDF URL.
    */
});