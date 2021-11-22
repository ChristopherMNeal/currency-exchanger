export default class CodesService {
  static async getCodes() {
    try {
      const response = await fetch (`https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/codes`);
      if (!response.ok) {
        throw Error(response.status);
      }
      return await response.json();
    } catch(error) {
      return error.message;
    }
  }
}