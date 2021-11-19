import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';

function getElements(response) {
  if(response.result === "success") {
    $("#output-form").text(calculateExchange(response));
  } else {
    $(".showErrors").text(`An error occured: ${response}`);
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
    $('.showErrors').text(`There was an error: ${response}`);
  }
}

function menuLoop(response) {
  const mostCommonCurrencies = [["USD","United States Dollar"],["EUR","EUR"],["JPY","Japanese Yen"],["GBP","Pound Sterling"],["AUD","Australian Dollar"],["CAD","Canadian Dollar"],["CHF","Swiss Franc"],["CNY","Chinese Renminbi"],["MXN","Mexican Peso"],["NZD", "New Zealand Dollar"],["SGD", "Singapore Dollar"],["SEK","Swedish Krona"],["KRW","South Korean Won"],["TRY","Turkish Lira"],["INR","Indian Rupee"],["BRL","Brazilian Real"],["ZAR","South African Rand"],["DKK","Danish Krone"],["TWD","New Taiwan Dollar"],["MYR","Malaysian Ringgit"]];
  for (let i = 0; i < mostCommonCurrencies.length; i++) {
    let currencyName = (mostCommonCurrencies[i][1]);
    let key = (response.supported_codes[i][0]);
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
  let baseCurrency = $("#baseCurrencyMenu").val();
  makeApiCall(baseCurrency);
});

// SETS DON'T WORK LIKE THIS AND I WASTED 2 HOURS TRYING TO MAKE THEM DO IT!
/*
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
  const mostCommonCurrencies = [["USD","United States Dollar"],["EUR","EUR"],["JPY","Japanese Yen"],["GBP","Pound Sterling"],["AUD","Australian Dollar"],["CAD","Canadian Dollar"],["CHF","Swiss Franc"],["CNY","Chinese Renminbi"],["MXN","Mexican Peso"],["NZD", "New Zealand Dollar"],["SGD", "Singapore Dollar"],["SEK","Swedish Krona"],["KRW","South Korean Won"],["TRY","Turkish Lira"],["INR","Indian Rupee"],["BRL","Brazilian Real"],["ZAR","South African Rand"],["DKK","Danish Krone"],["TWD","New Taiwan Dollar"],["MYR","Malaysian Ringgit"]];
  for (let i = 0; i < mostCommonCurrencies.length; i++) {
    let currencyName = (mostCommonCurrencies[i][1]);
    let key = (mostCommonCurrencies[i][0]);
    menuSet.add([key, `${currencyName} (${key})`]);
  }
  for (let i = 0; i < response.supported_codes.length; i++) {
    let currencyName = (response.supported_codes[i][1]);
    let key = (response.supported_codes[i][0]);
    menuSet.add([key, `${currencyName} (${key})`]);
  }
  return menuSet;
}

function menuLoop(menuSet) {
  menuSet.forEach((key) => {
    const name = key[1];
    const value = key[0];
    const menuItem = `<option value="${value}">${name}</option>`;
    $("#base-currencies").append(`${menuItem}`);
  });
}

*/