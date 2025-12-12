import React from 'react';
import { Plus, Minus, Droplets } from 'lucide-react';
import { WaterLog } from '../types';

interface WaterTrackerProps {
  logs: WaterLog[];
  dailyGoal: number;
  addWater: (amount: number) => void;
  removeLastLog: () => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ logs, dailyGoal, addWater, removeLastLog }) => {
  const currentAmount = logs.reduce((acc, log) => acc + log.amountMl, 0);
  const percentage = Math.min(100, Math.round((currentAmount / dailyGoal) * 100));

  return (
    <div className="space-y-8 pb-20 md:pb-0 flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Hydration</h1>
        <p className="text-gray-500">Stay hydrated to boost your metabolism.</p>
      </div>

      {/* Visual Indicator */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        
        {/* Progress Circle (Simple CSS Conic Gradient for demo) */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-700 ease-out"
          style={{ 
            clipPath: `inset(${100 - percentage}% 0 0 0)` // Simple clip-path fill effect for a "filling up" look vertically? 
            // Actually let's do a conic gradient border hack or SVG
          }}
        ></div>
        
        {/* Better SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="#eff6ff"
                strokeWidth="16"
            />
            <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="16"
                strokeDasharray="753.98" // 2 * pi * 120
                strokeDashoffset={753.98 - (753.98 * percentage) / 100}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
        </svg>

        {/* Center Text */}
        <div className="relative flex flex-col items-center">
            <Droplets size={48} className="text-blue-500 mb-2" fill="currentColor" fillOpacity={0.2} />
            <span className="text-4xl font-bold text-gray-800">{currentAmount}</span>
            <span className="text-sm text-gray-400">/ {dailyGoal} ml</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button 
            onClick={() => addWater(250)}
            className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl transition-colors"
        >
            <Plus size={32} className="mb-2" />
            <span className="font-semibold">+250ml</span>
            <span className="text-xs text-blue-400">Glass</span>
        </button>
        <button 
            onClick={() => addWater(500)}
            className="flex flex-col items-center justify-center p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 transition-all hover:translate-y-[-2px]"
        >
            <Plus size={32} className="mb-2" />
            <span className="font-semibold">+500ml</span>
            <span className="text-xs text-blue-100">Bottle</span>
        </button>
      </div>

      <button 
        onClick={removeLastLog}
        disabled={logs.length === 0}
        className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors disabled:opacity-0"
      >
        <Minus size={14} /> Undo last entry
      </button>

      {/* History Teaser */}
      <div className="w-full max-w-sm mt-8">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Logs</h4>
        <div className="space-y-2">
            {[...logs].reverse().slice(0, 3).map((log) => (
                <div key={log.id} className="flex justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                    <span>{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="font-medium text-blue-600">{log.amountMl}ml</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};