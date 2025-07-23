'use client';

import { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FileDropzoneProps {
  onFileUpload: (content: string, filename?: string) => void;
  onJsonPaste: (content: string) => void;
}

export function FileDropzone({ onFileUpload, onJsonPaste }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => 
      file.type === 'application/json' || file.name.endsWith('.json')
    );
    
    if (jsonFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onFileUpload(content, jsonFile.name);
        setUploadedFile(jsonFile.name);
      };
      reader.readAsText(jsonFile);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onFileUpload(content, file.name);
        setUploadedFile(file.name);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const handleJsonSubmit = useCallback(() => {
    if (jsonInput.trim()) {
      onJsonPaste(jsonInput);
      setJsonInput('');
    }
  }, [jsonInput, onJsonPaste]);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setJsonInput('');
  }, []);

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
          <div className="flex items-center justify-center space-x-3">
            <File className="h-8 w-8 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {uploadedFile}
            </span>
            <button
              onClick={clearFile}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your JSON file here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Choose File
              </Button>
            </label>
          </div>
        )}
      </div>

      {/* Text Input Area */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Or paste JSON directly:
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"key": "value", "array": [1, 2, 3]}'
          className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button 
          onClick={handleJsonSubmit}
          disabled={!jsonInput.trim()}
          className="w-full"
        >
          Parse JSON
        </Button>
      </div>
    </div>
  );
}