'use client';

import { useState } from 'react';
import { Undo, Redo, Download, AlertCircle } from 'lucide-react';
import { useJsonParser } from '@/hooks/useJsonParser';
import { FileDropzone } from '@/components/FileUpload/FileDropzone';
import { JsonTree } from '@/components/JsonTree/JsonTree';
import { Button } from '@/components/ui/Button';

export function JsonEditor() {
  const [activeTab, setActiveTab] = useState<'upload' | 'tree'>('upload');
  const {
    nodes,
    selectedNodes,
    isValid,
    errors,
    canUndo,
    canRedo,
    parseJson,
    toggleNode,
    moveNode,
    handleNodeMoveUp,
    handleNodeMoveDown,
    handleNodeSelect,
    moveSelectedUp,
    moveSelectedDown,
    clearSelection,
    undo,
    redo,
    modifiedJson
  } = useJsonParser();

  const handleFileUpload = (content: string, filename?: string) => {
    parseJson(content);
    if (isValid) {
      setActiveTab('tree');
    }
  };

  const handleJsonPaste = (content: string) => {
    parseJson(content);
    if (isValid) {
      setActiveTab('tree');
    }
  };

  const handleExport = () => {
    if (modifiedJson) {
      const jsonString = JSON.stringify(modifiedJson, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modified.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">JSON Ordering Tool</h1>
            <p className="text-sm text-gray-600">Reorder and restructure your JSON data</p>
          </div>
          
          {nodes.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleExport}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Error Display */}
      {!isValid && errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">JSON Parsing Error</h3>
              <div className="mt-1 text-sm text-red-700">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {nodes.length === 0 ? (
          /* Upload State */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  JSON Ordering Tool
                </h2>
                <p className="text-gray-600">
                  Upload or paste your JSON to start reordering keys with drag & drop
                </p>
              </div>
              <FileDropzone
                onFileUpload={handleFileUpload}
                onJsonPaste={handleJsonPaste}
              />
            </div>
          </div>
        ) : (
          /* Tree View State */
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left Panel - JSON Tree */}
            <div className="flex-1 lg:w-1/2 bg-white border-r border-gray-200 min-h-0">
              <JsonTree
                data={nodes}
                onNodeMove={moveNode}
                onNodeToggle={toggleNode}
                onNodeMoveUp={handleNodeMoveUp}
                onNodeMoveDown={handleNodeMoveDown}
                onNodeSelect={handleNodeSelect}
                onMoveSelectedUp={moveSelectedUp}
                onMoveSelectedDown={moveSelectedDown}
                onClearSelection={clearSelection}
                selectedNodes={selectedNodes}
              />
            </div>
            
            {/* Right Panel - JSON Preview */}
            <div className="flex-1 lg:w-1/2 bg-white min-h-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">JSON Preview</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {JSON.stringify(modifiedJson).length} characters
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">
                    {JSON.stringify(modifiedJson, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {nodes.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setActiveTab('upload');
                // Reset state will be handled by the hook
              }}
            >
              Load New JSON
            </Button>
            <span className="text-sm text-gray-500">
              {nodes.length} keys • Modified {canUndo ? '✓' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Copy to Clipboard
            </Button>
            <Button onClick={handleExport}>
              Download JSON
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}