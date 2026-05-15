// Show/hide the correct form fields when an insurance type is selected
// and make cards clickable to select the insurance type

document.addEventListener("DOMContentLoaded", function () {
  // Show/hide the correct form fields when a radio is selected
  var typeRadios = document.querySelectorAll('input[name="insuranceType"]');
  var autoFields = document.getElementById("auto-fields");
  var homeFields = document.getElementById("home-fields");
  var lifeFields = document.getElementById("life-fields");

  function showFields(selected) {
    if (autoFields) autoFields.style.display = "none";
    if (homeFields) homeFields.style.display = "none";
    if (lifeFields) lifeFields.style.display = "none";
    // Map radio value to correct container id
    var map = {
      autoQuote: "auto-fields",
      homeQuote: "home-fields",
      lifeQuote: "life-fields",
    };
    var selectedId = map[selected] || selected + "-fields";
    var selectedFields = document.getElementById(selectedId);
    if (selectedFields) selectedFields.style.display = "block";
  }

  // Listen for changes to insurance type radios
  typeRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      showFields(this.value);
    });
  });

  // Make cards clickable to select the insurance type
  var cardLabels = document.querySelectorAll(
    'label[for^="autoQuote"], label[for^="homeQuote"], label[for^="lifeQuote"]',
  );
  cardLabels.forEach(function (label) {
    label.addEventListener("click", function () {
      var forId = label.getAttribute("for");
      var radio = document.getElementById(forId);
      if (radio && !radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
      // Hide summary card and table when a new card is selected
      var card = document.getElementById("quoteSummaryCard");
      var table = document.getElementById("quote-summary");
      if (card) card.style.display = "none";
      if (table) table.style.display = "none";
      // Clear errors for all forms
      var forms = [
        document.getElementById("inlineQuoteFormAuto"),
        document.getElementById("inlineQuoteFormHome"),
        document.getElementById("inlineQuoteFormLife"),
      ];
      forms.forEach(function (form) {
        if (form) clearErrors(form);
      });
      // Hide insurance type error if present
      var insuranceTypeError = document.getElementById("insuranceTypeError");
      if (insuranceTypeError) {
        insuranceTypeError.textContent = "";
        insuranceTypeError.style.display = "none";
      }
    });
  });

  // Handle form submissions for all three forms
  // - Validates the form
  // - Logs auto form input values to the console for testing
  var autoForm = document.getElementById("inlineQuoteFormAuto");
  var homeForm = document.getElementById("inlineQuoteFormHome");
  var lifeForm = document.getElementById("inlineQuoteFormLife");

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm(e)) return;
    // determine which form was submitted and process accordingly
    if (e.target && e.target.id === "inlineQuoteFormAuto") {
      var name = document.getElementById("carDriverName").value.trim();
      var age = document.getElementById("carDriverAge").value;
      var zip = document.getElementById("carZipCode").value;
      var vehicleYear = document.getElementById("vehicleYear").value;
      var vehicleMake = document.getElementById("vehicleMake").value;
      var vehicleModel = document.getElementById("vehicleModel").value.trim();
      var mileageRaw = document.getElementById("vehicleMileage").value;
      // Map string values to representative numbers for calculation
      var mileageMap = {
        "Under 5000": 4000,
        "5000-10000": 7500,
        "10000-20000": 15000,
        "20000-50000": 30000,
      };
      var mileage =
        mileageMap[mileageRaw] !== undefined
          ? mileageMap[mileageRaw]
          : Number(mileageRaw);
      var drivingRecord = document.getElementById("drivingRecord").value;
      var coverageLevel = document.querySelector(
        'input[name="coverageLevelAuto"]:checked',
      )?.value;
      // Normalize to lowercase for lookup
      var normalizedCoverageLevel = coverageLevel
        ? coverageLevel.toLowerCase()
        : undefined;
      console.log("Auto Form Inputs:", {
        name,
        age,
        zip,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        mileage,
        drivingRecord,
        coverageLevel,
      });

      // Prepare data for premium calculation and breakdown
      var autoData = {
        age: Number(age),
        vehicleYear: Number(vehicleYear),
        mileage: Number(mileage),
        drivingRecord: drivingRecord,
        coverageLevel: normalizedCoverageLevel,
      };
      var premium = calculateAutoPremium(autoData);
      showAutoQuoteBreakdown(autoData, premium);
      showQuoteSummaryCard({
        name: name,
        insuranceType: "Auto Insurance",
        monthlyPremium: premium,
      });
    } else if (e.target && e.target.id === "inlineQuoteFormHome") {
      // Similar processing for home form inputs and premium calculation
      var name = document.getElementById("homeOwnerName").value.trim();
      var age = document.getElementById("homeOwnerAge").value;
      var zip = document.getElementById("homeZipCode").value;
      var homeValue = document.getElementById("homeValue").value;
      var yearBuilt = document.getElementById("yearBuilt").value;
      var squareFootage = document.getElementById("squareFootage").value;
      var constructionType = document.getElementById("constructionType").value;
      var hasSecuritySystem =
        document.getElementById("hasSecuritySystem").checked;
      var hasSprinklers = document.getElementById("hasFireSprinklers").checked;
      var coverageLevel = document.querySelector(
        'input[name="coverageLevelHome"]:checked',
      )?.value;
      var normalizedCoverageLevel = coverageLevel
        ? coverageLevel.toLowerCase()
        : undefined;
      console.log("Home Form Inputs:", {
        name,
        age,
        zip,
        homeValue,
        yearBuilt,
        squareFootage,
        constructionType,
        hasSecuritySystem,
        hasSprinklers,
        coverageLevel: normalizedCoverageLevel,
      });
      var homeData = {
        homeValue: Number(homeValue),
        yearBuilt: Number(yearBuilt),
        squareFootage: Number(squareFootage),
        constructionType: constructionType,
        hasSecuritySystem: hasSecuritySystem,
        hasSprinklers: hasSprinklers,
        coverageLevel: normalizedCoverageLevel,
      };
      var premium = calculateHomePremium(homeData);
      showHomeQuoteBreakdown(homeData, premium);
      showQuoteSummaryCard({
        name: name,
        insuranceType: "Home Insurance",
        monthlyPremium: premium,
      });
    } else if (e.target && e.target.id === "inlineQuoteFormLife") {
      // Similar processing for life form inputs and premium calculation
      var name = document.getElementById("lifeName").value.trim();
      var age = document.getElementById("lifeAge").value;
      var zip = document.getElementById("lifeZipCode").value;
      var gender = document.getElementById("lifeGender").value;
      var smoker = document.querySelector(
        'input[name="smoker"]:checked',
      )?.value;
      var coverageAmount = document.getElementById("lifeCoverageAmount").value;
      //   map coverage amount string values to numbers for calculation
      var coverageAmountMap = {
        hundredThousand: 100000,
        twoHundredFiftyThousand: 250000,
        fiveHundredThousand: 500000,
        oneMillion: 1000000,
      };
      coverageAmount =
        coverageAmountMap[coverageAmount] !== undefined
          ? coverageAmountMap[coverageAmount]
          : Number(coverageAmount);

      var exercise = document.getElementById("exerciseFrequency").value;
      var preExistingCondition = document.querySelector(
        'input[name="condition"]:checked',
      )?.value;
      var coverageLevel = document.querySelector(
        'input[name="coverageLevelLife"]:checked',
      )?.value;
      var normalizedCoverageLevel = coverageLevel
        ? coverageLevel.toLowerCase()
        : undefined;
      // Log the inputs for the life form
      console.log("Life Form Inputs:", {
        name,
        age,
        zip,
        gender,
        smoker,
        coverageAmount,
        exercise,
        preExistingCondition,
        coverageLevel: normalizedCoverageLevel,
      });
      var lifeData = {
        age: Number(age),
        gender: gender,
        smoker: smoker,
        coverageAmount: coverageAmount,
        exercise: exercise,
        preExistingCondition: preExistingCondition,
        coverageLevel: normalizedCoverageLevel,
      };

      var premium = calculateLifePremium(lifeData);
      showLifeQuoteBreakdown(lifeData, premium);
      showQuoteSummaryCard({
        name: name,
        insuranceType: "Life Insurance",
        monthlyPremium: premium,
      });
    }
    // Populates and displays the summary card with customer name, insurance type, and premium values
    function showQuoteSummaryCard(options) {
      // options: { name, insuranceType, monthlyPremium }
      var card = document.getElementById("quoteSummaryCard");
      if (!card) return;
      var nameEl = document.getElementById("summaryCustomerName");
      var typeEl = document.getElementById("summaryInsuranceType");
      var monthlyEl = document.getElementById("summaryMonthlyPremium");
      var annualEl = document.getElementById("summaryAnnualPremium");
      if (nameEl) nameEl.textContent = options.name || "";
      if (typeEl) typeEl.textContent = options.insuranceType || "";
      if (monthlyEl)
        monthlyEl.textContent = options.monthlyPremium
          ? "$" +
            Number(options.monthlyPremium).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "";
      if (annualEl)
        annualEl.textContent = options.monthlyPremium
          ? "$" +
            (Number(options.monthlyPremium) * 12).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "";
      card.style.display = "block";
    }
  }

  if (autoForm) autoForm.addEventListener("submit", handleFormSubmit); // Handles auto form submit
  if (homeForm) homeForm.addEventListener("submit", handleFormSubmit); // Handles home form submit
  if (lifeForm) lifeForm.addEventListener("submit", handleFormSubmit); // Handles life form submit
});

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("getAnotherQuoteBtn");
  if (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      // Hide summary card and table
      var card = document.getElementById("quoteSummaryCard");
      var table = document.getElementById("quote-summary");
      if (card) card.style.display = "none";
      if (table) table.style.display = "none";
      // Reset all forms
      var forms = [
        document.getElementById("inlineQuoteFormAuto"),
        document.getElementById("inlineQuoteFormHome"),
        document.getElementById("inlineQuoteFormLife"),
      ];
      forms.forEach(function (form) {
        if (form) form.reset();
      });
      // Unselect insurance type
      var radios = document.querySelectorAll('input[name="insuranceType"]');
      radios.forEach(function (r) {
        r.checked = false;
      });
      // Hide all quote fields
      var autoFields = document.getElementById("auto-fields");
      var homeFields = document.getElementById("home-fields");
      var lifeFields = document.getElementById("life-fields");
      if (autoFields) autoFields.style.display = "none";
      if (homeFields) homeFields.style.display = "none";
      if (lifeFields) lifeFields.style.display = "none";
    });
  }
});

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
// function showError(inputElement, message) {
//   inputElement.classList.add("is-invalid");
//   var feedback = inputElement.nextElementSibling;
//   if (feedback && feedback.classList.contains("invalid-feedback")) {
//     feedback.textContent = message;
//   }
// }

