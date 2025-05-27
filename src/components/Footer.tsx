import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md shadow-lg border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="text-center text-sm text-gray-500">
            made by <a href="https://www.linkedin.com/in/fredlavigne/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 transition-colors">fred</a> with his AI minions 🤖
            <div className="text-[10px] text-gray-300">built on {import.meta.env.VITE_BUILD_DATE || 'development'}</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 