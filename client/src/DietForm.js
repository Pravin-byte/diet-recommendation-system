import React, { useState } from 'react';
import { FaUser, FaBirthdayCake, FaWeight, FaRulerVertical, FaUtensils, } from 'react-icons/fa';
import axios from 'axios';

const DietForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    foodPreferences: '',
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState(''); // new state for selected plan type

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getMeals = async (params, planName) => {
    try {
      // Replace with your backend URL
      const { data } = await axios.post('https://diet-recommendation-system-law0.onrender.com/api/getMeals', params);
      setResult(data);
      setSelectedPlanType(planName); // set plan name here too
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your backend URL
      const { data } = await axios.post('https://diet-recommendation-system-law0.onrender.com/api/recommend', {
        ...formData,
      });

      setRecommendation(data);
    } catch (err) {
      console.error('Error:', err.message || err);
    }
    setLoading(false);
};



  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      {!recommendation ? (
        <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">🍽️ Personalized Diet Planner</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Username" icon={<FaUser />} name="userName" value={formData.userName} onChange={handleChange} />
            <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['male', 'female']} />
            <Input label="Age" type="number" icon={<FaBirthdayCake />} name="age" value={formData.age} onChange={handleChange} />
            <Input label="Height (cm)" type="number" icon={<FaRulerVertical />} name="height" value={formData.height} onChange={handleChange} />
            <Input label="Weight (kg)" type="number" icon={<FaWeight />} name="weight" value={formData.weight} onChange={handleChange} />
            <Select label="Activity Level" name="activityLevel" value={formData.activityLevel} onChange={handleChange} options={['sedentary', 'light', 'moderate', 'active', 'very active']} />
            <Select label="Food Preference" icon={<FaUtensils />} name="foodPreferences" value={formData.foodPreferences} onChange={handleChange} options={['none', 'vegetarian', 'vegan']} />
            <Select label="Region" name="region" value={formData.region} onChange={handleChange} options={['Indian', 'Italian', 'Mexican', 'Korean', 'American', 'Japanese']}
          />

            <div className="md:col-span-2 text-center">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition">
                {loading ? 'Processing...' : 'Get Recommendation'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-2xl font-semibold mb-6 text-center">🍱 Your Meal Plans</h3>

          {/* Show PlanType cards only if result not fetched */}
          {!result && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
              {['maintenance', 'weightLoss', 'weightGain'].map((planType) => {
                const plan = recommendation[planType];
                const labels = {
                  maintenance: 'Maintenance',
                  weightLoss: 'Weight Loss',
                  weightGain: 'Weight Gain'
                };

                return (
                  <div
                    onClick={() =>
                      getMeals(
                        {
                          protein: plan.macros.protein,
                          calorie: plan.calories,
                          carbs: plan.macros.carbs,
                          fat: plan.macros.fat,
                          region: formData.region,
                        },
                        labels[planType]
                      )
                    }
                    key={planType}
                    className="bg-gray-800 text-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                  >
                    <h4 className="text-xl font-bold mb-2 text-center">{labels[planType]}</h4>
                    <p className="text-center mb-2">
                      🔥 <strong>{plan.calories} kcal/day</strong>
                    </p>
                    <p>🍗 Protein: <strong>{plan.macros.protein}g</strong></p>
                    <p>🍚 Carbs: <strong>{plan.macros.carbs}g</strong></p>
                    <p>🥑 Fat: <strong>{plan.macros.fat}g</strong></p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show selected plan type heading */}
          {selectedPlanType && (
            <h4 className="text-xl font-bold mb-6 text-center">
              Plan Type: {selectedPlanType}
            </h4>
          )}

          {/* Meals after selecting a plan */}
          <div>
          {result && result.dietPlan && result.dietPlan.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
              {result.dietPlan.map((meal, index) => (
                <div key={index} className="bg-gray-800 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                  <h4 className="text-xl font-bold mb-2 text-center">{meal.mealName}</h4>
                  <p className="text-center mb-2">
                    🔥 <strong>{meal.calories} kcal</strong>
                  </p>
                  <p className="text-center mb-2">
                    <strong>Carbs:</strong> {meal.carbs}g | <strong>Protein:</strong> {meal.protein}g | <strong>Fat:</strong> {meal.fat}g
                  </p>
                  <img src={meal.imageUrl} alt={meal.mealName} className="w-full rounded-lg" />
                  <div className="text-center mt-4">
                    <a href={meal.recipeUrl} target="_blank" rel="noopener noreferrer" className="text-green-500">
                      View Recipe
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setRecommendation(null);
                setResult('');
                setSelectedPlanType('');
              }}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, name, value, onChange, icon, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-700 border border-gray-600 rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
      ))}
    </select>
  </div>
);

export default DietForm;
