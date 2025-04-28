
function calculateBMR(gender, weight, height, age) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    throw new Error('Invalid gender');
  }
}

function getActivityFactor(level) {
  const activityLevels = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very active': 1.9
  };
  return activityLevels[level] || 1.2;
}

function calculateTDEE(bmr, activityLevel) {
  return bmr * getActivityFactor(activityLevel);
}

function calculateMacros(tdee) {
  // Assume 20% protein, 50% carbs, 30% fat
  const proteinCals = tdee * 0.20;
  const carbsCals = tdee * 0.50;
  const fatCals = tdee * 0.30;

  return {
    protein: Math.round(proteinCals / 4), // 4 cal per gram
    carbs: Math.round(carbsCals / 4),
    fat: Math.round(fatCals / 9) // 9 cal per gram
  };
}

function calculateDietPlan({ gender, weight, height, age, activityLevel }) {
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel);

  const maintenance = Math.round(tdee);
  const weightLoss = Math.round(tdee * 0.8); // 20% deficit
  const weightGain = Math.round(tdee * 1.2); // 20% surplus

  return {
    bmr: Math.round(bmr),
    maintenance: {
      calories: maintenance,
      macros: calculateMacros(maintenance)
    },
    weightLoss: {
      calories: weightLoss,
      macros: calculateMacros(weightLoss)
    },
    weightGain: {
      calories: weightGain,
      macros: calculateMacros(weightGain)
    }
  };
}


module.exports = {
  calculateDietPlan
};
