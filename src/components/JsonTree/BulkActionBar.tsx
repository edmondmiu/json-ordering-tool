'use client';

import { ArrowUp, ArrowDown, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BulkActionBarProps {
  selectedCount: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({ selectedCount, onMoveUp, onMoveDown, onClearSelection }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 z-50">
      <span className="text-sm font-medium text-gray-700">
        {selectedCount} key{selectedCount > 1 ? 's' : ''} selected
      </span>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveUp}
          className="flex items-center space-x-1"
        >
          <ArrowUp className="h-3 w-3" />
          <span>Move Up</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onMoveDown}
          className="flex items-center space-x-1"
        >
          <ArrowDown className="h-3 w-3" />
          <span>Move Down</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="flex items-center space-x-1"
        >
          <X className="h-3 w-3" />
          <span>Clear</span>
        </Button>
      </div>
    </div>
  );
}