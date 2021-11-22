export default function makeCalculation(amount, rate, reverse) {
  if (reverse === true) {
    const answer = parseFloat((amount/rate).toFixed(2));
    return answer;
  } else {
    const answer = parseFloat((rate*amount).toFixed(2));
    return answer;
  }
}