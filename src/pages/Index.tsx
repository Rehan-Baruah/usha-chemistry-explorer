
import React from 'react';
import PeriodicTable from '../components/PeriodicTable';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">Interactive Periodic Table</h1>
          <p className="text-center text-gray-600 mt-2">Explore all 118 elements of the periodic table</p>
        </header>
        
        <main className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
          <PeriodicTable />
        </main>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Interactive Periodic Table with Chat Functionality</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
