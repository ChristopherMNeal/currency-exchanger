export default function calculateExchange(amount, rate) {
  return parseFloat((rate*amount).toFixed(2));
}