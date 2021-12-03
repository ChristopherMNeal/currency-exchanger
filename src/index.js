import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';
import makeCalculation from './js/calculate-exhange.js';
import menuLoop from './js/menu-logic.js';

function getRates(response) {
  if(response["result"] === "success") {
    for (const element in response.conversion_rates){ 
      sessionStorage.setItem(element, response.conversion_rates[element]);
    }
  } else if (response === '404') {
    $(".show-errors").html(`An error occured: ${response}.<br>The currency code you have entered is not supported.<br>Please reset the page and try again.`);
  } else { 
    $(".show-errors").text(`An error occured: ${response}`);
  }
}

async function makeApiCall(baseCurrency) {
  const response = await ExchangeRateService.getRate(baseCurrency);
  getRates(response);
}

export function menuFillLoop(menuInfo, scope) {
  for (let i = 0; i < menuInfo.length; i++) {
    let currencyName = (menuInfo[i][1]);
    let key = (menuInfo[i][0]);
    let menuItem = `<option value="${key}">${currencyName} (${key})</option>`;
    $("#" + scope+ "-base-currencies").append(menuItem);
    $("#" + scope+ "-output-currencies").append(menuItem);
    sessionStorage.setItem(menuInfo[i][0], -1);
  }
}

async function getMenu() {
  const response = await CodesService.getCodes();
  if (response.result === "success") {
    menuLoop(response);
  } else {
    $('.show-errors').text(`There was an error: ${response}`);
  }
}
getMenu();

function currencyChecker(commonCurrencies, allCurrencies) {
  if (commonCurrencies && allCurrencies) {
    $("#currency-select-error").text("Please choose from only one menu.");
    return false;
  } else if (!commonCurrencies && !allCurrencies) {
    $("#currency-select-error").text("Please choose a base currency.");
    return false;
  } else if (commonCurrencies) {
    return commonCurrencies;
  } else if (allCurrencies) {
    return allCurrencies;
  }
}

$(".display-all").click(function () {
  $("#common-base-currencies").val("");
  $("#common-output-currencies").val("");
  $(".all").show();
  $(".common").hide();
  $(".display-all").hide();
  $(".display-common").show();
});

$(".display-common").click(function () {
  $("#all-base-currencies").val("");
  $("#all-output-currencies").val("");
  $(".all").hide();
  $(".common").show();
  $(".display-common").hide();
  $(".display-all").show();
});

$("#base-currency-submit").click(function() {
  const commonCurrencies = $("#common-base-currencies").val();
  const allCurrencies = $("#all-base-currencies").val();
  const baseCurrency = currencyChecker(commonCurrencies, allCurrencies);
  if (baseCurrency === false) {
    return false;
  }
  $(".base-currency").text(baseCurrency);
  sessionStorage.setItem("base", baseCurrency);
  makeApiCall(baseCurrency);
  $("#currency-select-error").text("");
  $("#output-currency-form").slideDown();
  $("#reset").slideDown();
  $("#base-currency-input").slideUp();
});

$("#convert").click(function() {
  const commonCurrencies = $("#common-output-currencies").val();
  const allCurrencies = $("#all-output-currencies").val();
  const outputCurrency = currencyChecker(commonCurrencies, allCurrencies);
  if (outputCurrency === false) {
    return false;
  } else if (sessionStorage[outputCurrency] === "-1") {
    $("#currency-select-error").text(`An error occured: the currency code you have entered is not supported.`);
    return false;
  }
  $(".output-currency").text(outputCurrency);
  const rate = sessionStorage[outputCurrency];
  $("#show-rate").text(rate);
  sessionStorage.setItem("output", outputCurrency);
  sessionStorage.setItem("outputRate", rate);
  $("#currency-select-error").text("");
  $("#amount-input-form").slideDown();
  $("#amount-output").val("0");
  $("#amount-input").val("0");
});

$("#amount-input").change(function() {
  $(".show-errors").text("");
  let amount = $("#amount-input").val();
  console.log(amount);
  if (!amount) {
    $(".show-errors").text("Please enter an amount.");
    return false;
  }
  const rate = sessionStorage.getItem("outputRate");
  const answer = makeCalculation(amount, rate, false);
  $("#amount-output").val(answer);
});

$("#amount-output").change(function() {
  $(".show-errors").text("");
  let amount = $("#amount-output").val();
  if (!amount) {
    $(".show-errors").text("Please enter an amount.");
    return false;
  }
  const rate = sessionStorage.getItem("outputRate");
  const answer = makeCalculation(amount, rate, true);
  $("#amount-input").val(answer);
});

$("#reset").click(function() {
  location.reload();
});