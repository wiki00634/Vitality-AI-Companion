import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Meal, WaterLog } from '../types';
import { Droplets, Flame, TrendingDown } from 'lucide-react';

interface DashboardProps {
  meals: Meal[];
  waterLogs: WaterLog[];
  dailyCalorieGoal: number;
  dailyWaterGoal: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ meals, waterLogs, dailyCalorieGoal, dailyWaterGoal }) => {
  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalWater = waterLogs.reduce((acc, log) => acc + log.amountMl, 0);
  const waterPercentage = Math.min(100, Math.round((totalWater / dailyWaterGoal) * 100));
  const caloriePercentage = Math.min(100, Math.round((totalCalories / dailyCalorieGoal) * 100));

  const totalProtein = meals.reduce((acc, meal) => acc + meal.protein, 0);
  const totalCarbs = meals.reduce((acc, meal) => acc + meal.carbs, 0);
  const totalFats = meals.reduce((acc, meal) => acc + meal.fats, 0);

  const macroData = [
    { name: 'Protein', value: totalProtein, color: '#10b981' }, // emerald-500
    { name: 'Carbs', value: totalCarbs, color: '#3b82f6' },   // blue-500
    { name: 'Fats', value: totalFats, color: '#f59e0b' },    // amber-500
  ];

  // If no data, show grey ring
  const chartData = macroData.every(d => d.value === 0) 
    ? [{ name: 'Empty', value: 1, color: '#e5e7eb' }] 
    : macroData;

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Today's Progress</h1>
        <p className="text-gray-500">Track your journey to a healthier you.</p>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calorie Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Calories</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalCalories}</h3>
              <p className="text-xs text-gray-400">of {dailyCalorieGoal} kcal goal</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Flame className="text-orange-500" size={24} />
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
            <div 
              className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${caloriePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Hydration</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalWater}<span className="text-lg text-gray-400 font-normal">ml</span></h3>
              <p className="text-xs text-gray-400">of {dailyWaterGoal}ml goal</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Droplets className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${waterPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Macro Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Macronutrient Breakdown</h3>
        <div className="h-64 flex items-center justify-center relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm text-gray-400">Macros</span>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          {macroData.map((macro) => (
            <div key={macro.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">{macro.name}</span>
                <span className="text-sm font-bold text-gray-800">{macro.value}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Motivation Card */}
      <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={20} className="text-emerald-200" />
                <span className="text-emerald-100 font-medium text-sm">Pro Tip</span>
            </div>
            <p className="font-medium text-lg">"Small steps every day add up to big results. Consistency beats intensity."</p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500 rounded-full opacity-50 blur-2xl"></div>
      </div>
    </div>
  );
};