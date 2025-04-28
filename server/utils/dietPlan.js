const axios = require('axios');

const getDietPlan = async (protein, calorie, carbs, fat, region) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;

    // Step 1: Map region to cuisine
    const regionToCuisineMap = {
      "India": "Indian",
      "Italy": "Italian",
      "China": "Chinese",
      "Mexico": "Mexican",
      "Japan": "Japanese",
      // Add more mappings as needed
    };

    const cuisine = regionToCuisineMap[region] || "";  // Default to empty string if region not found

    // Step 2: Generate meals based on calories, macros, and cuisine
    const mealResponse = await axios.get('https://api.spoonacular.com/mealplanner/generate', {
      params: {
        targetCalories: calorie,
        diet: 'balanced',
        timeFrame: 'day',
        cuisine: cuisine,  // Add cuisine filter here
        apiKey: apiKey,
      }
    });

    const meals = mealResponse.data.meals;

    // Step 3: For each meal, fetch its actual nutrition information
    const mealDetailsPromises = meals.map(async (meal) => {
      const nutritionResponse = await axios.get(`https://api.spoonacular.com/recipes/${meal.id}/nutritionWidget.json`, {
        params: { apiKey: apiKey }
      });

      const nutrition = nutritionResponse.data;

      return {
        mealName: meal.title,
        calories: nutrition.calories,
        carbs: nutrition.carbs,
        protein: nutrition.protein,
        fat: nutrition.fat,
        imageUrl: `https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg`,  // Spoonacular image URL pattern
        recipeUrl: meal.sourceUrl
      };
    });

    // Step 4: Wait for all meal details to resolve
    const fullMealPlans = await Promise.all(mealDetailsPromises);

    return fullMealPlans;
    
  } catch (error) {
    console.error('Error fetching diet plan:', error.message);
    return [];
  }
};

module.exports = { getDietPlan };
