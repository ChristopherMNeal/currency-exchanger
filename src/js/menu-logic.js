import { menuFillLoop } from "..";

export default function menuLoop(response) {
  const mostCommonCurrencies = [["USD","United States Dollar"],["EUR","Euro"],["JPY","Japanese Yen"],["GBP","Pound Sterling"],["AUD","Australian Dollar"],["CAD","Canadian Dollar"],["CHF","Swiss Franc"],["CNY","Chinese Renminbi"],["MXN","Mexican Peso"],["NZD", "New Zealand Dollar"],["SGD", "Singapore Dollar"],["SEK","Swedish Krona"],["KRW","South Korean Won"],["TRY","Turkish Lira"],["INR","Indian Rupee"],["BRL","Brazilian Real"],["ZAR","South African Rand"],["DKK","Danish Krone"],["TWD","New Taiwan Dollar"],["MYR","Malaysian Ringgit"],["XYZ", "FakeCoin"]];
  const allCurrencies = response.supported_codes;
  menuFillLoop(mostCommonCurrencies, "common");
  menuFillLoop(allCurrencies, "all");
  menuFillLoop([["XYZ", "FakeCoin"]], "all");
}