'use client';

import { useState } from 'react';
import { Search, ExpandAll, CollapseAll } from 'lucide-react';
import { JsonTreeProps } from '@/types';
import { TreeNode } from './TreeNode';
import { Button } from '@/components/ui/Button';

export function JsonTree({ data, onNodeMove, onNodeToggle, searchTerm: initialSearchTerm }: JsonTreeProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [showSearch, setShowSearch] = useState(false);

  const filteredData = searchTerm 
    ? data.filter(node => 
        node.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof node.value === 'string' && node.value.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : data;

  const expandAll = () => {
    // TODO: Implement expand all functionality
    console.log('Expand all nodes');
  };

  const collapseAll = () => {
    // TODO: Implement collapse all functionality  
    console.log('Collapse all nodes');
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No JSON data loaded</p>
          <p className="text-sm">Upload a file or paste JSON to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900">JSON Structure</h3>
          <span className="text-sm text-gray-500">
            ({data.length} {data.length === 1 ? 'item' : 'items'})
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={expandAll}
            title="Expand all"
          >
            <ExpandAll className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={collapseAll}
            title="Collapse all"
          >
            <CollapseAll className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keys and values..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      )}

      {/* Tree Content */}
      <div className="flex-1 overflow-auto p-2">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>No matches found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredData.map((node, index) => (
              <TreeNode
                key={node.id}
                node={node}
                onToggle={onNodeToggle}
                searchTerm={searchTerm}
                isLast={index === filteredData.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}