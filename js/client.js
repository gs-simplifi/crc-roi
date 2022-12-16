var population = 250; // default
var annualInjury = 10; // default
var injuryCost = 3500; // default
var caseInhouse = 2 / 3;
var costPerCentageInhouse = 15;
var doNothingOccInjuryCost = 0;
var crcOccInjuryCost = 0;
var savingsOccInjury = 0;

var pcNumber = 75;
var pcCost = 1000; // default
var pccaseInhouse = 1 / 2;
var pcCostPerCentageInhouse = 25;
var typicalVisit = 4;
var doNothingPCCost = 0;
var crcPCCost = 0;
var savingsPC = 0;

var savingsNoStaff = 0;

// Initiatlize displays
$('#intlsos-case-cost').html((costPerCentageInhouse * injuryCost) / 100);
$('#intlsos-pccase-cost').html((pcCostPerCentageInhouse * pcCost) / 100);

$('#population').html(population);
updateOccInjuryCost();
updatePCCost();
noStaffSavings();
// Get population from slider

$('#myRange').on('change', function () {
  population = $(this).val();
  $('#population').html(population);
  updatePopulation();
});
// ------------------

// Select Scenario

$('input[type=radio][name=optionsCalc]').change(function () {
  if (this.value == 'intlsos') {
    if ($('#intlsosid').hasClass('displaynone')) {
      if ($('#nostaffid').hasClass('displaynone')) {
      } else {
        $('#nostaffid').toggleClass('displaynone');
      }
      $('#intlsosid').toggleClass('displaynone');
    }
  } else if (this.value == 'noStaff') {
    if ($('#nostaffid').hasClass('displaynone')) {
      if ($('#intlsosid').hasClass('displaynone')) {
      } else {
        $('#intlsosid').toggleClass('displaynone');
      }
      $('#nostaffid').toggleClass('displaynone');
    }
  }
});
// -------------------

// Get Annual Injury from slider
calcAndDisplayAnnualInjurySLider(annualInjury);

$('#annual-injury-slider').on('change', function () {
  annualInjury = $(this).val();
  calcAndDisplayAnnualInjurySLider(annualInjury);
  updateOccInjuryCost();
});
// ------------------

// Get  Injury Costs from inputs
$('#injury-cost').on('change', function () {
  injuryCost = $(this).val();
  $('#intlsos-case-cost').html((costPerCentageInhouse * injuryCost) / 100);
  updateOccInjuryCost();
});
// ------------------

// Primary Care Savings

// Get pcNumber from slider
cAdPCNumberSlider();

$('#pc-number-slider').on('change', function () {
  pcNumber = $(this).val();
  cAdPCNumberSlider();
  updatePCCost();
});
// ------------------
// Get  pc Costs from inputs
$('#injury-cost').on('change', function () {
  pcCost = $(this).val();
  $('#intlsos-pccase-cost').html((pcCostPerCentageInhouse * pcCost) / 100);
  updatePCCost();
});
// ------------------

function cAdPCNumberSlider() {
  var pcNumPer = (pcNumber / population) * 100;
  pcNumPer = Math.round(pcNumPer * 100) / 100;
  $('#pc-number-display').html(`${pcNumber}, ${pcNumPer}% of population`);
}

function cAdPCDoNothing() {
  doNothingPCCost = pcNumber * pcCost * typicalVisit;
  $('#do-nothing-pc-cost').html(numberWithCommas(doNothingPCCost));
}
function cAdPCCRC() {
  crcPCCost =
    (1 - pccaseInhouse) * pcNumber * pcCost * typicalVisit +
    (pccaseInhouse *
      pcNumber *
      pcCost *
      pcCostPerCentageInhouse *
      typicalVisit) /
      100;
  $('#crc-pc-cost').html(numberWithCommas(crcPCCost));
}
function cAdPCSavings() {
  savingsPC = doNothingPCCost - crcPCCost;
  $('.savings-pc').html(numberWithCommas(savingsPC));
}

function updatePCCost() {
  cAdPCDoNothing();
  cAdPCCRC();
  cAdPCSavings();
  noStaffSavings();
}

// ------ FUNCTIONS
function numberWithCommas(x) {
  x = Math.round(x);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calcAndDisplayAnnualInjurySLider(annualInjury) {
  var annualInjuryPer = (annualInjury / population) * 100;
  annualInjuryPer = Math.round(annualInjuryPer * 100) / 100;
  $('#annual-injury-display').html(
    `${annualInjury}, ${annualInjuryPer}% of population`
  );
}
function calcAndDisplayOccInjuryDoNothing() {
  doNothingOccInjuryCost = annualInjury * injuryCost;
  $('#do-nothing-occinjury-cost').html(
    numberWithCommas(doNothingOccInjuryCost)
  );
}
function calcAndDisplayOccInjuryCRC() {
  crcOccInjuryCost =
    (1 - caseInhouse) * annualInjury * injuryCost +
    (caseInhouse * annualInjury * injuryCost * costPerCentageInhouse) / 100;
  $('#crc-occinjury-cost').html(numberWithCommas(crcOccInjuryCost));
}
function calcAndDisplaySavingsOccInjury() {
  savingsOccInjury = doNothingOccInjuryCost - crcOccInjuryCost;

  $('.savings-occinjury').html(numberWithCommas(savingsOccInjury));
}
function updateOccInjuryCost() {
  calcAndDisplayOccInjuryDoNothing();
  calcAndDisplayOccInjuryCRC();
  calcAndDisplaySavingsOccInjury();
  noStaffSavings();
}
function updatePopulation() {
  calcAndDisplayAnnualInjurySLider(annualInjury);
  updateOccInjuryCost();
  updatePCCost();
}

function noStaffSavings() {
  savingsNoStaff = savingsOccInjury + savingsPC;
  $('.savings-nostaff-total').html(numberWithCommas(savingsNoStaff));
}

$('.max_min_button').click(function () {
  if ($(this).html() == '-') {
    $(this).html('+');
  } else {
    $(this).html('-');
  }
  var thisParent = $(this).parent();
  $(thisParent).next('.content_body').slideToggle();
});
