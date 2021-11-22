import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';
import makeCalculation from './js/calculate-exhange.js';

function getRate(response) {
  if(response["result"] === "success") {
    const outputCurrency = sessionStorage.getItem("output");
    const rate = response.conversion_rates[outputCurrency];
    sessionStorage.setItem("rate", rate);
    $("#show-rate").text(rate);
  } else {
    $(".show-errors").text(`An error occured: ${response}`);
  }
}

async function makeApiCall(baseCurrency) {
  const response = await ExchangeRateService.getRate(baseCurrency);
  getRate(response);
}

async function getMenu() {
  const response = await CodesService.getCodes();
  if (response.result === "success") {
    menuLoop(response);
  } else {
    $('.show-errors').text(`There was an error: ${response}`);
  }
}

function menuFillLoop(menuInfo, scope) {
  for (let i = 0; i < menuInfo.length; i++) {
    let currencyName = (menuInfo[i][1]);
    let key = (menuInfo[i][0]);
    let menuItem = `<option value="${key}">${currencyName} (${key})</option>`;
    $("#" + scope+ "-base-currencies").append(menuItem);
    $("#" + scope+ "-output-currencies").append(menuItem);
  }
}

function menuLoop(response) {
  const mostCommonCurrencies = [["USD","United States Dollar"],["EUR","EUR"],["JPY","Japanese Yen"],["GBP","Pound Sterling"],["AUD","Australian Dollar"],["CAD","Canadian Dollar"],["CHF","Swiss Franc"],["CNY","Chinese Renminbi"],["MXN","Mexican Peso"],["NZD", "New Zealand Dollar"],["SGD", "Singapore Dollar"],["SEK","Swedish Krona"],["KRW","South Korean Won"],["TRY","Turkish Lira"],["INR","Indian Rupee"],["BRL","Brazilian Real"],["ZAR","South African Rand"],["DKK","Danish Krone"],["TWD","New Taiwan Dollar"],["MYR","Malaysian Ringgit"],["XYZ", "FakeCoin"]];
  const allCurrencies = response.supported_codes;
  menuFillLoop(mostCommonCurrencies, "common");
  menuFillLoop(allCurrencies, "all");
}

getMenu();

function currencyChecker(commonCurrencies, allCurrencies) {
  if (commonCurrencies && allCurrencies) {
    $("#currency-select-error").text("Please choose from only one menu.");
    return false;
  } else if (!(sessionStorage[commonCurrencies]) && !allCurrencies) {
    $("#currency-select-error").text(`An error occured: the currency code you have entered is not supported.`);
    return false;
  } else if (commonCurrencies) {
    return commonCurrencies;
  } else if (allCurrencies) {
    return allCurrencies;
  } else {
    $("#currency-select-error").text("Please choose a base currency.");
    return false;
  }
}

$("#base-currency-submit").click(function() {
  const commonCurrencies = $("#common-base-currencies").val();
  const allCurrencies = $("#all-base-currencies").val();
  const baseCurrency = currencyChecker(commonCurrencies, allCurrencies);
  $(".base-currency").text(baseCurrency);
  sessionStorage.setItem("base", baseCurrency);
  $("#currency-select-error").text("");
  $("#output-currency-form").slideDown();
  $("#reset").slideDown();
  $("#base-currency-input").slideUp();
});

$("#convert").click(function() {
  const commonCurrencies = $("#common-output-currencies").val();
  const allCurrencies = $("#all-output-currencies").val();
  const outputCurrency = currencyChecker(commonCurrencies, allCurrencies);
  $(".output-currency").text(outputCurrency);
  sessionStorage.setItem("output", outputCurrency);
  let baseCurrency = sessionStorage.getItem("base");
  makeApiCall(baseCurrency);
  $("#currency-select-error").text("");
  $("#amount-input-form").slideDown();
  $("#output-currency-form").slideUp();
});

$("#amount-input").change(function() {
  let amount = $("#amount-input").val();
  const rate = sessionStorage.getItem("rate");
  const answer = makeCalculation(amount, rate, false);
  $("#amount-output").val(answer);
});

$("#amount-output").change(function() {
  let amount = $("#amount-output").val();
  const rate = sessionStorage.getItem("rate");
  const answer = makeCalculation(amount, rate, true);
  $("#amount-input").val(answer);
});

$("#reset").click(function() {
  location.reload();
});