
import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import reaction data
import reactionsData from '../data/reactions.json';

// Define the filter types
export interface FilterState {
  classifications: string[];
  blocks: string[];
  series: string[];
  reaction: string | null;
}

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableClassifications: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, availableClassifications }) => {
  // Helper function to toggle a value in an array
  const toggleArrayValue = (array: string[], value: string): string[] => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    } else {
      return [...array, value];
    }
  };

  // Handler for classification checkboxes
  const handleClassificationChange = (classification: string) => {
    setFilters(prev => ({
      ...prev,
      classifications: toggleArrayValue(prev.classifications, classification)
    }));
  };

  // Handler for block checkboxes
  const handleBlockChange = (block: string) => {
    setFilters(prev => ({
      ...prev,
      blocks: toggleArrayValue(prev.blocks, block)
    }));
  };

  // Handler for series checkboxes
  const handleSeriesChange = (series: string) => {
    setFilters(prev => ({
      ...prev,
      series: toggleArrayValue(prev.series, series)
    }));
  };

  // Handler for reaction dropdown
  const handleReactionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      reaction: value === "" ? null : value
    }));
  };

  // Desktop filter panel
  const DesktopFilterPanel = () => (
    <div className="hidden md:block w-1/4 min-w-64 bg-white p-4 rounded-lg shadow-lg h-fit">
      <h2 className="text-lg font-bold mb-4">Filter Elements</h2>
      
      <Collapsible defaultOpen className="mb-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-left mb-2 pb-1 border-b">
          <span>Classification</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2">
            {availableClassifications.sort().map(classification => (
              <div key={classification} className="flex items-center space-x-2">
                <Checkbox 
                  id={`classification-${classification}`}
                  checked={filters.classifications.includes(classification)}
                  onCheckedChange={() => handleClassificationChange(classification)}
                />
                <label 
                  htmlFor={`classification-${classification}`}
                  className="text-sm"
                >
                  {classification}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible defaultOpen className="mb-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-left mb-2 pb-1 border-b">
          <span>Block</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2">
            {['s', 'p', 'd', 'f'].map(block => (
              <div key={block} className="flex items-center space-x-2">
                <Checkbox 
                  id={`block-${block}`}
                  checked={filters.blocks.includes(block)}
                  onCheckedChange={() => handleBlockChange(block)}
                />
                <label 
                  htmlFor={`block-${block}`}
                  className="text-sm"
                >
                  {block}-block
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible defaultOpen className="mb-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-left mb-2 pb-1 border-b">
          <span>Series</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2">
            {['Lanthanide', 'Actinide'].map(series => (
              <div key={series} className="flex items-center space-x-2">
                <Checkbox 
                  id={`series-${series}`}
                  checked={filters.series.includes(series)}
                  onCheckedChange={() => handleSeriesChange(series)}
                />
                <label 
                  htmlFor={`series-${series}`}
                  className="text-sm"
                >
                  {series}s
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="mb-4">
        <label className="block font-medium text-left mb-2 pb-1 border-b">Named Reactions</label>
        <select
          value={filters.reaction || ""}
          onChange={handleReactionChange}
          className="mt-2 w-full p-2 border rounded-md text-sm"
        >
          <option value="">All Elements</option>
          {reactionsData.map(reaction => (
            <option key={reaction.name} value={reaction.name}>
              {reaction.name}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={() => setFilters({ classifications: [], blocks: [], series: [], reaction: null })}
        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
      >
        Clear Filters
      </button>
    </div>
  );

  // Mobile filter panel as a drawer
  const MobileFilterPanel = () => (
    <Drawer>
      <DrawerTrigger className="md:hidden flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg shadow mb-4">
        <Filter className="h-4 w-4 mr-2" />
        <span>Filters</span>
      </DrawerTrigger>
      
      <DrawerContent className="px-4 pt-4 pb-8">
        <h2 className="text-lg font-bold mb-4">Filter Elements</h2>
        
        <Collapsible defaultOpen className="mb-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-left mb-2 pb-1 border-b">
            <span>Classification</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-2">
              {availableClassifications.sort().map(classification => (
                <div key={classification} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mobile-classification-${classification}`}
                    checked={filters.classifications.includes(classification)}
                    onCheckedChange={() => handleClassificationChange(classification)}
                  />
                  <label 
                    htmlFor={`mobile-classification-${classification}`}
                    className="text-sm"
                  >
                    {classification}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible defaultOpen className="mb-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-left mb-2 pb-1 border-b">
            <span>Block</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-2">
              {['s', 'p', 'd', 'f'].map(block => (
                <div key={block} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mobile-block-${block}`}
                    checked={filters.blocks.includes(block)}
                    onCheckedChange={() => handleBlockChange(block)}
                  />
                  <label 
                    htmlFor={`mobile-block-${block}`}
                    className="text-sm"
                  >
                    {block}-block
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Collapsible defaultOpen className="mb-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full font-medium text-left mb-2 pb-1 border-b">
            <span>Series</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-2">
              {['Lanthanide', 'Actinide'].map(series => (
                <div key={series} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mobile-series-${series}`}
                    checked={filters.series.includes(series)}
                    onCheckedChange={() => handleSeriesChange(series)}
                  />
                  <label 
                    htmlFor={`mobile-series-${series}`}
                    className="text-sm"
                  >
                    {series}s
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="mb-4">
          <label className="block font-medium text-left mb-2 pb-1 border-b">Named Reactions</label>
          <select
            value={filters.reaction || ""}
            onChange={handleReactionChange}
            className="mt-2 w-full p-2 border rounded-md text-sm"
          >
            <option value="">All Elements</option>
            {reactionsData.map(reaction => (
              <option key={reaction.name} value={reaction.name}>
                {reaction.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => setFilters({ classifications: [], blocks: [], series: [], reaction: null })}
          className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
        >
          Clear Filters
        </button>
      </DrawerContent>
    </Drawer>
  );

  return (
    <>
      <MobileFilterPanel />
      <DesktopFilterPanel />
    </>
  );
};

export default FilterPanel;
