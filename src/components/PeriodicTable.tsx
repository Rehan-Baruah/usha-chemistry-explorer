
import React from 'react';
import ElementTile, { ElementData } from './ElementTile';
import elementsData from '../data/elements.json';

const PeriodicTable: React.FC = () => {
  const elements: ElementData[] = elementsData as ElementData[];

  // Create a map of elements by their atomic number for easy lookup
  const elementsMap = new Map<number, ElementData>();
  elements.forEach((element) => {
    elementsMap.set(element.atomicNumber, element);
  });

  // Get element by atomic number, returns undefined if not found
  const getElement = (atomicNumber: number): ElementData | undefined => {
    return elementsMap.get(atomicNumber);
  };

  // Helper function to render empty cells for spacing
  const renderEmptyCell = (key: string) => (
    <div key={key} className="h-16 w-16"></div>
  );

  // Render a specific element by atomic number
  const renderElement = (atomicNumber: number) => {
    const element = getElement(atomicNumber);
    if (!element) return renderEmptyCell(`empty-${atomicNumber}`);
    return <ElementTile key={element.atomicNumber} element={element} />;
  };

  // Split elements into periods for the main grid
  const mainGridElements = () => {
    return (
      <div className="grid grid-cols-18 gap-1">
        {/* Period 1 */}
        {renderElement(1)}
        {[...Array(16)].map((_, i) => renderEmptyCell(`p1-empty-${i}`))}
        {renderElement(2)}
        
        {/* Period 2 */}
        {renderElement(3)}
        {renderElement(4)}
        {[...Array(10)].map((_, i) => renderEmptyCell(`p2-empty-${i}`))}
        {renderElement(5)}
        {renderElement(6)}
        {renderElement(7)}
        {renderElement(8)}
        {renderElement(9)}
        {renderElement(10)}
        
        {/* Period 3 */}
        {renderElement(11)}
        {renderElement(12)}
        {[...Array(10)].map((_, i) => renderEmptyCell(`p3-empty-${i}`))}
        {renderElement(13)}
        {renderElement(14)}
        {renderElement(15)}
        {renderElement(16)}
        {renderElement(17)}
        {renderElement(18)}
        
        {/* Period 4 */}
        {renderElement(19)}
        {renderElement(20)}
        {renderElement(21)}
        {renderElement(22)}
        {renderElement(23)}
        {renderElement(24)}
        {renderElement(25)}
        {renderElement(26)}
        {renderElement(27)}
        {renderElement(28)}
        {renderElement(29)}
        {renderElement(30)}
        {renderElement(31)}
        {renderElement(32)}
        {renderElement(33)}
        {renderElement(34)}
        {renderElement(35)}
        {renderElement(36)}
        
        {/* Period 5 */}
        {renderElement(37)}
        {renderElement(38)}
        {renderElement(39)}
        {renderElement(40)}
        {renderElement(41)}
        {renderElement(42)}
        {renderElement(43)}
        {renderElement(44)}
        {renderElement(45)}
        {renderElement(46)}
        {renderElement(47)}
        {renderElement(48)}
        {renderElement(49)}
        {renderElement(50)}
        {renderElement(51)}
        {renderElement(52)}
        {renderElement(53)}
        {renderElement(54)}
        
        {/* Period 6 */}
        {renderElement(55)}
        {renderElement(56)}
        {/* La placeholder - actual La is in lanthanide series */}
        <div className="h-16 w-16 flex items-center justify-center bg-element-lanthanide border border-gray-300 text-xs">
          57-71
        </div>
        {renderElement(72)}
        {renderElement(73)}
        {renderElement(74)}
        {renderElement(75)}
        {renderElement(76)}
        {renderElement(77)}
        {renderElement(78)}
        {renderElement(79)}
        {renderElement(80)}
        {renderElement(81)}
        {renderElement(82)}
        {renderElement(83)}
        {renderElement(84)}
        {renderElement(85)}
        {renderElement(86)}
        
        {/* Period 7 */}
        {renderElement(87)}
        {renderElement(88)}
        {/* Ac placeholder - actual Ac is in actinide series */}
        <div className="h-16 w-16 flex items-center justify-center bg-element-actinide border border-gray-300 text-xs">
          89-103
        </div>
        {renderElement(104)}
        {renderElement(105)}
        {renderElement(106)}
        {renderElement(107)}
        {renderElement(108)}
        {renderElement(109)}
        {renderElement(110)}
        {renderElement(111)}
        {renderElement(112)}
        {renderElement(113)}
        {renderElement(114)}
        {renderElement(115)}
        {renderElement(116)}
        {renderElement(117)}
        {renderElement(118)}
      </div>
    );
  };

  // Render the lanthanide series (elements 57-71)
  const lanthanideSeries = () => {
    return (
      <div className="grid grid-cols-15 gap-1 mt-4">
        {[...Array(3)].map((_, i) => renderEmptyCell(`ln-empty-${i}`))}
        {[...Array(15)].map((_, i) => renderElement(57 + i))}
      </div>
    );
  };

  // Render the actinide series (elements 89-103)
  const actinideSeries = () => {
    return (
      <div className="grid grid-cols-15 gap-1 mt-2">
        {[...Array(3)].map((_, i) => renderEmptyCell(`ac-empty-${i}`))}
        {[...Array(15)].map((_, i) => renderElement(89 + i))}
      </div>
    );
  };

  return (
    <div className="p-4 overflow-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Periodic Table of Elements</h1>
      <div className="periodic-table">
        {mainGridElements()}
        {lanthanideSeries()}
        {actinideSeries()}
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <div className="text-center">
          <div className="w-8 h-8 bg-element-alkali-metal border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Alkali Metal</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-alkaline-earth-metal border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Alkaline Earth Metal</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-transition-metal border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Transition Metal</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-post-transition-metal border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Post-transition Metal</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-metalloid border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Metalloid</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-non-metal border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Non-metal</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-halogen border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Halogen</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-noble-gas border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Noble Gas</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-lanthanide border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Lanthanide</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-actinide border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Actinide</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-element-unknown border border-gray-300 mx-auto"></div>
          <p className="text-xs mt-1">Unknown</p>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
