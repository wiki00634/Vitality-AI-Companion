import React, { useState, useEffect } from 'react';
import { AppView, Meal, WaterLog, ChatMessage, JournalEntry } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { DietTracker } from './components/DietTracker';
import { WaterTracker } from './components/WaterTracker';
import { SupportChat } from './components/SupportChat';
import { SmartJournal } from './components/SmartJournal';

// Helper to revive dates from JSON
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

// Helper hook for localStorage persistence
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item, dateReviver);
      }
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // App State
  const [meals, setMeals] = usePersistentState<Meal[]>('meals', []);
  const [waterLogs, setWaterLogs] = usePersistentState<WaterLog[]>('waterLogs', []);
  const [chatMessages, setChatMessages] = usePersistentState<ChatMessage[]>('chatMessages', []);
  const [journalEntries, setJournalEntries] = usePersistentState<JournalEntry[]>('journalEntries', []);

  // Constants / Goals
  const DAILY_CALORIE_GOAL = 2000;
  const DAILY_WATER_GOAL = 2500;

  // Actions
  const addMeal = (meal: Meal) => setMeals(prev => [...prev, meal]);
  const removeMeal = (id: string) => setMeals(prev => prev.filter(m => m.id !== id));
  
  const addWater = (amount: number) => {
    setWaterLogs(prev => [...prev, {
        id: Date.now().toString(),
        amountMl: amount,
        timestamp: new Date()
    }]);
  };
  const removeLastWaterLog = () => {
    setWaterLogs(prev => prev.slice(0, -1));
  };

  const addChatMessage = (msg: ChatMessage) => setChatMessages(prev => [...prev, msg]);

  const addJournalEntry = (entry: JournalEntry) => setJournalEntries(prev => [...prev, entry]);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            meals={meals} 
            waterLogs={waterLogs} 
            dailyCalorieGoal={DAILY_CALORIE_GOAL}
            dailyWaterGoal={DAILY_WATER_GOAL}
          />
        );
      case AppView.DIET:
        return <DietTracker meals={meals} addMeal={addMeal} removeMeal={removeMeal} />;
      case AppView.WATER:
        return <WaterTracker logs={waterLogs} dailyGoal={DAILY_WATER_GOAL} addWater={addWater} removeLastLog={removeLastWaterLog} />;
      case AppView.SUPPORT:
        return <SupportChat messages={chatMessages} addMessage={addChatMessage} />;
      case AppView.JOURNAL:
        return <SmartJournal entries={journalEntries} addEntry={addJournalEntry} />;
      default:
        return <Dashboard meals={meals} waterLogs={waterLogs} dailyCalorieGoal={DAILY_CALORIE_GOAL} dailyWaterGoal={DAILY_WATER_GOAL} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 p-4 md:p-8 overflow-hidden h-screen overflow-y-auto">
          <div className="max-w-2xl mx-auto h-full">
            {renderView()}
          </div>
        </main>
    </div>
  );
}