import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';
import calculateExchange from './js/calculate-exchange';

function getElements(response) {
  const amount = sessionStorage.getItem("amount");
  if(response.result === "success") {
    const outputCurrency = sessionStorage.getItem("output");
    const rate = response.conversion_rates[outputCurrency];
    const answer = calculateExchange(amount, rate);
    $("#show-amount").text(answer);
  } else {
    $(".show-errors").text(`An error occured: ${response}`);
  }
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
  if ($("#common-base-currencies").val()) {
    baseCurrency = $("#common-base-currencies").val();  
  } else if ($("#all-base-currencies").val()) {
    baseCurrency = $("#all-base-currencies").val();
  } else {
    $("#base-currency-error").text("Please choose a base currency");
  }
  $(".base-currency").text(baseCurrency);
  sessionStorage.setItem("base", baseCurrency);
});
$("#convert").click(function() {
  let amount = $("#amount-input").val();
  sessionStorage.setItem("amount", amount);
  let outputCurrency = "";
  if ($("#common-output-currencies").val()) {
    outputCurrency = $("#common-output-currencies").val();  
  } else if ($("#all-output-currencies").val()) {
    outputCurrency = $("#all-output-currencies").val();
  } else {
    $("#output-currency-error").text("Please choose an output currency");
  }
  $(".output-currency").text(outputCurrency);
  sessionStorage.setItem("output", outputCurrency);
  let baseCurrency = sessionStorage.getItem("base");
  makeApiCall(baseCurrency);
});