
import React from 'react';
import { ElementData } from './ElementTile';

interface ElementPopupProps {
  element: ElementData;
  onClose: () => void;
}

const ElementPopup: React.FC<ElementPopupProps> = ({ element, onClose }) => {
  return (
    <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close popup"
      >
        ×
      </button>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{element.name}</h2>
          <span className="text-lg font-semibold">{element.symbol}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
          <div className="text-gray-600">Atomic Number:</div>
          <div>{element.atomicNumber}</div>
          
          <div className="text-gray-600">Atomic Mass:</div>
          <div>{element.atomicMass}</div>
          
          <div className="text-gray-600">Electron Config:</div>
          <div className="font-mono text-xs">{element.electronConfiguration}</div>
          
          <div className="text-gray-600">Group:</div>
          <div>{element.group || 'N/A'}</div>
          
          <div className="text-gray-600">Period:</div>
          <div>{element.period}</div>
          
          <div className="text-gray-600">Classification:</div>
          <div>{element.classification}</div>
          
          <div className="text-gray-600">Block:</div>
          <div>{element.block}</div>
        </div>
        
        <button 
          className="mt-3 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors w-full"
        >
          Ask Usha about {element.name}
        </button>
      </div>
    </div>
  );
};

export default ElementPopup;