function clearErrors(form) {
  var invalids = form.querySelectorAll(".is-invalid");
  invalids.forEach(function (el) {
    el.classList.remove("is-invalid");
  });
  var feedbacks = form.querySelectorAll(".invalid-feedback");
  feedbacks.forEach(function (el) {
    el.textContent = "";
    el.style.display = "none";
  });
}

function validateForm(e) {
  var insuranceType = document.querySelector(
    'input[name="insuranceType"]:checked',
  );
  if (!insuranceType) {
    // Show an inline error for insurance type selection
    var insuranceTypeError = document.getElementById("insuranceTypeError");
    if (insuranceTypeError) {
      insuranceTypeError.textContent = "Please select an insurance type.";
      insuranceTypeError.style.display = "block";
    }
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

  //   New attempt at validate required fields
  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.classList.add("is-invalid");
    // Find the next .invalid-feedback element after the input
    let error = input.nextElementSibling;
    while (error && !error.classList.contains("invalid-feedback")) {
      error = error.nextElementSibling;
    }
    if (error) {
      error.textContent = message;
      error.style.display = "block";
    }
  }

  //   function validateForm(data) {
  //     let isValid = true;

  //     if (data.carDriverName.length < 2) {
  //       showError("carDriverName", "Please enter a valid full name.");
  //       isValid = false;
  //     }
  //     return isValid;
  //   }

  // Validate required fields
  for (var i = 0; i < requiredFields.length; i++) {
    var field = document.getElementById(requiredFields[i]);
    if (!field || !field.value.trim()) {
      showError(field, "This field is required.");
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
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    return false;
  }

  return true;
}

// Dynamically add breakdown rows to the quote summary table
// Use textContent to set cell values and ensure proper escaping of special characters
function addBreakdownRow(tbody, factor, userValue, impact) {
  var row = document.createElement("tr");
  var dataFactor = document.createElement("td");
  var dataValue = document.createElement("td");
  var dataImpact = document.createElement("td");

  dataFactor.textContent = factor;
  dataValue.textContent = userValue;
  dataImpact.textContent = impact;
  row.appendChild(dataFactor);
  row.appendChild(dataValue);
  row.appendChild(dataImpact);
  tbody.appendChild(row);
}

// Processing quote submission
/* Auto rate calculation based on:
Factor Formula
1. Base monthly rate $75
2. Age factor Under 25: ×1.5 / 25–65: ×1.0 / Over 65: ×1.3
3. Vehicle age (years old) Under 3 years: ×1.3 / 3–10 years: ×1.0 / Over 10 years: ×0.8
4. Mileage factor Under 5k: ×0.8 / 5–10k: ×1.0 / 10–15k: ×1.1 / 15–20k: ×1.3 / Over 20k: ×1.5
5. Driving record Clean: ×1.0 / 1 ticket: ×1.2 / 2+ tickets: ×1.5 / Accident: ×1.8
6. Coverage level Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4
Monthly premium = Base rate × Age factor × Vehicle age factor × Mileage factor × Driving record × Coverage level

Home rate calculation based on:
Factor formula
1. Base monthly rate Home value × 0.003 / 12
2. Year built factor Before 1970: ×1.4 / 1970–1999: ×1.1 / 2000+: ×1.0
3. Construction factor Wood: ×1.2 / Brick: ×1.0 / Concrete: ×0.9 / Steel: ×0.85
4. Size factor Per square foot: + $0.01/month
5. Security discount Has security system: ×0.95
6. Sprinkler discount Has sprinklers: ×0.92
7. Coverage level Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4

Life rate calculation based on:
Factor formula
1. Base monthly rate Coverage amount × 0.0005 / 12
2. Age factor 18–30: ×1.0 / 31–45: ×1.5 / 46–60: ×2.5 / 61–85: ×4.0
3. Smoker factor No: ×1.0 / Yes: ×2.0
4. Exercise frequency Rarely: ×1.3 / 1–2/week: ×1.1 / 3–4/week: ×1.0 / 5+/week: ×0.9
5. Pre-existing conditions No: ×1.0 / Yes: ×1.5
6. Gender factor Male: ×1.1 / Female: ×1.0 / Non-binary: ×1.05
7. Coverage level Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4
*/

// base coverage multipliers for each insurance type
const coverageMultipliers = {
  basic: 0.8,
  standard: 1.0,
  premium: 1.4,
};

// Auto functions
function getAutoAgeFactor(age) {
  if (age < 25) return 1.5;
  if (age <= 65) return 1.0;
  return 1.3;
}

function getAutoVehicleAgeFactor(year) {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  if (vehicleAge < 3) return 1.3;
  if (vehicleAge <= 10) return 1.0;
  return 0.8;
}

function getAutoMileageFactor(mileage) {
  if (mileage < 5000) return 0.8;
  if (mileage <= 10000) return 1.0;
  if (mileage <= 15000) return 1.1;
  if (mileage <= 20000) return 1.3;
  return 1.5;
}

function getAutoDrivingRecordFactor(record) {
  switch (record.toLowerCase()) {
    case "clean":
      return 1.0;
    case "1 ticket":
      return 1.2;
    case "2+ tickets":
      return 1.5;
    case "accident in last 3 years":
      return 1.8;
    default:
      return 1.0;
  }
}

function calculateAutoPremium(data) {
  const baseRate = 75;
  const ageFactor = getAutoAgeFactor(data.age);
  const vehicleAgeFactor = getAutoVehicleAgeFactor(data.vehicleYear);
  const mileageFactor = getAutoMileageFactor(data.mileage);
  const drivingRecordFactor = getAutoDrivingRecordFactor(data.drivingRecord);
  const coverageLevelMultiplier = coverageMultipliers[data.coverageLevel];

  return (
    baseRate *
    ageFactor *
    vehicleAgeFactor *
    mileageFactor *
    drivingRecordFactor *
    coverageLevelMultiplier
  ).toFixed(2);
}

// Home functions
function getHomeYearBuiltFactor(year) {
  if (year < 1970) return 1.4;
  if (year <= 1999) return 1.1;
  return 1.0;
}

function getHomeConstructionFactor(type) {
  switch (type.toLowerCase()) {
    case "wood":
      return 1.2;
    case "brick":
      return 1.0;
    case "concrete":
      return 0.9;
    case "steel":
      return 0.85;
    default:
      return 1.0;
  }
}

function calculateHomePremium(data) {
  const baseRate = (data.homeValue * 0.003) / 12;
  const yearBuiltFactor = getHomeYearBuiltFactor(data.yearBuilt);
  const constructionFactor = getHomeConstructionFactor(data.constructionType);
  const sizeFactor = (data.squareFootage * 0.01) / 12; // Convert to monthly
  const securityDiscount = data.hasSecuritySystem ? 0.95 : 1.0;
  const sprinklerDiscount = data.hasSprinklers ? 0.92 : 1.0;
  const coverageLevelMultiplier = coverageMultipliers[data.coverageLevel];

  return (
    baseRate *
    yearBuiltFactor *
    constructionFactor *
    (1 + sizeFactor) *
    securityDiscount *
    sprinklerDiscount *
    coverageLevelMultiplier
  ).toFixed(2);
}

// Life functions can be implemented similarly based on the life insurance factors

function getLifeAgeFactor(age) {
  if (age >= 18 && age <= 30) return 1.0;
  if (age <= 45) return 1.5;
  if (age <= 60) return 2.5;
  if (age <= 85) return 4.0;
  return 4.0; // For ages above 85, we can use the highest factor
}

function getLifeSmokerFactor(smoker) {
  return smoker.toLowerCase() === "yes" ? 2.0 : 1.0;
}

function getLifeExerciseFactor(exercise) {
  switch (exercise.toLowerCase()) {
    case "rarely":
      return 1.3;
    case "1-2 times/week":
      return 1.1;
    case "3-4 times/week":
      return 1.0;
    case "5+ times/week":
      return 0.9;
    default:
      return 1.0;
  }
}

function getLifePreExistingConditionFactor(condition) {
  return condition.toLowerCase() === "yes" ? 1.5 : 1.0;
}

function getLifeGenderFactor(gender) {
  switch (gender.toLowerCase()) {
    case "male":
      return 1.1;
    case "female":
      return 1.0;
    case "non-binary":
      return 1.05;
    default:
      return 1.0;
  }
}

function calculateLifePremium(data) {
  const baseRate = (Number(data.coverageAmount) * 0.0005) / 12;
  const ageFactor = getLifeAgeFactor(data.age);
  const smokerFactor = getLifeSmokerFactor(data.smoker);
  const exerciseFactor = getLifeExerciseFactor(data.exercise);
  const preExistingConditionFactor = getLifePreExistingConditionFactor(
    data.preExistingCondition,
  );
  const genderFactor = getLifeGenderFactor(data.gender);

  return (
    baseRate *
    ageFactor *
    smokerFactor *
    exerciseFactor *
    preExistingConditionFactor *
    genderFactor
  ).toFixed(2);
}

// Populates and displays the quote breakdown table for auto or home insurance based on the calculated premium and the factors that contributed to it. It dynamically creates table rows for each factor, showing the user input and how it impacted the premium calculation. The table is then made visible to the user. For life insurance, a similar function can be created to show the breakdown based on life insurance factors.
function showHomeQuoteBreakdown(data, premium) {
  var cardBody = document.getElementById("quote-summary");
  if (!cardBody) return;
  var tbody = cardBody.querySelector(".table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  // Calculate factors for display
  var baseRate = ((data.homeValue * 0.003) / 12).toFixed(2);
  var yearBuiltFactor = getHomeYearBuiltFactor(data.yearBuilt);
  var constructionFactor = getHomeConstructionFactor(data.constructionType);
  var sizeFactor = (data.squareFootage * 0.01).toFixed(2);
  var securityDiscount = data.hasSecuritySystem ? 0.95 : 1.0;
  var sprinklerDiscount = data.hasSprinklers ? 0.92 : 1.0;
  addBreakdownRow(tbody, "Base Rate", "$" + baseRate, "");
  addBreakdownRow(tbody, "Year Built", data.yearBuilt, "×" + yearBuiltFactor);
  addBreakdownRow(
    tbody,
    "Construction",
    data.constructionType,
    "×" + constructionFactor,
  );
  addBreakdownRow(
    tbody,
    "Square Footage",
    data.squareFootage + " sq ft",
    "+$" + sizeFactor + "/mo",
  );
  addBreakdownRow(
    tbody,
    "Security System",
    data.hasSecuritySystem ? "Yes" : "No",
    "×" + securityDiscount,
  );
  addBreakdownRow(
    tbody,
    "Fire Sprinklers",
    data.hasSprinklers ? "Yes" : "No",
    "×" + sprinklerDiscount,
  );
  addBreakdownRow(
    tbody,
    "Coverage Level",
    data.coverageLevel,
    "×" + coverageMultipliers[data.coverageLevel],
  );
  addBreakdownRow(tbody, "Total Monthly Premium", "", "$" + premium);
  // Unhide the table/card
  cardBody.style.display = "block";
}

function showAutoQuoteBreakdown(data, premium) {
  var cardBody = document.getElementById("quote-summary");
  if (!cardBody) return;
  var tbody = cardBody.querySelector(".table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  addBreakdownRow(tbody, "Base Rate", "$75", "");
  addBreakdownRow(
    tbody,
    "Age Factor",
    data.age,
    "×" + getAutoAgeFactor(data.age),
  );
  addBreakdownRow(
    tbody,
    "Vehicle Year",
    data.vehicleYear,
    "×" + getAutoVehicleAgeFactor(data.vehicleYear),
  );
  addBreakdownRow(
    tbody,
    "Mileage",
    data.mileage,
    "×" + getAutoMileageFactor(data.mileage),
  );
  addBreakdownRow(
    tbody,
    "Driving Record",
    data.drivingRecord,
    "×" + getAutoDrivingRecordFactor(data.drivingRecord),
  );
  addBreakdownRow(
    tbody,
    "Coverage Level",
    data.coverageLevel,
    "×" + coverageMultipliers[data.coverageLevel],
  );
  addBreakdownRow(tbody, "Total Monthly Premium", "", "$" + premium);
  // Unhide the table/card
  cardBody.style.display = "block";
}

function showLifeQuoteBreakdown(data, premium) {
  // Similar to the auto and home breakdown functions, but based on life insurance factors
  // This function can be implemented if a detailed breakdown for life insurance is desired
  var cardBody = document.getElementById("quote-summary");
  if (!cardBody) return;
  var tbody = cardBody.querySelector(".table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  addBreakdownRow(
    tbody,
    "Base Rate",
    "$" + ((data.coverageAmount * 0.0005) / 12).toFixed(2),
    "",
  );
  addBreakdownRow(
    tbody,
    "Age Factor",
    data.age,
    "×" + getLifeAgeFactor(data.age),
  );
  addBreakdownRow(
    tbody,
    "Smoker Factor",
    data.smoker,
    "×" + getLifeSmokerFactor(data.smoker),
  );
  addBreakdownRow(
    tbody,
    "Exercise Factor",
    data.exercise,
    "×" + getLifeExerciseFactor(data.exercise),
  );
  addBreakdownRow(
    tbody,
    "Pre-Existing Condition Factor",
    data.preExistingCondition,
    "×" + getLifePreExistingConditionFactor(data.preExistingCondition),
  );
  addBreakdownRow(
    tbody,
    "Gender Factor",
    data.gender,
    "×" + getLifeGenderFactor(data.gender),
  );
  addBreakdownRow(
    tbody,
    "Coverage Level",
    data.coverageLevel,
    "×" + coverageMultipliers[data.coverageLevel],
  );
  addBreakdownRow(tbody, "Total Monthly Premium", "", "$" + premium);
  // Unhide the table/card
  cardBody.style.display = "block";
}
