import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
// import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';

// function getElements(response) {
//   if(response.result === "success") {
//     $("#output-form").text(convertFunction(response));
//   } else {
//     $(".showErrors").text(`An error occured: ${response}`);
//   }
// }

// async function makeApiCall(baseCurrency) {
//   const response = await ExchangeRateService.getRate(baseCurrency);
//   getElements(response);
// }

async function getMenu() {
  const response = await CodesService.getCodes();
  if (response.result === "success") {
    const menuSet = menuSetLoop(response);
    menuLoop(menuSet);
  } else {
    $(".showErrors").text(`An error occured: ${response}`);

  }
}

function menuSetLoop(response) {
  let menuSet = new Set();
  const mostCommonCurrencies = [["USD","United States Dollar"],["EUR","Euro"],["JPY","Japanese Yen"],["GBP","Pound Sterling"],["AUD","Australian Dollar"],["CAD","Canadian Dollar"],["CHF","Swiss Franc"],["CNY","Chinese Renminbi"],["MXN","Mexican Peso"],["NZD", "New Zealand Dollar"],["SGD", "Singapore Dollar"],["SEK","Swedish Krona"],["KRW","South Korean Won"],["TRY","Turkish Lira"],["INR","Indian Rupee"],["BRL","Brazilian Real"],["ZAR","South African Rand"],["DKK","Danish Krone"],["TWD","New Taiwan Dollar"],["MYR","Malaysian Ringgit"]];
  for (let i = 0; i < mostCommonCurrencies.length; i++) {
    let currencyName = (mostCommonCurrencies[i][1]);
    let key = (mostCommonCurrencies[i][0]);
    menuSet.add([key, `${currencyName} (${key})`]);
  }
  for (let i = 0; i < response.length; i++) {
    let currencyName = (response.supported_codes[i][1]);
    let key = (response.supported_codes[i][0]);
    menuSet.add([key, `${currencyName} (${key})`]);
  }
  return menuSet;
}

function menuLoop(menuSet) {
  menuSetLoop(menuSet);
  menuSet.forEach((key) => {
    const name = key[1];
    const value = key[0];
    const menuItem = `<option value="${value}">${name}</option>`;
    $("#base-currencies").append(`${menuItem}`);
  });
}

getMenu();

// $("#base-currency-submit").click(function() {
//   let baseCurrency = $("#baseCurrencyMenu").val();
//   makeApiCall(baseCurrency);
// });