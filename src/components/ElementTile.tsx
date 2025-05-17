
import React from 'react';

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  electronConfiguration: string;
  group: number | null;
  period: number;
  classification: string;
  block: string;
}

interface ElementTileProps {
  element: ElementData;
}

const getElementColor = (classification: string): string => {
  switch (classification) {
    case 'Alkali metal':
      return 'bg-element-alkali-metal';
    case 'Alkaline earth metal':
      return 'bg-element-alkaline-earth-metal';
    case 'Transition metal':
      return 'bg-element-transition-metal';
    case 'Post-transition metal':
      return 'bg-element-post-transition-metal';
    case 'Metalloid':
      return 'bg-element-metalloid';
    case 'Non-metal':
      return 'bg-element-non-metal';
    case 'Halogen':
      return 'bg-element-halogen';
    case 'Noble gas':
      return 'bg-element-noble-gas';
    case 'Lanthanide':
      return 'bg-element-lanthanide';
    case 'Actinide':
      return 'bg-element-actinide';
    default:
      return 'bg-element-unknown';
  }
};

const ElementTile: React.FC<ElementTileProps> = ({ element }) => {
  const colorClass = getElementColor(element.classification);

  return (
    <div
      className={`border border-gray-300 p-1 flex flex-col items-center justify-between ${colorClass} h-16 w-16 text-gray-800 relative`}
    >
      <div className="text-xs absolute top-0 left-1">{element.atomicNumber}</div>
      <div className="font-bold text-xl">{element.symbol}</div>
      <div className="text-[8px] leading-tight mt-0.5 truncate w-full text-center">
        {element.name}
      </div>
      <div className="text-[7px] leading-tight absolute bottom-0.5">
        {parseFloat(element.atomicMass).toFixed(1)}
      </div>
    </div>
  );
};

export default ElementTile;
