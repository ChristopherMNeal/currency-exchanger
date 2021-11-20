import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';

function getElements(response) {
  if(response["result"] === "success") {
    const outputCurrency = sessionStorage.getItem("output");
    const rate = response.conversion_rates[outputCurrency];
    sessionStorage.setItem("rate", rate);
    $("#show-rate").text(rate);
  } else {
    $(".show-errors").text(`An error occured: ${response}`);
  }
}

function makeCalculation() {
  const amount = sessionStorage.getItem("amountIn");
  const rate = sessionStorage.getItem("rate");
  const answer = parseFloat((rate*amount).toFixed(2));
  $("#amount-output").val(answer);
}

function makeReverseCalculation() {
  const amount = sessionStorage.getItem("amountOut");
  const rate = sessionStorage.getItem("rate");
  const answer = parseFloat((amount/rate).toFixed(2));
  $("#amount-input").val(answer);
}

async function makeApiCall(baseCurrency) {
  const response = await ExchangeRateService.getRate(baseCurrency);
  getElements(response);
}

async function getMenu() {
  const response = await CodesService.getCodes();
  if (response.result === "success") {
    menuLoop(response);
  } else {
    $('.show-errors').text(`There was an error: ${response}`);
  }
}

function menuLoop(response) {
  const mostCommonCurrencies = [["USD","United States Dollar"],["EUR","EUR"],["JPY","Japanese Yen"],["GBP","Pound Sterling"],["AUD","Australian Dollar"],["CAD","Canadian Dollar"],["CHF","Swiss Franc"],["CNY","Chinese Renminbi"],["MXN","Mexican Peso"],["NZD", "New Zealand Dollar"],["SGD", "Singapore Dollar"],["SEK","Swedish Krona"],["KRW","South Korean Won"],["TRY","Turkish Lira"],["INR","Indian Rupee"],["BRL","Brazilian Real"],["ZAR","South African Rand"],["DKK","Danish Krone"],["TWD","New Taiwan Dollar"],["MYR","Malaysian Ringgit"],["DOGE", "DogeCoin"]];
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
    sessionStorage.setItem(key, currencyName);
    $("#all-base-currencies").append(menuItem);
    $("#all-output-currencies").append(menuItem);
  }
}

getMenu();

$("#base-currency-submit").click(function() {
  let baseCurrency = "";
  if ($("#common-base-currencies").val() && $("#all-base-currencies").val()) {
    $("#currency-select-error").text("Please choose from only one menu.");
    return false;
  } else if ($("#common-base-currencies").val()) {
    baseCurrency = $("#common-base-currencies").val();  
  } else if ($("#all-base-currencies").val()) {
    baseCurrency = $("#all-base-currencies").val();
  } else if (!(sessionStorage[$("#common-base-currencies").val()])) {
    $(".show-errors").text(`An error occured: the currency code you have entered is not supported.`);
  } else {
    $("#currency-select-error").text("Please choose a base currency.");
    return false;
  }
  $(".base-currency").text(baseCurrency);
  sessionStorage.setItem("base", baseCurrency);
  $("#currency-select-error").text("");
  $("#output-currency-form").slideDown();
  $("#reset").slideDown();
  $("#base-currency-input").slideUp();
});

$("#convert").click(function() {
  let outputCurrency = "";
  if ($("#common-output-currencies").val() && $("#all-output-currencies").val()) {
    $("#currency-select-error").text("Please choose from only one menu.");
    return false;
  } else if ($("#common-output-currencies").val()) {
    outputCurrency = $("#common-output-currencies").val();  
  } else if ($("#all-output-currencies").val()) {
    outputCurrency = $("#all-output-currencies").val();
  } else if (!(sessionStorage[$("#common-base-currencies").val()])) {
    $(".show-errors").text(`An error occured: the currency code you have entered is not supported.`);
  } else {
    $("#currency-select-error").text("Please choose an output currency.");
    return false;
  }
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
  sessionStorage.setItem("amountIn", amount);
  makeCalculation();
});

$("#amount-output").change(function() {
  let amount = $("#amount-output").val();
  sessionStorage.setItem("amountOut", amount);
  makeReverseCalculation();
});

$("#reset").click(function() {
  location.reload();
});