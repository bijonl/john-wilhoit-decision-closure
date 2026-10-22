// const dateField = document.getElementById("wat-date");

// const today = new Date().toISOString().split("T")[0];

const sections = [...document.querySelectorAll('#dk-form > .form-section')];

  const recordId = `WAR-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;




// =====================================================
// SHOW SECTION
// =====================================================

function showSection(section) {

    if (!section) {
        return;
    }

    sections.forEach(section => {
        section.classList.remove('active-section');
    });

    section.classList.add('active-section');

    updateSectionNavigation(section);

    window.scrollTo({
        top: document.getElementById('dk-app').offsetTop,
        behavior: 'smooth'
    });
}

// =====================================================
// CHECK IF SECTION IS COMPLETE
// =====================================================

function isSectionComplete(section) {

    const fields = section.querySelectorAll(
        'input:not([type="button"]):not([type="submit"]), textarea, select'
    );

    const radioGroups = new Set();

    for (const field of fields) {

        // Ignore disabled fields
        if (field.disabled) {
            continue;
        }

        // Ignore fields that are hidden
        if (field.offsetParent === null) {
            continue;
        }

        // Radio buttons are checked as a group below
        if (field.type === 'radio') {
            radioGroups.add(field.name);
            continue;
        }

        // Everything else needs a value
        if (!field.value.trim()) {
            return false;
        }
    }


    // Check every radio group
    for (const name of radioGroups) {

        const checked = section.querySelector(
            `input[type="radio"][name="${name}"]:checked`
        );

        if (!checked) {
            return false;
        }
    }


    return true;
}

// =====================================================
// UPDATE SECTION NAVIGATION
// =====================================================

function updateSectionNavigation(section) {

    if (!section) {
        return;
    }

    const nextButton = section.querySelector('.section-next');

    if (nextButton) {
        nextButton.disabled = !isSectionComplete(section);
    }
}

// =====================================================
// NEXT BUTTONS
// =====================================================

// document.querySelectorAll('.section-next').forEach(button => {

//     button.addEventListener('click', () => {

//         const currentSection = button.closest('.form-section');

//         if (!currentSection) {
//             return;
//         }


//         // Don't allow navigation if the section isn't complete
//         if (!isSectionComplete(currentSection)) {
//             updateSectionNavigation(currentSection);
//             return;
//         }


//         const currentIndex = sections.indexOf(currentSection);
//         const nextSection = sections[currentIndex + 1];

//         if (!nextSection) {
//             return;
//         }


//         // If we're moving into the review section,
//         // update the review before showing it.
//         // if (nextSection.id === 'review-section') {
//         //     updateReview();
//         // }


//         showSection(nextSection);

//     });

// });

// =====================================================
// PREVIOUS BUTTONS
// =====================================================

// document.querySelectorAll('.section-prev').forEach(button => {

//     button.addEventListener('click', () => {

//         const currentSection = button.closest('.form-section');

//         if (!currentSection) {
//             return;
//         }


//         const currentIndex = sections.indexOf(currentSection);
//         const previousSection = sections[currentIndex - 1];

//         if (!previousSection) {
//             return;
//         }


//         showSection(previousSection);

//     });

// });


// =====================================================
// UPDATE NAVIGATION WHEN FIELDS CHANGE
// =====================================================

document.querySelectorAll(
    '.form-section input, .form-section textarea, .form-section select'
).forEach(field => {

    field.addEventListener('input', () => {

        const section = field.closest('.form-section');

        if (section) {
            updateSectionNavigation(section);
        }

    });


    field.addEventListener('change', () => {

        const section = field.closest('.form-section');

        if (section) {
            updateSectionNavigation(section);
        }

    });

});


// =====================================================
// EDIT BUTTONS
// =====================================================

document.querySelectorAll('.edit-record-control').forEach(button => {

    button.addEventListener('click', () => {

        const targetId = button.dataset.target;
        const targetSection = document.getElementById(targetId);

        if (!targetSection) {
            return;
        }

        showSection(targetSection);

    });

});


// =====================================================
// INITIALIZE
// =====================================================

const activeSection = document.querySelector(
    '.form-section.active-section'
);

if (activeSection) {
    updateSectionNavigation(activeSection);
}

















// const recordControl = document.querySelector('#record-control');

// function updateRecordControl() {

//     const now = new Date();

//     const timestamp = now.toLocaleString('en-US', {
//         month: '2-digit',
//         day: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     });

//     recordControl.innerHTML = `
//         <strong>Generation Timestamp:</strong> ${timestamp}<br>
//         <strong>Record ID:</strong> ${recordId}<br><br>

//         This record documents the decision owner’s selected posture and stated
//         basis for one live decision. It does not authorize capital commitment
//         or release, replace required professional review, or provide legal,
//         tax, accounting, or investment advice.
//     `;
// }

// updateRecordControl();


const editButtons = document.querySelectorAll('.edit-record-control')


editButtons.forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelector('.form-section.active-section')
            .classList.remove('active-section');
        const targetSection = document.getElementById(button.dataset.target);
        targetSection.classList.add('active-section');
    });
});

const actionRadios = document.querySelectorAll(
  'input[name="proposedAction"]'
);

const modifyFields = document.getElementById("dc-modify-fields");
const deferFields = document.getElementById("dc-defer-fields");

const modifyInputs = modifyFields.querySelectorAll("textarea");
const deferInputs = deferFields.querySelectorAll("textarea");
const riskQuestion = document.getElementById("dc-risk-question");
const consequenceQuestion = document.getElementById("dc-consequence-question");
const finalAction = document.getElementById("dc-final-action");
const statedConsequence = document.getElementById("dc-final-consequence");
const approvalAuthority = document.getElementById("dc-final-approval-authority");
const consequenceInput = document.getElementById("dc-consequenceStatement");

const approvalAuthorityInput = document.getElementById("dc-approvalAuthority");

function updateApprovalAuthority() {
  approvalAuthority.textContent = approvalAuthorityInput.value;
}

approvalAuthorityInput.addEventListener("input", updateApprovalAuthority);

// Initialize the display.
updateApprovalAuthority();

function updateStatedConsequence() {
  statedConsequence.textContent = consequenceInput.value;
}

consequenceInput.addEventListener("input", updateStatedConsequence);

// Initialize the display.
updateStatedConsequence();


