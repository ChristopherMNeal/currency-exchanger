export default class ExchangeRateService {
  static async getRate(baseCurrency) {
    try {
      const response = await fetch (`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/${baseCurrency}`);
      if (!response.ok) {
        throw Error(response.status);
      }
      return await response.json();
    } catch(error) {
      return error.message;
    }
  }
}