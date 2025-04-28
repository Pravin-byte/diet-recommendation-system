const express = require('express');
const cors =require('cors');
const { calculateDietPlan } = require('./utils/calorieCalculator');
const { getDietPlan } = require('./utils/dietPlan')

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());


app.post('/api/recommend', (req, res) => {
  try {
    const { gender, weight, height, age, activityLevel } = req.body;
    const result = calculateDietPlan({ gender, weight, height, age, activityLevel });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// New: Fetch Meals Based on Macros + Optional Region
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


const PORT=process.env.PORT || 3001
app.listen(PORT ,()=>{
  console.log('server listening on port '+ PORT);
})