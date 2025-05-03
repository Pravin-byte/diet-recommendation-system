const express = require('express');
const cors = require('cors');
const { calculateDietPlan } = require('./utils/calorieCalculator');
const { getDietPlan } = require('./utils/dietPlan');
const path = require('path');

const app = express();
require('dotenv').config();

// Allow CORS from specific origin in production
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'; // Default to local in development
app.use(cors({
  origin: frontendURL, // Ensure frontend can communicate with backend
}));

app.use(express.json());

// Handle the recommend API route
app.post('/api/recommend', (req, res) => {
  try {
    const { gender, weight, height, age, activityLevel } = req.body;
    const result = calculateDietPlan({ gender, weight, height, age, activityLevel });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Handle the getMeals API route
app.post('/api/getMeals', async (req, res) => {
  try {
    console.log("Received body:", req.body);  // ✅ Debugging

    const { protein, calorie, carbs, fat, region } = req.body;

    if (!protein || !carbs || !fat || !calorie) {
      throw new Error("Missing required macronutrient values");
    }

    const dietPlan = await getDietPlan(protein, calorie, carbs, fat, region);
    res.json({ calorie, dietPlan });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Serve index.html for all other routes
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Set the port dynamically or to 3001 by default
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
