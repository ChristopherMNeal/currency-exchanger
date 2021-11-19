import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import ExchangeRateService from './js/exchange-rate-service';
import CodesService from './js/codes-service';

function getElements(response) {
  if(response.result === "success") {
    $("#output-form").text(convertFunction(response))
  } else {
    $(".showErrors").text(`An error occured: ${response}`);
  }
}

async function makeApiCall(baseCurrency) {
  const response = await ExchangeRateService.getRate(baseCurrency);
  getElements(response);
}

async function getMenu() {
  const response - await CodesService.getCodes();
  if (response.result === "success") {
    menuLoop(response);
  } else {
    $(".showErrors").text(`An error occured: ${response}`);

  }
}