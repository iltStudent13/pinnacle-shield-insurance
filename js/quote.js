// Form validation to check for
//  1. An insurance type is selected
//  2. All required fields for that type are filled in
//  3. Numeric fields are within the valid range
//  4. ZIP code is exactly 5 digits (use a regex: /^\d{5}$/)
//  5. A coverage level is selected

function validateZipCode(zip) {
  return /^\d{5}$/.test(zip);
}
// is-invalid class to invalid inputs
function showError(inputElement, message) {
  inputElement.classList.add("is-invalid");
  var feedback = inputElement.nextElementSibling;
  if (feedback && feedback.classList.contains("invalid-feedback")) {
    feedback.textContent = message;
  }
}

function clearErrors(form) {
  var invalids = form.querySelectorAll(".is-invalid");
  invalids.forEach(function (el) {
    el.classList.remove("is-invalid");
  });
}

function validateForm(e) {
  var insuranceType = document.querySelector(
    'input[name="insuranceType"]:checked',
  );
  if (!insuranceType) {
    alert("Please select an insurance type.");
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    return false;
  }

  var type = insuranceType.value;
  var requiredFields = [];

  if (type === "autoQuote") {
    requiredFields = [
      "carDriverName",
      "carDriverAge",
      "carZipCode",
      "vehicleMake",
      "vehicleModel",
      "vehicleYear",
    ];
  } else if (type === "homeQuote") {
    requiredFields = [
      "homeOwnerName",
      "homeOwnerAge",
      "homeValue",
      "homeZipCode",
      "yearBuilt",
      "squareFootage",
    ];
  } else if (type === "lifeQuote") {
    requiredFields = [
      "lifeName",
      "lifeAge",
      "lifeZipCode",
      "lifeCoverageAmount",
    ];
  }

  // Clear previous errors
  var form = e && e.target ? e.target : document;
  clearErrors(form);

  // Validate required fields
  for (var i = 0; i < requiredFields.length; i++) {
    var field = document.getElementById(requiredFields[i]);
    if (!field || !field.value.trim()) {
      showError(field, "This field is required.");
      alert("Please fill in all required fields.");
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      return false;
    }
  }

  // Validate ZIP code
  var zipField = document.getElementById(
    type === "autoQuote"
      ? "carZipCode"
      : type === "homeQuote"
      ? "homeZipCode"
      : "lifeZipCode",
  );
  if (zipField && !validateZipCode(zipField.value)) {
    showError(zipField, "Please enter a valid 5-digit ZIP code.");
    alert("Please enter a valid 5-digit ZIP code.");
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    return false;
  }

  return true;
}
