export interface JsonNode {
  id: string;
  key: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  children?: JsonNode[];
  parent?: string;
  expanded?: boolean;
  level: number;
}

export interface DragDropContext {
  activeId: string | null;
  overId: string | null;
}

export interface JsonTreeProps {
  data: JsonNode[];
  onNodeMove: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  onNodeToggle: (nodeId: string) => void;
  searchTerm?: string;
}

export interface FileUploadProps {
  onFileUpload: (content: string, filename?: string) => void;
  onJsonPaste: (content: string) => void;
}

export interface JsonEditorState {
  originalJson: any;
  modifiedJson: any;
  nodes: JsonNode[];
  history: any[];
  currentHistoryIndex: number;
  isValid: boolean;
  errors: string[];
}

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];