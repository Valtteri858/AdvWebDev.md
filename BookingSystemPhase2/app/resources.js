// ===============================
// 1) DOM references muokattu
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");
const resourceDescriptionInput = document.getElementById("resourceDescription");

// Example roles
const role = "admin"; // "reserver" | "admin"

// Will hold a reference to the Create button so we can enable/disable it
let createButton = null;

// ===============================
// 2) Button creation helpers
// ===============================

const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

const BUTTON_DISABLED_CLASSES =
  "cursor-not-allowed opacity-50";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  // Keep disabled look in ONE place (here)
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  // Optional: remove hover feel when disabled (recommended UX)
  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else {
    // Only re-add if this button is supposed to have it
    // (for Create we know it is)
    if (btn.value === "create" || btn.textContent === "Create") {
      btn.classList.add("hover:bg-brand-dark/80");
    }
  }
}

function renderActionButtons() {
  createButton = addButton({
    label: "Create",
    type: "submit",
    value: "create",
    classes: BUTTON_ENABLED_CLASSES,
  });

  setButtonEnabled(createButton, false);
}

// ===============================
// 4) Input creation + validation 
// ===============================
function createResourceNameInput(container) {
  const input = document.createElement("input");
  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";
  input.className =
    "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-all";

  container.appendChild(input);
  return input;
}

function setInputVisualState(input, valid) {
  input.classList.remove("border-green-500", "bg-green-100", "border-red-500", "bg-red-100");

  if (valid) {
    input.classList.add("border-green-500", "bg-green-100");
  } else {
    input.classList.add("border-red-500", "bg-red-100");
  }
}

function isResourceNameValid(value) {
  const trimmed = value.trim();
  return (
    trimmed.length >= 5 &&
    trimmed.length <= 30 &&
    /^[a-zA-Z0-9äöåÄÖÅ ]+$/.test(trimmed)
  );
}

function isResourceDescriptionValid(value) { 
  const trimmed = value.trim();
  return (
    trimmed.length >= 10 &&
    trimmed.length <= 50 &&
    /^[a-zA-Z0-9äöåÄÖÅ ]+$/.test(trimmed)
  );
}

// ===============================
// 5) Attach validation 
// ===============================
const validationState = {
  name: false,
  description: false
};

function updateCreateButtonState() { 
  const allValid = validationState.name && validationState.description;
  setButtonEnabled(createButton, allValid);
}

function attachResourceNameValidation(input) { 
  input.addEventListener("input", () => {
    const valid = isResourceNameValid(input.value);
    setInputVisualState(input, valid);
    validationState.name = valid;
    updateCreateButtonState();
  });
}

function attachResourceDescriptionValidation(textarea) { 
  textarea.addEventListener("input", () => {
    const valid = isResourceDescriptionValid(textarea.value);
    setInputVisualState(textarea, valid);
    validationState.description = valid;
    updateCreateButtonState();
  });
}

// ===============================
// 6) Bootstrapping
// ===============================
renderActionButtons();

const resourceNameInput = createResourceNameInput(resourceNameContainer);
attachResourceNameValidation(resourceNameInput);
attachResourceDescriptionValidation(resourceDescriptionInput); 