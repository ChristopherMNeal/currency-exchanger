export function makeCalculation(amount, rate) {
  const answer = parseFloat((rate*amount).toFixed(2));
  return answer;
}

export function makeReverseCalculation(amount, rate) {
  const answer = parseFloat((amount/rate).toFixed(2));
  return answer;
}