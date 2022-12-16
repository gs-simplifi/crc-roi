var calculationType = '';
var mortType = '';
var principal = '';
var baseRate = '';
var baseAmmor = '';
var baseStart = '';
const calTypeMaster = [
  'Monthly',
  'Semi-Monthly',
  'Bi-Weekly',
  'Weekly',
  'Accelerated Bi-Weekly',
  'Accelerated Weekly',
];

let dollarUS = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'CAD',
});
// dollarUS.format(requiredIncome[i]);

// Change Ammort Period Type
var ammortType = 'Years';
$('#ammortType').on('click', () => {
  if (ammortType === 'Years') {
    ammortType = 'Months';
    $('#ammortType').html('Months (Click to change)');
  } else {
    ammortType = 'Years';
    $('#ammortType').html('Years (Click to change)');
  }
});

$('#formInput').submit(async (e) => {
  e.preventDefault();

  try {
    mortType = $('#mortType').val();
    calculationType = $('#calculationType').val();
    principal = $('input[name="principal"]').val();
    baseRate = $('input[name="baseRate"]').val();
    baseAmmor = $('input[name="baseAmmor"]').val();
    baseStart = $('input[name="baseStart"]').val();
    console.log(calTypeMaster[Number(calculationType)]);
    const baseResult = calculateMortgage(
      calculationType,
      principal,
      baseRate,
      baseAmmor,
      ammortType,
      baseStart
    );

    console.log(baseResult);

    var html =
      '<table class="table"><thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Payment</th><th scope="col">Interest</th><th scope="col">Principal</th><th scope="col">End Principal</th>';

    html =
      html +
      '<th scope="col">Run Interest</th><th scope="col">Run Payment</th></tr></thead><tbody><tr></tr></thead><tbody>';

    for (let i = 0; i < baseResult.loop; i++) {
      html = html + '<tr><th scope="row">' + i + '</th>';
      for (let j = 0; j < 7; j++) {
        html = html + '<td>';
        switch (j) {
          case 0:
            html = html + baseResult.paydate[i];
            break;
          case 1:
            html = html + dollarUS.format(baseResult.payment[i]);
            break;
          case 2:
            html = html + dollarUS.format(baseResult.interest[i]);
            break;
          case 3:
            html = html + dollarUS.format(baseResult.principal[i]);
            break;
          case 4:
            html = html + dollarUS.format(baseResult.endPrincipal[i]);
            break;
          case 5:
            html = html + dollarUS.format(baseResult.runInterest[i]);
            break;
          case 6:
            html = html + dollarUS.format(baseResult.runPayment[i]);
            break;
        }

        html = html + '</td>';
      }
      html = html + '</tr>';
    }
    html = html + '</tbody></table>';

    $('#resultTable').html(html);
  } catch (err) {
    console.log(err.message);
    $('#resultTable').html('There was an error: ' + err.message);
  }
});

function calculateMortgage(ctype, p, r, n, ntype, startDate) {
  const result = {
    emi: 0,
    loop: 0,
    paydate: [],
    daysInterval: [],
    payment: [],
    interest: [],
    principal: [],
    endPrincipal: [],
    runInterest: [],
    runPrincipal: [],
    runPayment: [],
  };
  var rEMI = r;
  n = Number(n);
  switch (ctype) {
    case '0':
    case '3':
    case '4':
    case '5':
      rEMI = r / 12 / 100;
      if (ntype === 'Years') {
        n = n * 12;
      }
      break;
    case '1':
      rEMI = r / 24 / 100;
      if (ntype === 'Years') {
        n = n * 24;
      } else {
        n = n * 2;
      }
      break;
    case '2':
      rEMI = r / 26 / 100;
      if (ntype === 'Years') {
        n = n * 26;
      } else {
        n = (n / 12) * 26;
      }
      break;
  }
  var neum = 1 + rEMI;
  neum = Math.pow(neum, n);
  var denom = neum - 1;
  var emi = (p * rEMI * neum) / denom;
  switch (ctype) {
    case '3':
      emi = (emi * 12) / 52;
      break;
    case '4':
      emi = emi / 2;
      break;
    case '5':
      emi = emi / 4;
      break;
  }

  result.emi = Number(emi.toFixed(2));

  result.paydate[0] = startDate;
  result.daysInterval[0] = 0;
  result.payment[0] = 0;
  result.interest[0] = 0;
  result.principal[0] = 0;
  result.endPrincipal[0] = Number(p);
  result.runInterest[0] = 0;
  result.runPrincipal[0] = 0;
  result.runPayment[0] = 0;

  var daysToAdd = 0;
  var tempDate = [];

  for (let i = 1; i <= n; i++) {
    // paydate update and daysInterval
    tempDate = result.paydate[i - 1].split('-');
    switch (ctype) {
      case '0':
        daysToAdd = daysInMonth(tempDate[1], tempDate[0]);
        break;
      case '1':
      case '2':
      case '4':
        daysToAdd = 14;
        break;
      case '3':
      case '5':
        daysToAdd = 7;
        break;
    }
    result.paydate[i] = dateAddDays(result.paydate[i - 1], daysToAdd + 1);
    result.daysInterval[i] = daysToAdd;

    // payment update
    result.payment[i] = result.emi;

    // interest update
    result.interest[i] =
      (((result.endPrincipal[i - 1] * result.daysInterval[i]) / 365) * r) / 100;
    result.interest[i] = Number(result.interest[i].toFixed(2));

    result.principal[i] = result.emi - result.interest[i];
    result.principal[i] = Number(result.principal[i].toFixed(2));

    result.endPrincipal[i] = result.endPrincipal[i - 1] - result.principal[i];
    result.endPrincipal[i] = Number(result.endPrincipal[i].toFixed(2));

    result.runInterest[i] = result.runInterest[i - 1] + result.interest[i];
    result.runInterest[i] = Number(result.runInterest[i].toFixed(2));

    result.runPrincipal[i] = result.runPrincipal[i - 1] + result.principal[i];
    result.runPrincipal[i] = Number(result.runPrincipal[i].toFixed(2));

    result.runPayment[i] = result.runPayment[i - 1] + result.payment[i];
    result.runPayment[i] = Number(result.runPayment[i].toFixed(2));
  }

  result.loop = n + 1;

  //   if (ntype === 'Years') {
  //     result.loop = n + 1;
  //   } else {
  //     result.loop = n + 1;
  //   }

  return result;
}

// function addMonths(numOfMonths, date = new Date()) {
//   const dateCopy = new Date(date.getTime());

//   dateCopy.setMonth(dateCopy.getMonth() + numOfMonths);

//   return dateCopy;
// }

// *** NOT PERFECT FOR when date is 29, 30, or 31
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function dateAddDays(/*string dd/mm/yyyy*/ datstr, /*int*/ ndays) {
  var dattmp = datstr.split('/').reverse().join('/');
  var nwdate = new Date(dattmp);
  nwdate.setDate(nwdate.getDate() + (ndays || 1));
  return [
    nwdate.getFullYear(),
    zeroPad(nwdate.getMonth() + 1, 10),
    zeroPad(nwdate.getDate(), 10),
  ].join('-');
}

function zeroPad(nr, base) {
  var len = String(base).length - String(nr).length + 1;
  return len > 0 ? new Array(len).join('0') + nr : nr;
}
