

export default function menuLoop(response) {
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