function updateProposedAction() {
  const selected = document.querySelector(
    'input[name="proposedAction"]:checked'
  )?.value;

  modifyFields.hidden = selected !== "modify";
  deferFields.hidden = selected !== "defer";

  modifyInputs.forEach((input) => {
    input.required = selected === "modify";
  });

  deferInputs.forEach((input) => {
    input.required = selected === "defer";
  });

    // Update the risk question.
  if (selected === "defer" || selected === "decline") {
    riskQuestion.textContent = "What risks remain with this choice?";
  } else {
    riskQuestion.textContent = "What known risks is ownership accepting?";
  }

    const consequenceAcceptanceField = document.getElementById(
        "dc-consequence-acceptance-field"
    );

    // Inside updateProposedAction(), after getting `selected`:
    consequenceAcceptanceField.hidden = !(
        selected === "advance" || selected === "modify"
    );

      // Update the risk question.
  if (selected === "defer" || selected === "decline") {
    consequenceQuestion.textContent = "What consequence is ownership knowingly accepting by authorizing this decision?";
  } else {
    consequenceQuestion.textContent = "What material consequence follows from this decision?";
  }

    // Update the final action display.
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

actionRadios.forEach((radio) => {
  radio.addEventListener("change", updateProposedAction);
});

updateProposedAction();


const riskEntries = document.getElementById('dc-risk-entries');
const addRiskButton = document.getElementById('dc-add-risk');

addRiskButton.addEventListener('click', function () {
  const riskCount = riskEntries.querySelectorAll('.risk-entry').length + 1;

  const riskEntry = document.createElement('div');
  riskEntry.className = 'risk-entry form-field';

  riskEntry.innerHTML = `
    <label>
      <span class="field-label">Risk ${riskCount}
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

// Remove a risk entry using event delegation.
// Remove a risk entry using event delegation.
riskEntries.addEventListener('click', function (event) {
  const removeButton = event.target.closest('.remove-risk');

  if (!removeButton) return;

  removeButton.closest('.risk-entry').remove();

  // Renumber remaining risks without removing their buttons.
  riskEntries.querySelectorAll('.risk-entry').forEach((entry, index) => {
    const label = entry.querySelector('.field-label');
    const button = label.querySelector('.remove-risk');

    label.firstChild.textContent = `Risk ${index + 1} `;

    // Keep the existing Remove risk button intact.
    if (button) {
      label.appendChild(button);
    }
  });
});

const recoveryReasonInput = document.getElementById("dc-recovery-not-applicable-reason");
const recoveryInput = document.getElementById("dc-recovery");
const recoveryOutput = document.getElementById("record-recovery");
const conditionsContainer = document.getElementById("dc-condition-register");
const addConditionButton = document.getElementById("dc-add-condition");
const conditionTemplate = document.getElementById("dc-condition-template");
const noConditionsCheckbox = document.getElementById("dc-no-unresolved-conditions");
const nextConditionsButton = document.querySelector(
  "#decision-closure-conditions-section .section-next"
);

let conditionCounter = 0;

// NO CONDITIONS DECLARATION
function updateNoConditionsState() {
  const cards = conditionsContainer.querySelectorAll("[data-condition-card]");
  const noneSelected = noConditionsCheckbox.checked;

  // Do not allow both a declaration and condition entries.
  if (noneSelected && cards.length > 0) {
    noConditionsCheckbox.checked = false;
  }

  const noConditionsDeclared = noConditionsCheckbox.checked;

  conditionsContainer.hidden = noConditionsDeclared;

  cards.forEach((card) => {
    card.querySelectorAll("input, textarea, select").forEach((field) => {
      field.disabled = noConditionsDeclared;
    });
  });

  // Once conditions exist, remove them before declaring none.
  noConditionsCheckbox.disabled = cards.length > 0;

  // Enable Next only if conditions exist or none are explicitly declared.
  nextConditionsButton.disabled =
    cards.length === 0 && !noConditionsDeclared;
}

noConditionsCheckbox.addEventListener("change", updateNoConditionsState);

// CONDITION FIELDS
function updateConditionFields(card) {
  const status = card.querySelector('[data-field="status"]:checked')?.value;
  const timing = card.querySelector('[data-field="timing"]:checked')?.value;

  const resolutionFields = card.querySelector("[data-resolution-fields]");
  const acceptedFields = card.querySelector("[data-accepted-fields]");
  const reclassificationFields = card.querySelector(
    "[data-reclassification-fields]"
  );

  const resolutionNote = card.querySelector('[data-field="resolutionNote"]');
  const acceptedBy = card.querySelector('[data-field="acceptedBy"]');
  const acceptedAt = card.querySelector('[data-field="acceptedAt"]');
  const reclassificationNote = card.querySelector(
    '[data-field="reclassificationNote"]'
  );
  const waiverScope = card.querySelector('[data-field="waiverScope"]');

  // Require a note for any status other than Open.
  const needsResolutionNote = status && status !== "open";
  resolutionFields.hidden = !needsResolutionNote;
  resolutionNote.required = Boolean(needsResolutionNote);

  // Waived status and Accepted Exception classification require authority.
  const needsAcceptance =
    status === "waived" || timing === "accepted-exception";

  acceptedFields.hidden = !needsAcceptance;
  acceptedBy.required = needsAcceptance;
  acceptedAt.required = needsAcceptance;

  // Require an explanation if the condition's classification changes.
  const originalTiming = card.dataset.initialTiming || "";
  const needsReclassification =
    Boolean(originalTiming) && timing !== originalTiming;

  reclassificationFields.hidden = !needsReclassification;
  reclassificationNote.required = needsReclassification;

  // A waived condition must state the permitted waiver scope.
  waiverScope.required = status === "waived";
}

// ADD CONDITIONS
function updateConditionNumbers() {
  const cards = conditionsContainer.querySelectorAll("[data-condition-card]");

  cards.forEach((card, index) => {
    const number = card.querySelector('[data-display="number"]');
    if (number) number.textContent = index + 1;
  });
}

addConditionButton.addEventListener("click", () => {
  noConditionsCheckbox.checked = false;

  conditionCounter += 1;

  const conditionId = `DC-COND-${Date.now()}-${conditionCounter}`;
  const fragment = conditionTemplate.content.cloneNode(true);
  const card = fragment.querySelector("[data-condition-card]");

  card.dataset.conditionId = conditionId;

  const idDisplay = card.querySelector('[data-display="condition-id"]');
  if (idDisplay) idDisplay.textContent = conditionId;

  // Give every card its own radio groups.
  card.querySelectorAll('input[type="radio"][data-field]').forEach((radio) => {
    radio.name = `${conditionId}-${radio.dataset.field}`;
  });

  // Start with no timing selected so the user must choose one.
  card.querySelectorAll('[data-field="timing"]').forEach((radio) => {
    radio.checked = false;
  });

  conditionsContainer.appendChild(fragment);

  const newCard = conditionsContainer.lastElementChild;

  updateConditionFields(newCard);
  updateConditionNumbers();
  updateNoConditionsState();

  newCard.querySelector('[data-field="condition"]').focus();
});

// REMOVE CONDITIONS AND UPDATE FIELDS
conditionsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest('[data-action="remove"]');
  if (!removeButton) return;

  removeButton.closest("[data-condition-card]").remove();

  updateConditionNumbers();
  updateNoConditionsState();
});

conditionsContainer.addEventListener("change", (event) => {
  const card = event.target.closest("[data-condition-card]");
  if (!card) return;

  if (event.target.matches('[data-field="timing"]')) {
    const selectedTiming = event.target.value;

    if (!card.dataset.initialTiming) {
      card.dataset.initialTiming = selectedTiming;
    }
  }

  updateConditionFields(card);

  const lastUpdated = card.querySelector('[data-display="last-updated"]');
  if (lastUpdated) lastUpdated.textContent = new Date().toLocaleString();
});

// VALIDATE BEFORE MOVING TO THE NEXT SECTION
nextConditionsButton.addEventListener("click", (event) => {
  const cards = conditionsContainer.querySelectorAll("[data-condition-card]");

  if (noConditionsCheckbox.checked && cards.length === 0) return;

  if (cards.length === 0) {
    event.preventDefault();
    noConditionsCheckbox.focus();
    return;
  }

  for (const card of cards) {
    const fields = card.querySelectorAll("input, textarea, select");

    for (const field of fields) {
      if (field.disabled) continue;

      if (!field.checkValidity()) {
        event.preventDefault();
        field.reportValidity();
        field.focus();
        return;
      }
    }
  }
});

// INITIALIZE
updateConditionNumbers();
conditionsContainer.querySelectorAll("[data-condition-card]").forEach((card) => {
  updateConditionFields(card);
});
updateNoConditionsState();

const recoveryField = document.getElementById("dc-recovery");
const recoveryReasonField = document.getElementById("dc-recovery-reason-field");
const recoveryReason = document.getElementById("dc-recovery-not-applicable-reason");
const recoveryNotApplicable = document.getElementById("dc-recovery-not-applicable");

const assumptionsContainer = document.getElementById("assumption-container");
const addAssumptionButton = document.getElementById("dc-add-assumption");
const noAssumptionsCheckbox = document.getElementById("dc-no-assumptions");

// RECOVERY
// An empty recovery field means the user must provide a reason.
function updateRecoveryFields() {
  const notApplicable = recoveryField.value.trim().toLowerCase() === "not applicable";

  recoveryReasonField.hidden = !notApplicable;
  recoveryReason.required = notApplicable;

  if (!notApplicable) {
    recoveryReason.value = "";
  }
}

recoveryField.addEventListener("input", updateRecoveryFields);
updateRecoveryFields();


// ASSUMPTIONS
function updateAssumptionNumbers() {
  const entries = assumptionsContainer.querySelectorAll(".assumption-entry");
  const noneSelected = noAssumptionsCheckbox.checked;

  entries.forEach((entry, index) => {
    const label = entry.querySelector(".field-label");
    const removeButton = label.querySelector(".remove-assumption");
    const textarea = entry.querySelector('textarea[name="keyAssumptions[]"]');

    // Update label without removing the button.
    label.firstChild.textContent = `Assumption ${index + 1} `;

    if (removeButton) {
      removeButton.hidden = entries.length === 1;
      label.appendChild(removeButton);
    }

    textarea.required = !noneSelected;
    textarea.disabled = noneSelected;
  });

  addAssumptionButton.disabled = noneSelected;
  entries.forEach((entry) => {
    entry.hidden = noneSelected;
  });
}


// Add another assumption.
addAssumptionButton.addEventListener("click", () => {
  if (noAssumptionsCheckbox.checked) {
    noAssumptionsCheckbox.checked = false;
  }

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

  entry.querySelector("textarea").focus();
});


// Remove an assumption using event delegation.
assumptionsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-assumption");
  if (!removeButton) return;

  removeButton.closest(".assumption-entry").remove();
  updateAssumptionNumbers();
});


// None identified.
noAssumptionsCheckbox.addEventListener("change", () => {
  if (noAssumptionsCheckbox.checked) {
    assumptionsContainer.querySelectorAll('textarea[name="keyAssumptions[]"]').forEach((textarea) => {
      textarea.value = "";
    });
  }

  updateAssumptionNumbers();
});

updateAssumptionNumbers();


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

// Update text inputs and dates.
decisionDetailFields.forEach(({ input, output, type }) => {
  const inputElement = document.getElementById(input);
  const outputElement = document.getElementById(output);

  if (!inputElement || !outputElement) return;

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

  // Initialize the review display.
  updateValue();
});

// Capital event radio group.
const capitalEventRadios = document.querySelectorAll(
  'input[name="capitalEvent"]'
);
const capitalEventOutput = document.getElementById("record-capital-event");

function updateCapitalEvent() {
  const selected = document.querySelector(
    'input[name="capitalEvent"]:checked'
  );

  capitalEventOutput.textContent = selected
    ? selected.parentElement.textContent.trim()
    : "";
}

capitalEventRadios.forEach((radio) => {
  radio.addEventListener("change", updateCapitalEvent);
});

updateCapitalEvent();

// Proposed action radio group.
const proposedActionRadios = document.querySelectorAll(
  'input[name="proposedAction"]'
);
const proposedActionOutput = document.getElementById("record-proposed-action");

function updateRecordProposedAction() {
  const selected = document.querySelector(
    'input[name="proposedAction"]:checked'
  );

  proposedActionOutput.textContent = selected
    ? selected.value.toUpperCase()
    : "";
}

proposedActionRadios.forEach((radio) => {
  radio.addEventListener("change", updateRecordProposedAction);
});

updateRecordProposedAction();




const materialEvidenceInput = document.getElementById("dc-materialEvidence");
const materialEvidenceOutput = document.getElementById("record-material-evidence");

const riskEntriesContainer = document.getElementById("dc-risk-entries");
const acceptedRisksOutput = document.getElementById("record-accepted-risks");

// MATERIAL EVIDENCE
function updateMaterialEvidence() {
  materialEvidenceOutput.textContent = materialEvidenceInput.value.trim();
}

materialEvidenceInput.addEventListener("input", updateMaterialEvidence);
updateMaterialEvidence();

// ACCEPTED RISKS
function updateAcceptedRisks() {
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

// Update when a risk is edited.
riskEntriesContainer.addEventListener("input", (event) => {
  if (event.target.matches('textarea[name="acceptedRisks[]"]')) {
    updateAcceptedRisks();
  }
});

// Update when risks are added or removed.
// The existing repeater changes the DOM, so observe those changes too.
const riskObserver = new MutationObserver(updateAcceptedRisks);

riskObserver.observe(riskEntriesContainer, {
  childList: true,
  subtree: true
});

updateAcceptedRisks();




const conditionRegister = document.getElementById("dc-condition-register");

const recordNoConditions = document.getElementById("record-no-conditions");
const recordConditionEntries = document.getElementById("record-condition-entries");

// CONDITIONS REVIEW
function updateConditionReview() {
  const cards = conditionRegister.querySelectorAll("[data-condition-card]");
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
    const conditionText = card.querySelector('[data-field="condition"]')?.value.trim() || "";
    const timing = card.querySelector('[data-field="timing"]:checked');
    const owner = card.querySelector('[data-field="owner"]')?.value.trim() || "";
    const dueDate = card.querySelector('[data-field="dueDate"]')?.value || "";
    const evidence = card.querySelector('[data-field="evidence"]')?.value.trim() || "";
    const waiverScope = card.querySelector('[data-field="waiverScope"]')?.value.trim() || "";
    const status = card.querySelector('[data-field="status"]:checked');
    const resolutionNote = card.querySelector('[data-field="resolutionNote"]')?.value.trim() || "";
    const acceptedBy = card.querySelector('[data-field="acceptedBy"]')?.value.trim() || "";
    const acceptedAt = card.querySelector('[data-field="acceptedAt"]')?.value || "";
    const reclassificationNote = card.querySelector('[data-field="reclassificationNote"]')?.value.trim() || "";
    const lastUpdated = card.querySelector('[data-display="last-updated"]')?.textContent.trim() || "";

    function addDetail(label, value) {
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      row.appendChild(strong);
      row.appendChild(document.createTextNode(value || "Not provided"));
      entry.appendChild(row);
    }

    entry.appendChild(title);

    addDetail("Condition ID", conditionId);
    addDetail("Condition", conditionText);
    addDetail("When it must be met", timing?.parentElement.textContent.trim() || "");
    addDetail("Owner", owner);

    if (dueDate) {
      const [year, month, day] = dueDate.split("-");
      addDetail("Due date", `${month}/${day}/${year}`);
    } else {
      addDetail("Due date", "");
    }

    addDetail("Evidence required", evidence);
    addDetail("Permitted waiver scope", waiverScope);
    addDetail("Status", status?.parentElement.textContent.trim() || "");
    addDetail("Resolution note", resolutionNote);

    if (acceptedBy) addDetail("Accepted by", acceptedBy);
    if (acceptedAt) addDetail("Acceptance date and time", acceptedAt);
    if (reclassificationNote) {
      addDetail("Reclassification explanation", reclassificationNote);
    }

    addDetail("Last updated", lastUpdated);

    recordConditionEntries.appendChild(entry);
  });
}

// Update the review when condition fields change.
conditionRegister.addEventListener("input", updateConditionReview);
conditionRegister.addEventListener("change", updateConditionReview);

// Detect conditions added or removed by the repeater.
const conditionReviewObserver = new MutationObserver(updateConditionReview);

conditionReviewObserver.observe(conditionRegister, {
  childList: true,
  subtree: true
});

// Update when the no-conditions declaration changes.
noConditionsCheckbox.addEventListener("change", updateConditionReview);

// Initial render.
updateConditionReview();



const consequenceQuestionInput = document.getElementById("dc-consequence-question");

const recordConsequenceQuestion = document.getElementById("record-consequence-question");
const recordConsequence = document.getElementById("record-consequence");

// Update the displayed consequence question.
function updateRecordConsequenceQuestion() {
  recordConsequenceQuestion.textContent = consequenceQuestionInput.textContent.trim();
}

// Update the displayed consequence statement.
function updateRecordConsequence() {
  recordConsequence.textContent = consequenceInput.value.trim();
}

// Listen for changes.
consequenceInput.addEventListener("input", updateRecordConsequence);

// The action logic updates the question's text, so observe those changes.
const consequenceQuestionObserver = new MutationObserver(
  updateRecordConsequenceQuestion
);

consequenceQuestionObserver.observe(consequenceQuestionInput, {
  childList: true,
  characterData: true,
  subtree: true
});

// Initial values.
updateRecordConsequenceQuestion();
updateRecordConsequence();


// RECOVERY REVIEW


function updateRecoveryFields() {
  const notApplicable = recoveryNotApplicable.checked;

  recoveryReasonField.hidden = !notApplicable;
  recoveryReasonInput.required = notApplicable;
  recoveryInput.required = !notApplicable;

  if (notApplicable) {
    recoveryInput.value = "";
  } else {
    recoveryReasonInput.value = "";
  }

  updateRecoveryReview();
}

function updateRecoveryReview() {
  recoveryOutput.replaceChildren();

  if (recoveryNotApplicable.checked) {
    const status = document.createElement("p");
    status.textContent = "Recovery: Not applicable";

    const reason = document.createElement("p");
    const label = document.createElement("strong");
    label.textContent = "Reason: ";
    reason.append(label, document.createTextNode(
      recoveryReasonInput.value.trim() || "Not provided"
    ));

    recoveryOutput.append(status, reason);
    return;
  }

  recoveryOutput.textContent = recoveryInput.value.trim() || "Not provided";
}

recoveryInput.addEventListener("input", updateRecoveryReview);
recoveryReasonInput.addEventListener("input", updateRecoveryReview);
recoveryNotApplicable.addEventListener("change", updateRecoveryFields);

updateRecoveryFields();


// ASSUMPTIONS REVIEW
const assumptionContainer = document.getElementById("assumption-container");
const assumptionsOutput = document.getElementById("record-assumptions");

function updateAssumptionsReview() {
  assumptionsOutput.replaceChildren();

  if (noAssumptionsCheckbox.checked) {
    assumptionsOutput.textContent = "No key assumptions identified.";
    return;
  }

  const assumptionInputs = assumptionContainer.querySelectorAll(
    'textarea[name="keyAssumptions[]"]'
  );

  const enteredAssumptions = Array.from(assumptionInputs)
    .map(input => input.value.trim())
    .filter(value => value !== "");

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

assumptionContainer.addEventListener("input", event => {
  if (event.target.matches('textarea[name="keyAssumptions[]"]')) {
    updateAssumptionsReview();
  }
});

assumptionContainer.addEventListener("change", event => {
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

    addAssumptionButton.disabled = noAssumptionsCheckbox.checked;
    updateAssumptionsReview();
  }
});

// Watch for assumptions added or removed dynamically.
const assumptionObserver = new MutationObserver(updateAssumptionsReview);

assumptionObserver.observe(assumptionContainer, {
  childList: true,
  subtree: true
});

updateAssumptionsReview();

// DECISION BASIS REVIEW
const decisionBasisInput = document.getElementById("dc-decisionBasis");
const decisionBasisOutput = document.getElementById("record-decision-basis");

function updateDecisionBasisReview() {
  decisionBasisOutput.textContent =
    decisionBasisInput.value.trim() || "Not provided";
}

decisionBasisInput.addEventListener("input", updateDecisionBasisReview);
updateDecisionBasisReview();

// ACCOUNTABILITY REVIEW FIELDS
const accountabilityApprovalAuthorityOutput = document.getElementById("record-accountability-approval-authority");

const confirmingPersonInput = document.getElementById("dc-confirmingPerson");
const confirmingPersonOutput = document.getElementById("record-confirming-person");

function updateAccountabilityReview() {
  accountabilityApprovalAuthorityOutput.textContent =
    approvalAuthorityInput.value.trim() || "Not provided";

  confirmingPersonOutput.textContent =
    confirmingPersonInput.value.trim() || "Not provided";
}

approvalAuthorityInput.addEventListener("input", updateAccountabilityReview);
confirmingPersonInput.addEventListener("input", updateAccountabilityReview);

updateAccountabilityReview();



// BEFORE YOU WIRE — LIVE STAGE 1 SUMMARY

function setSummaryValue(id, value) {
  const output = document.getElementById(id);
  if (output) output.textContent = value || "—";
}


setSummaryValue("byw-stage1-record-id", recordId);


// Transaction
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


// Closed decision
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


// Decision date
function updateDecisionDate() {
  const value = document.getElementById("dc-date")?.value;

  if (!value) {
    setSummaryValue("byw-decision-date", "");
    return;
  }

  const [year, month, day] = value.split("-");
  setSummaryValue("byw-decision-date", `${month}/${day}/${year}`);
}


// Approval authority
function updateApprovalAuthority() {
  setSummaryValue(
    "byw-authority",
    document.getElementById("dc-approvalAuthority")?.value.trim()
  );
}


// Consequence
function updateConsequence() {
  setSummaryValue(
    "byw-consequence",
    document.getElementById("dc-consequenceStatement")?.value.trim()
  );
}


// Assumptions
function updateAssumptions() {
  const output = document.getElementById("byw-assumptions");
  const noneSelected = document.getElementById("dc-no-assumptions")?.checked;

  output.replaceChildren();

  if (noneSelected) {
    const item = document.createElement("li");
    item.textContent = "No key assumptions identified.";
    output.appendChild(item);
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
    output.appendChild(item);
    return;
  }

  assumptions.forEach(assumption => {
    const item = document.createElement("li");
    item.textContent = assumption;
    output.appendChild(item);
  });
}


// Condition counts
function updateConditionCounts() {
  const noConditions = document.getElementById(
    "dc-no-unresolved-conditions"
  )?.checked;

  const cards = document.querySelectorAll(
    "#dc-condition-register [data-condition-card]"
  );

  if (noConditions) {
    setSummaryValue("byw-condition-counts", "No unresolved conditions identified.");
    return;
  }

  if (!cards.length) {
    setSummaryValue("byw-condition-counts", "No conditions entered.");
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
    const status = card.querySelector('[data-field="status"]:checked')?.value;
    if (status && Object.hasOwn(counts, status)) {
      counts[status]++;
    }
  });

  setSummaryValue(
    "byw-condition-counts",
    `Total: ${cards.length} | Open: ${counts.open} | Satisfied: ${counts.satisfied} | Waived: ${counts.waived} | Failed: ${counts.failed} | Changed: ${counts.changed}`
  );
}


// Attach listeners
document.querySelectorAll('input[name="capitalEvent"]').forEach(input => {
  input.addEventListener("change", updateTransaction);
});

document.querySelectorAll('input[name="proposedAction"]').forEach(input => {
  input.addEventListener("change", updateClosedDecision);
});

document.getElementById("dc-date")?.addEventListener("input", updateDecisionDate);
document.getElementById("dc-approvalAuthority")?.addEventListener("input", updateApprovalAuthority);
document.getElementById("dc-consequenceStatement")?.addEventListener("input", updateConsequence);


assumptionContainer?.addEventListener("input", updateAssumptions);
assumptionContainer?.addEventListener("change", updateAssumptions);


conditionRegister?.addEventListener("input", updateConditionCounts);
conditionRegister?.addEventListener("change", updateConditionCounts);

document.getElementById("dc-no-unresolved-conditions")?.addEventListener(
  "change",
  updateConditionCounts
);

// Detect dynamically added or removed assumption and condition entries.
const summaryObserver = new MutationObserver(() => {
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


// Initial population
updateTransaction();
updateClosedDecision();
updateDecisionDate();
updateApprovalAuthority();
updateConsequence();
updateAssumptions();
updateConditionCounts();



document.querySelector('#dk-view-pdf-btn').addEventListener('click', (e) => {

    // e.preventDefault();

    // const formData = new FormData(e.target);

    generatePDF(); 

});




// document.querySelector('form').addEventListener('submit', (e) => {

//     e.preventDefault();

//     const formData = new FormData(e.target);

//     generatePDF(formData, recordId); 

// });

//     // =====================================================
//     // PDF STARTS HERE
//     // =====================================================



function addHeader(doc) {

    // -------------------------
    // Logo placeholder
    // -------------------------

    doc
        .rect(50, 30, 35, 35)
        .fill('#1470af');

    doc
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .fontSize(22)
        .text('W', 50, 35, {
            width: 35,
            align: 'center',
            lineBreak: false
        });


    // -------------------------
    // Header title
    // -------------------------

    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('Deal Killers', 100, 30, {
            width: 412,
            align: 'center',
            lineBreak: false
        });


    // -------------------------
    // Header line
    // -------------------------

    doc
        .moveTo(100, 55)
        .lineTo(512, 55)
        .lineWidth(1)
        .strokeColor('#1470af')
        .stroke();


    // -------------------------
    // Header subtitle
    // -------------------------

    doc
        .font('Helvetica-Oblique')
        .fontSize(9)
        .fillColor('#555555')
        .text('an analysis tool from John', 100, 60, {
            width: 412,
            align: 'center',
            lineBreak: false
        });


    // Reset text color
    doc.fillColor('#000000');
}


function addFooter(doc) {

    const pageWidth = 612;
    const pageHeight = 792;


    // -------------------------
    // Footer line
    // -------------------------

    doc
        .moveTo(50, pageHeight - 55)
        .lineTo(pageWidth - 50, pageHeight - 55)
        .lineWidth(0.5)
        .strokeColor('#CCCCCC')
        .stroke();


    // -------------------------
    // Footer text
    // -------------------------

    doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#777777')
        .text(
            'Deal Killers • Professional Decision-Support Tool',
            50,
            pageHeight - 45,
            {
                width: 400,
                align: 'left',
                lineBreak: false
            }
        );


    // -------------------------
    // Page number
    // -------------------------

    doc
        .text(
            `Page ${doc.page.index + 1}`,
            450,
            pageHeight - 45,
            {
                width: 110,
                align: 'right',
                lineBreak: false
            }
        );


    // Reset text color
    doc.fillColor('#000000');
}


function generatePDF(formData, recordId) {

//       // =====================================================
//     // CREATE PDF
//     // =====================================================

    const doc = new PDFDocument({
        font: 'Helvetica'
    });


//     // =====================================================
//     // HEADER / FOOTER
//     // =====================================================

    // Add header/footer to every NEW page
    doc.on('pageAdded', function () {

        addHeader(doc);
        // addFooter(doc);

    });

    // Add header/footer to first page
    addHeader(doc);
    // addFooter(doc);

    // Start content below header
    doc.y = 100;


//     // =====================================================
//     // COLLECT PDF DATA
//     // =====================================================

    const chunks = [];


    doc.on('data', function (chunk) {

        chunks.push(chunk);

    });


//     // =====================================================
//     // PDF FINISHED
//     // =====================================================

    doc.on('end', function () {

        console.log('PDF generated!');
        console.log('Chunks:', chunks.length);


        const blob = new Blob(chunks, {
            type: 'application/pdf'
        });

        const url = URL.createObjectURL(blob);

        console.log(url); 


        // View PDF button
        const viewBtn = document.getElementById('dk-view-pdf-btn');

        viewBtn.href = url;
        viewBtn.target = '_blank';
        viewBtn.style.display = 'inline-block';


        // Download PDF button
        // const downloadBtn = document.getElementById('dk-download-btn');

        // downloadBtn.href = url;
        // downloadBtn.download = 'walk-away-results.pdf';
        // downloadBtn.style.display = 'inline-block';

         // Show success screen
        // const successSection = document.getElementById('success-section');

        // if (successSection) {
        //     showSection(successSection);
        // }

    });


//     // =====================================================
//     // CREATE PDF SECTIONS
//     // =====================================================

    const title = 'Walk Away Decision Record'; 


    // createPDFIntro(
    //     doc,
    //     formData,
    //     title
    // );

    // PDFCreateTable(
    //     doc,
    //     formData,
    //     recordId
    // );

    // PDFCreateDecisionRecord(
    //     doc,
    //     formData,
    //     recordId
    // );

    // createPDFFourChecks(
    //     doc,
    //     formData,
    //     recordId
    // );

    // createPDFProofRequired(
    //     doc,
    //     formData,
    //     recordId
    // );


    doc.end();

}


function createPDFIntro(doc, formData, title) {

    const decision = formData.get('decision');

    let decisionText; 

    if (decision === 'stop') { 

        decisionText = 'STOP'; 

    } else if (decision === 'continue') {

        decisionText = 'CONTINUE'; 

    } else if (decision === 'require-proof') {

        decisionText = 'REQUIRE MORE PROOF'; 

    }


    // Title
    doc
        .font('Helvetica-Bold')
        .fontSize(30)
        .text(title, 50, doc.y);


    doc.moveDown();


    // Selected decision
    doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('SELECTED DECISION: ', {
            continued: true
        })
        .font('Helvetica')
        .text(decisionText, {
            width: 510,
            align: 'left'
        });


    doc.moveDown();

}


function PDFCreateTable(doc, formData, recordId) {

    const dealReference = formData.get('dealReference');
    const decisionOwner = formData.get('email');
    const decisionDate = formData.get('date');


    // Generate timestamp
    const generatedTimestamp = new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    }); 


    // Format decision date
    const formattedDate = decisionDate
        ? new Date(`${decisionDate}T00:00:00`).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        : '';


    const tableX = 50;
    const tableWidth = 512;

    const detailWidth = 200;
    const valueWidth = tableWidth - detailWidth;

    const headerHeight = 32;


    const rows = [
        [
            'Decision / deal name',
            dealReference
        ],
        [
            'Decision owner',
            decisionOwner
        ],
        [
            'Decision date',
            formattedDate
        ],
        [
            'Record ID',
            recordId
        ],
        [
            'Generated',
            generatedTimestamp
        ]
    ];


    // Font settings
    const headerFontSize = 14;
    const bodyFontSize = 12;


    // Row settings
    const rowLineHeight = 12;
    const minimumRowHeight = rowLineHeight * 2;


    // Calculate row heights based on the value column
    doc
        .font('Helvetica')
        .fontSize(bodyFontSize);


    const rowHeights = rows.map(row => {

        const valueHeight = doc.heightOfString(row[1] || '', {
            width: valueWidth - 20,
            lineGap: 0
        });

        return Math.max(
            minimumRowHeight,
            valueHeight
        ) + 8;

    });


    // Header
    const headerY = doc.y;


    doc
        .fillColor('#E6E6E6')
        .rect(tableX, headerY, detailWidth, headerHeight)
        .fill();


    doc
        .rect(
            tableX + detailWidth,
            headerY,
            valueWidth,
            headerHeight
        )
        .fill();


    // Header borders
    doc
        .strokeColor('#104E75')
        .lineWidth(1)
        .rect(tableX, headerY, detailWidth, headerHeight)
        .stroke();


    doc
        .rect(
            tableX + detailWidth,
            headerY,
            valueWidth,
            headerHeight
        )
        .stroke();


    // Header text
    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(headerFontSize)
        .text(
            'Decision Details',
            tableX + 10,
            headerY + 10,
            {
                width: detailWidth - 20
            }
        )
        .text(
            'Recorded value',
            tableX + detailWidth + 10,
            headerY + 10,
            {
                width: valueWidth - 20
            }
        );


    // Rows
    let currentY = headerY + headerHeight;


    rows.forEach((row, index) => {

        const rowHeight = rowHeights[index];

        const x1 = tableX;
        const x2 = tableX + detailWidth;


        // Cell backgrounds
        doc
            .fillColor('#FFFFFF')
            .rect(x1, currentY, detailWidth, rowHeight)
            .fill();


        doc
            .rect(x2, currentY, valueWidth, rowHeight)
            .fill();


        // Cell borders
        doc
            .strokeColor('#104E75')
            .lineWidth(1)
            .rect(x1, currentY, detailWidth, rowHeight)
            .stroke();


        doc
            .rect(x2, currentY, valueWidth, rowHeight)
            .stroke();


        // Cell text
        doc
            .fillColor('#000000')
            .font('Helvetica')
            .fontSize(bodyFontSize)
            .text(
                row[0],
                x1 + 10,
                currentY + 6,
                {
                    width: detailWidth - 20,
                    lineGap: 0
                }
            )
            .text(
                row[1] || '',
                x2 + 10,
                currentY + 6,
                {
                    width: valueWidth - 20,
                    lineGap: 0
                }
            );


        currentY += rowHeight;

    });


    // Move below table
    doc.y = currentY;


    // Reset formatting
    doc
        .fillColor('#000000')
        .strokeColor('#000000')
        .font('Helvetica')
        .fontSize(12);

}


function PDFCreateDecisionRecord(doc, formData, recordId) {

    const concern = formData.get('concern'); 
    const commit = formData.get('commit'); 
    const supportingFacts = formData.get('supportingFacts'); 
    const opposingFacts = formData.get('opposingFacts'); 
    const missingFacts = formData.get('missingFacts');
    const consequence = formData.get('consequence'); 


    const contentBottom = 730;


    function checkPageSpace(requiredSpace) {

        if (doc.y + requiredSpace > contentBottom) {

            doc.addPage();
            doc.y = 100;

        }

    }


    // Space before first section
    doc.y += 30;


    // Concern
    checkPageSpace(100);

    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Concern', 50, doc.y);

    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            concern,
            50,
            doc.y
        );

    doc.moveDown();


    // Next commitment
    checkPageSpace(100);

    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Next commitment', 50, doc.y);

    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            commit,
            50,
            doc.y
        );

    doc.moveDown();


    // Facts supporting the next step
    checkPageSpace(100);

    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Facts supporting the next step', 50, doc.y);

    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            supportingFacts,
            50,
            doc.y
        );

    doc.moveDown();


    // Facts arguing against the next step
    checkPageSpace(100);

    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Facts arguing against the next step', 50, doc.y);

    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            opposingFacts,
            50,
            doc.y
        );

    doc.moveDown();


    // Missing or unverified facts
    checkPageSpace(100);

    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Missing or unverified facts', 50, doc.y);

    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            missingFacts,
            50,
            doc.y
        );

    doc.moveDown();


    // Consequence
    checkPageSpace(100);

    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Consequence', 50, doc.y);

    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            consequence,
            50,
            doc.y
        );

}


function createPDFFourChecks(doc, formData, recordId) {

    const dealReference = formData.get('dealReference'); 
    const decision = formData.get('decision'); 
    const evidenceEnough = formData.get('evidenceEnough'); 
    const wrongConsequence = formData.get('wrongConsequence'); 
    const momentum = formData.get('momentum'); 
    const undoability = formData.get('undoability'); 
    const decisionRightNow = formData.get('decision-right-now'); 
    const conditions = formData.get('conditions');  


    doc.addPage(); 
    doc.y = 100;


    // Deal reference
    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(dealReference, 50, doc.y);


    doc
        .font('Helvetica-Oblique')
        .fontSize(10)
        .text(recordId, 50, doc.y);


    doc.moveDown();


    // Selected decision
    doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .text(`SELECTED DECISION: ${decision}`, 50, doc.y);


    doc.moveDown();


    // Section title
    doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .text('Four decision checks', 50, doc.y);


    // Table settings
    const tableX = 50;
    const tableWidth = 512;
    const checkWidth = 350;
    const answerWidth = tableWidth - checkWidth;
    const rowHeight = 32;


    const rows = [
        ['Evidence Sufficiency', evidenceEnough.toUpperCase()],
        ['Consequence Clarity', wrongConsequence.toUpperCase().replace('-', ' ')],
        ['Reversibility', undoability.toUpperCase()],
        ['Momentum / Sunk-Cost Pressure', momentum.toUpperCase()]
    ];


    // Header
    const headerY = doc.y;


    doc
        .rect(tableX, headerY, checkWidth, rowHeight)
        .fill('#E6E6E6');


    doc
        .rect(
            tableX + checkWidth,
            headerY,
            answerWidth,
            rowHeight
        )
        .fill('#E6E6E6');


    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(
            'Check',
            tableX + 10,
            headerY + 10,
            {
                width: checkWidth - 20
            }
        )
        .text(
            'Selected answer',
            tableX + checkWidth + 10,
            headerY + 10,
            {
                width: answerWidth - 20
            }
        );


    // Rows
    rows.forEach((row, index) => {

        const rowY = headerY + rowHeight + (index * rowHeight);


        doc
            .fillColor('#FFFFFF')
            .rect(tableX, rowY, checkWidth, rowHeight)
            .stroke('#CCCCCC');


        doc
            .rect(
                tableX + checkWidth,
                rowY,
                answerWidth,
                rowHeight
            )
            .stroke('#CCCCCC');


        doc
            .fillColor('#000000')
            .font('Helvetica')
            .fontSize(11)
            .text(
                row[0],
                tableX + 10,
                rowY + 10,
                {
                    width: checkWidth - 20
                }
            )
            .text(
                row[1] || '',
                tableX + checkWidth + 10,
                rowY + 10,
                {
                    width: answerWidth - 20
                }
            );

    });


    // Reset text formatting
    doc
        .fillColor('#000000')
        .font('Helvetica')
        .fontSize(12);


    doc.moveDown();
    doc.moveDown();


    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Decision basis', 50, doc.y);


    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            decisionRightNow,
            50,
            doc.y
        );

    if(conditions) {
    doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Decision Tension Conditions', 50, doc.y);


    doc
        .font('Helvetica')
        .fontSize(12)
        .text(
            conditions,
            50,
            doc.y
        );
    }
    

}


function createPDFProofRequired(doc, formData, recordId) {

    const proof = formData.get('proof'); 
    const whoObtain = formData.get('whoObtain'); 
    const watWhenObtain = formData.get('whenObtain'); 


    doc.addPage(); 
    doc.y = 100;


    // Section title
    doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .text('Proof required', 50, doc.y);


    doc.moveDown(0.75);


    // Table settings
    const tableX = 50;
    const tableWidth = 512;

    const proofWidth = 255;
    const whoWidth = 130;
    const byWidth = 75;
    const statusWidth = tableWidth - proofWidth - whoWidth - byWidth;

    const headerHeight = 32;


    const rows = [
        [
            proof,
            whoObtain,
            watWhenObtain,
            'Open'
        ],
    ];


    // Set body text formatting
    doc
        .font('Helvetica')
        .fontSize(10);


    // Row height is based only on Proof or action needed
    // Minimum height = 5 lines
    const rowLineHeight = 12;
    const minimumRowHeight = rowLineHeight * 5;


    const rowHeights = rows.map(row => {

        const proofHeight = doc.heightOfString(row[0] || '', {
            width: proofWidth - 20,
            lineGap: 0
        });


        return Math.max(
            minimumRowHeight,
            proofHeight
        ) + 8;

    });


    // Header
    const headerY = doc.y;


    doc
        .fillColor('#E6E6E6')
        .rect(
            tableX,
            headerY,
            proofWidth,
            headerHeight
        )
        .fill();


    doc
        .rect(
            tableX + proofWidth,
            headerY,
            whoWidth,
            headerHeight
        )
        .fill();


    doc
        .rect(
            tableX + proofWidth + whoWidth,
            headerY,
            byWidth,
            headerHeight
        )
        .fill();


    doc
        .rect(
            tableX + proofWidth + whoWidth + byWidth,
            headerY,
            statusWidth,
            headerHeight
        )
        .fill();


    // Header text
    doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(
            'Proof or action needed',
            tableX + 10,
            headerY + 10,
            {
                width: proofWidth - 20
            }
        )
        .text(
            'Who will obtain it',
            tableX + proofWidth + 10,
            headerY + 10,
            {
                width: whoWidth - 20
            }
        )
        .text(
            'By when',
            tableX + proofWidth + whoWidth + 10,
            headerY + 10,
            {
                width: byWidth - 20
            }
        )
        .text(
            'Status',
            tableX + proofWidth + whoWidth + byWidth + 10,
            headerY + 10,
            {
                width: statusWidth - 20
            }
        );


    // Rows
    let currentY = headerY + headerHeight;


    rows.forEach((row, index) => {

        const rowHeight = rowHeights[index];

        const x1 = tableX;
        const x2 = tableX + proofWidth;
        const x3 = x2 + whoWidth;
        const x4 = x3 + byWidth;


        // Cell borders
        doc
            .fillColor('#FFFFFF')
            .rect(
                x1,
                currentY,
                proofWidth,
                rowHeight
            )
            .stroke('#CCCCCC');


        doc
            .rect(
                x2,
                currentY,
                whoWidth,
                rowHeight
            )
            .stroke('#CCCCCC');


        doc
            .rect(
                x3,
                currentY,
                byWidth,
                rowHeight
            )
            .stroke('#CCCCCC');


        doc
            .rect(
                x4,
                currentY,
                statusWidth,
                rowHeight
            )
            .stroke('#CCCCCC');


        // Cell text
        doc
            .fillColor('#000000')
            .font('Helvetica')
            .fontSize(10)
            .text(
                row[0] || '',
                x1 + 10,
                currentY + 6,
                {
                    width: proofWidth - 20,
                    lineGap: 0
                }
            )
            .text(
                row[1] || '',
                x2 + 10,
                currentY + 6,
                {
                    width: whoWidth - 20,
                    lineGap: 0
                }
            )
            .text(
                row[2] || '',
                x3 + 10,
                currentY + 6,
                {
                    width: byWidth - 20,
                    lineGap: 0
                }
            )
            .text(
                row[3] || '',
                x4 + 10,
                currentY + 6,
                {
                    width: statusWidth - 20,
                    lineGap: 0
                }
            );


        currentY += rowHeight;

    });


    // Move below table
    doc.y = currentY;


    doc.moveDown(1.5);


    // Disclaimer
    doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#555555')
        .text(
            'This record documents the decision owner’s selected posture and stated basis for one live decision. It does not authorize capital commitment or release, replace required professional review, or provide legal, tax, accounting, or investment advice.',
            50,
            doc.y,
            {
                width: 512,
                align: 'left',
                lineGap: 0
            }
        );


    // Reset formatting
    doc
        .fillColor('#000000')
        .font('Helvetica')
        .fontSize(12);

}