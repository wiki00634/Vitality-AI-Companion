import React from 'react';
import { LayoutDashboard, Utensils, Droplets, MessageCircleHeart, BookOpen } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Dash' },
    { view: AppView.DIET, icon: Utensils, label: 'Diet' },
    { view: AppView.WATER, icon: Droplets, label: 'Water' },
    { view: AppView.JOURNAL, icon: BookOpen, label: 'Journal' },
    { view: AppView.SUPPORT, icon: MessageCircleHeart, label: 'Support' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 md:relative md:border-t-0 md:border-r md:w-20 md:h-screen md:flex md:flex-col md:items-center md:pt-8 md:space-y-8 shadow-lg md:shadow-none">
      <div className="flex justify-around items-center h-16 md:h-auto md:flex-col md:w-full md:space-y-6">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`flex flex-col items-center justify-center w-full md:w-12 md:h-12 md:rounded-xl transition-all duration-200 ${
              currentView === item.view
                ? 'text-emerald-600 md:bg-emerald-50'
                : 'text-gray-400 hover:text-emerald-500'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium md:hidden">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};