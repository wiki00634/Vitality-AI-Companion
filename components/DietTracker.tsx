import React, { useState } from 'react';
import { Plus, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { Meal } from '../types';
import { analyzeMeal } from '../services/geminiService';

interface DietTrackerProps {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  removeMeal: (id: string) => void;
}

export const DietTracker: React.FC<DietTrackerProps> = ({ meals, addMeal, removeMeal }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeMeal(input);
      if (analysis) {
        const newMeal: Meal = {
          id: Date.now().toString(),
          name: analysis.name,
          calories: analysis.calories,
          protein: analysis.protein,
          carbs: analysis.carbs,
          fats: analysis.fats,
          timestamp: new Date(),
        };
        addMeal(newMeal);
        setInput('');
      } else {
        setError("Could not analyze meal. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to AI service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 h-full flex flex-col">
       <header>
        <h1 className="text-2xl font-bold text-gray-800">Diet Tracker</h1>
        <p className="text-gray-500">Log your meals with AI-powered estimation.</p>
      </header>

      {/* Input Area */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleAddMeal} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Grilled chicken breast with roasted veggies and quinoa..."
            className="w-full p-4 pr-12 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 resize-none h-24 text-gray-700 placeholder-gray-400"
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isAnalyzing}
            className="absolute bottom-3 right-3 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Meals List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <h3 className="font-semibold text-gray-700 px-1">Today's Logs</h3>
        {meals.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UtensilsIcon size={24} className="opacity-50" />
            </div>
            <p>No meals logged yet today.</p>
          </div>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                    <span className="font-bold text-emerald-600 text-sm">{meal.calories} kcal</span>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium">P: {meal.protein}g</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">C: {meal.carbs}g</span>
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md font-medium">F: {meal.fats}g</span>
                </div>
              </div>
              <button
                onClick={() => removeMeal(meal.id)}
                className="ml-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Helper Icon
const UtensilsIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);