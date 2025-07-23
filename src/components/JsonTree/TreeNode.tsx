'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Edit2 } from 'lucide-react';
import { JsonNode } from '@/types';

interface TreeNodeProps {
  node: JsonNode;
  onToggle: (nodeId: string) => void;
  searchTerm?: string;
  isLast?: boolean;
  depth?: number;
}

export function TreeNode({ node, onToggle, searchTerm, isLast = false, depth = 0 }: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.key);

  const hasChildren = node.children && node.children.length > 0;
  const isExpandable = node.type === 'object' || node.type === 'array';
  
  const getValueDisplay = () => {
    switch (node.type) {
      case 'string':
        return `"${node.value}"`;
      case 'number':
      case 'boolean':
        return String(node.value);
      case 'null':
        return 'null';
      case 'array':
        return `[${node.children?.length || 0}]`;
      case 'object':
        return `{${node.children?.length || 0}}`;
      default:
        return String(node.value);
    }
  };

  const getTypeColor = () => {
    switch (node.type) {
      case 'string': return 'text-green-600';
      case 'number': return 'text-blue-600';
      case 'boolean': return 'text-purple-600';
      case 'null': return 'text-gray-500';
      case 'array': return 'text-orange-600';
      case 'object': return 'text-red-600';
      default: return 'text-gray-700';
    }
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  const handleKeyEdit = () => {
    setIsEditing(true);
  };

  const handleKeySubmit = () => {
    // TODO: Implement key editing logic
    setIsEditing(false);
  };

  const handleCopyValue = () => {
    navigator.clipboard.writeText(JSON.stringify(node.value, null, 2));
  };

  return (
    <div className="select-none">
      <div 
        className="flex items-center py-1 px-2 hover:bg-gray-50 rounded group"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {/* Expand/Collapse Button */}
        <div className="flex items-center w-6">
          {isExpandable && (
            <button
              onClick={() => onToggle(node.id)}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {node.expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Key */}
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {isEditing ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleKeySubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleKeySubmit();
                if (e.key === 'Escape') {
                  setEditValue(node.key);
                  setIsEditing(false);
                }
              }}
              className="bg-white border border-blue-300 rounded px-1 py-0.5 text-sm font-medium text-gray-900 min-w-0"
              autoFocus
            />
          ) : (
            <span className="font-medium text-gray-900 truncate">
              {highlightSearchTerm(node.key)}
            </span>
          )}

          <span className="text-gray-500">:</span>

          {/* Value */}
          <span className={`font-mono text-sm truncate ${getTypeColor()}`}>
            {getValueDisplay()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleKeyEdit}
            className="p-1 hover:bg-gray-200 rounded"
            title="Edit key"
          >
            <Edit2 className="h-3 w-3 text-gray-500" />
          </button>
          <button
            onClick={handleCopyValue}
            className="p-1 hover:bg-gray-200 rounded"
            title="Copy value"
          >
            <Copy className="h-3 w-3 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Children */}
      {node.expanded && hasChildren && (
        <div>
          {node.children!.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              onToggle={onToggle}
              searchTerm={searchTerm}
              isLast={index === node.children!.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}