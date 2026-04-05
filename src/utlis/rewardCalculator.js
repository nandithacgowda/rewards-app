const calculateRewards = (amount) => {
  if (typeof amount !== "number" || amount < 0 || isNaN(amount)) {
    return 0;
  }
  const floored = Math.floor(amount);
  let points = 0;
  if (floored > 100) {
    points += (floored - 100) * 2;
    points += 50;
  } else if (floored > 50) {
    points += (floored - 50) * 1;
  }

  return points;
};

export default calculateRewards;
