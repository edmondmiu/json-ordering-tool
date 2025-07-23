import { useState, useCallback } from 'react';
import { JsonNode, JsonEditorState } from '@/types';
import { parseJsonToNodes, validateJson, nodesToJson, generateId } from '@/utils/jsonUtils';

export function useJsonParser() {
  const [state, setState] = useState<JsonEditorState>({
    originalJson: null,
    modifiedJson: null,
    nodes: [],
    history: [],
    currentHistoryIndex: -1,
    isValid: true,
    errors: []
  });

  const parseJson = useCallback((jsonString: string) => {
    const validation = validateJson(jsonString);
    
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        isValid: false,
        errors: [validation.error || 'Invalid JSON'],
        nodes: []
      }));
      return;
    }

    const nodes = parseJsonToNodes(validation.parsed!);
    const newState = {
      originalJson: validation.parsed,
      modifiedJson: validation.parsed,
      nodes,
      history: [validation.parsed],
      currentHistoryIndex: 0,
      isValid: true,
      errors: []
    };

    setState(newState);
  }, []);

  const updateNodes = useCallback((newNodes: JsonNode[]) => {
    const newJson = nodesToJson(newNodes);
    
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.currentHistoryIndex + 1);
      newHistory.push(newJson);
      
      return {
        ...prev,
        nodes: newNodes,
        modifiedJson: newJson,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1
      };
    });
  }, []);

  const toggleNode = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      nodes: updateNodeRecursively(prev.nodes, nodeId, node => ({
        ...node,
        expanded: !node.expanded
      }))
    }));
  }, []);

  const moveNode = useCallback((draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
    setState(prev => {
      const newNodes = [...prev.nodes];
      // Implementation for moving nodes will be added with drag-drop functionality
      return {
        ...prev,
        nodes: newNodes
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.currentHistoryIndex > 0) {
        const newIndex = prev.currentHistoryIndex - 1;
        const historyJson = prev.history[newIndex];
        return {
          ...prev,
          modifiedJson: historyJson,
          nodes: parseJsonToNodes(historyJson),
          currentHistoryIndex: newIndex
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.currentHistoryIndex < prev.history.length - 1) {
        const newIndex = prev.currentHistoryIndex + 1;
        const historyJson = prev.history[newIndex];
        return {
          ...prev,
          modifiedJson: historyJson,
          nodes: parseJsonToNodes(historyJson),
          currentHistoryIndex: newIndex
        };
      }
      return prev;
    });
  }, []);

  const canUndo = state.currentHistoryIndex > 0;
  const canRedo = state.currentHistoryIndex < state.history.length - 1;

  return {
    ...state,
    parseJson,
    updateNodes,
    toggleNode,
    moveNode,
    undo,
    redo,
    canUndo,
    canRedo
  };
}

function updateNodeRecursively(
  nodes: JsonNode[], 
  targetId: string, 
  updater: (node: JsonNode) => JsonNode
): JsonNode[] {
  return nodes.map(node => {
    if (node.id === targetId) {
      return updater(node);
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeRecursively(node.children, targetId, updater)
      };
    }
    return node;
  });
}