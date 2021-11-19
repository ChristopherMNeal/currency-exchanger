import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';
import calculateExchange from './js/calculate-exchange';

function getElements(response, amount) {
  if(response.result === "success") {
    const rate = response.conversion_rates.baseCurrency;
  } else {
    $(".showErrors").text(`An error occured: ${response}`);
  }
}

async function makeApiCall(baseCurrency) {
  const response = await ExchangeRateService.getRate(baseCurrency);
  // sessionStorage.setItem(response);
}

async function getMenu() {
  const response = await CodesService.getCodes();
  if (response.result === "success") {
    menuLoop(response);
  } else {
    $('.showErrors').text(`There was an error: ${response}`);
  }
}

function menuLoop(response) {
  const mostCommonCurrencies = [["USD","United States Dollar"],["EUR","EUR"],["JPY","Japanese Yen"],["GBP","Pound Sterling"],["AUD","Australian Dollar"],["CAD","Canadian Dollar"],["CHF","Swiss Franc"],["CNY","Chinese Renminbi"],["MXN","Mexican Peso"],["NZD", "New Zealand Dollar"],["SGD", "Singapore Dollar"],["SEK","Swedish Krona"],["KRW","South Korean Won"],["TRY","Turkish Lira"],["INR","Indian Rupee"],["BRL","Brazilian Real"],["ZAR","South African Rand"],["DKK","Danish Krone"],["TWD","New Taiwan Dollar"],["MYR","Malaysian Ringgit"]];
  for (let i = 0; i < mostCommonCurrencies.length; i++) {
    let currencyName = (mostCommonCurrencies[i][1]);
    let key = (mostCommonCurrencies[i][0]);
    let menuItem = `<option value="${key}">${currencyName} (${key})</option>`;
    $("#common-base-currencies").append(menuItem);
    $("#common-output-currencies").append(menuItem);
  }
  for (let i = 0; i < response.supported_codes.length; i++) {
    let currencyName = (response.supported_codes[i][1]);
    let key = (response.supported_codes[i][0]);
    let menuItem = `<option value="${key}">${currencyName} (${key})</option>`;
    $("#all-base-currencies").append(menuItem);
    $("#all-output-currencies").append(menuItem);
  }
}

getMenu();

$("#base-currency-submit").click(function() {
  let baseCurrency = "";
  if ($("#common-base-currencies")) {
    baseCurrency = $("#common-base-currencies").val();  
  } else if ($("#all-base-currencies")) {
    baseCurrency = $("#all-base-currencies").val();
    console.log(baseCurrency);
  } else {
    $(".outputForm").text("Please choose a base currency");
  }
  console.log(baseCurrency);
  $(".base-currency").text(baseCurrency);
  makeApiCall(baseCurrency);
});
$("#convert").click(function() {
  let amount = $("#amount-input").val();
});