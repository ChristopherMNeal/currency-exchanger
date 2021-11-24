export default class ExchangeRateService {
  static async getRate(baseCurrency) {
    try {
      const response = await fetch (`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${baseCurrency}`);
      if(response.status === 404){
        throw Error("The currency code you have entered is not supported. Please reset the page and try again.");
      }
      if (!response.ok) {
        throw Error(response.status);
      }
      return await response.json();
    } catch(error) {
      return error.message;
    }
  }
}