
import React, { useEffect, useRef, useState } from 'react';
import { ElementData } from './ElementTile';

interface ElementPopupProps {
  element: ElementData;
  onClose: () => void;
  onAskUsha?: () => void;
  parentRef: React.RefObject<HTMLDivElement>; // Reference to parent element
}

const ElementPopup: React.FC<ElementPopupProps> = ({ element, onClose, onAskUsha, parentRef }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  
  // Calculate the popup position to ensure it's visible within the viewport
  useEffect(() => {
    const calculatePosition = () => {
      if (!popupRef.current || !parentRef.current) return;
      
      const VERTICAL_OFFSET = 10; // Pixel offset from element
      const HORIZONTAL_MARGIN = 10; // Margin from viewport edges
      
      // Get parent element and popup dimensions
      const parentRect = parentRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      
      // Initial position (centered above the element)
      let top = parentRect.top - popupRect.height - VERTICAL_OFFSET;
      let left = parentRect.left + (parentRect.width / 2) - (popupRect.width / 2);
      
      // If popup would go off top, position it below the element instead
      if (top < 0) {
        top = parentRect.bottom + VERTICAL_OFFSET;
      }
      
      // If popup would go off bottom (rare, but possible), prioritize keeping it in view
      if (top + popupRect.height > viewportHeight) {
        top = Math.max(HORIZONTAL_MARGIN, viewportHeight - popupRect.height - HORIZONTAL_MARGIN);
      }
      
      // If popup would go off left edge
      if (left < HORIZONTAL_MARGIN) {
        left = HORIZONTAL_MARGIN;
      }
      
      // If popup would go off right edge
      if (left + popupRect.width > viewportWidth - HORIZONTAL_MARGIN) {
        left = viewportWidth - popupRect.width - HORIZONTAL_MARGIN;
      }
      
      // Set position (adjusted to account for scroll position)
      setPopupPosition({
        top: top + scrollY,
        left: left + scrollX
      });
    };
    
    // Calculate position immediately
    calculatePosition();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [parentRef]);
  
  return (
    <div 
      ref={popupRef} 
      className="fixed z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64"
      style={{ 
        top: `${popupPosition.top}px`, 
        left: `${popupPosition.left}px`,
        maxHeight: '80vh',
        overflowY: 'auto' 
      }}
    >
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
          onClick={(e) => {
            e.stopPropagation();
            onAskUsha && onAskUsha();
            onClose();
          }}
        >
          Ask Usha about {element.name}
        </button>
      </div>
    </div>
  );
};

export default ElementPopup;
