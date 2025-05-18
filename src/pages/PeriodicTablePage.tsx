
import React, { useState, useMemo } from 'react';
import PeriodicTable from '../components/PeriodicTable';
import FilterPanel from '../components/FilterPanel';
import ChatModal from '../components/ChatModal';
import GeneralChatButton from '../components/GeneralChatButton';
import elementsData from '../data/elements.json';
import { ElementData } from '../components/ElementTile';

const PeriodicTablePage = () => {
  // Extract unique classifications for filter options
  const availableClassifications = useMemo(() => {
    const elements: ElementData[] = elementsData as ElementData[];
    return Array.from(new Set(elements.map(element => element.classification)));
  }, []);

  // State for filters
  const [filters, setFilters] = useState({
    classifications: [] as string[],
    blocks: [] as string[],
    series: [] as string[],
    reaction: null as string | null
  });

  // State for chat modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatElementContext, setChatElementContext] = useState<ElementData | undefined>(undefined);

  // Create a map of elements by name for easy lookup
  const elementsMap = useMemo(() => {
    const map = new Map<string, ElementData>();
    (elementsData as ElementData[]).forEach(element => {
      map.set(element.name, element);
    });
    return map;
  }, []);

  // Function to open chat with element context
  const openElementChat = (elementName: string) => {
    // Find the element by name from our elements data
    const element = elementsMap.get(elementName);
    if (element) {
      setChatElementContext(element);
      setIsChatOpen(true);
    } else {
      console.error(`Element not found: ${elementName}`);
      // Open general chat as fallback
      openGeneralChat();
    }
  };

  // Function to open general chat
  const openGeneralChat = () => {
    setChatElementContext(undefined);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">Interactive Periodic Table</h1>
          <p className="text-center text-gray-600 mt-2">Hover over or click on elements to see detailed information</p>
          <p className="text-center text-gray-500 mt-1 text-sm">Built with Element + Usha chat functionality</p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-6">
          <FilterPanel 
            filters={filters} 
            setFilters={setFilters}
            availableClassifications={availableClassifications}
          />
          
          <main className="flex-1 bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
            <PeriodicTable 
              filters={filters}
              openElementChat={openElementChat}
            />
          </main>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Interactive Periodic Table with Chat Functionality</p>
        </footer>
      </div>

      <GeneralChatButton onClick={openGeneralChat} />
      
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        elementContext={chatElementContext}
      />
    </div>
  );
};

export default PeriodicTablePage;
