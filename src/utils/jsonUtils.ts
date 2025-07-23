import { JsonNode, JsonValue, JsonObject, JsonArray } from '@/types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function parseJsonToNodes(json: JsonValue, parentId: string = '', level: number = 0): JsonNode[] {
  const nodes: JsonNode[] = [];

  if (typeof json === 'object' && json !== null) {
    if (Array.isArray(json)) {
      json.forEach((item, index) => {
        const nodeId = generateId();
        const node: JsonNode = {
          id: nodeId,
          key: index.toString(),
          value: item,
          type: getValueType(item),
          parent: parentId || undefined,
          level,
          expanded: level < 2,
        };

        if (typeof item === 'object' && item !== null) {
          node.children = parseJsonToNodes(item, nodeId, level + 1);
        }

        nodes.push(node);
      });
    } else {
      Object.entries(json as JsonObject).forEach(([key, value]) => {
        const nodeId = generateId();
        const node: JsonNode = {
          id: nodeId,
          key,
          value,
          type: getValueType(value),
          parent: parentId || undefined,
          level,
          expanded: level < 2,
        };

        if (typeof value === 'object' && value !== null) {
          node.children = parseJsonToNodes(value, nodeId, level + 1);
        }

        nodes.push(node);
      });
    }
  }

  return nodes;
}

export function getValueType(value: JsonValue): JsonNode['type'] {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value as 'string' | 'number' | 'boolean';
}

export function nodesToJson(nodes: JsonNode[]): JsonValue {
  if (nodes.length === 0) return null;

  const rootNodes = nodes.filter(node => !node.parent);
  
  if (rootNodes.length === 1) {
    return nodeToJsonValue(rootNodes[0], nodes);
  }

  const result: JsonObject = {};
  rootNodes.forEach(node => {
    result[node.key] = nodeToJsonValue(node, nodes);
  });
  
  return result;
}

function nodeToJsonValue(node: JsonNode, allNodes: JsonNode[]): JsonValue {
  const children = allNodes.filter(n => n.parent === node.id);
  
  if (children.length === 0) {
    return node.value;
  }

  if (node.type === 'array') {
    return children
      .sort((a, b) => parseInt(a.key) - parseInt(b.key))
      .map(child => nodeToJsonValue(child, allNodes));
  }

  if (node.type === 'object') {
    const result: JsonObject = {};
    children.forEach(child => {
      result[child.key] = nodeToJsonValue(child, allNodes);
    });
    return result;
  }

  return node.value;
}

export function validateJson(jsonString: string): { isValid: boolean; error?: string; parsed?: JsonValue } {
  try {
    const parsed = JSON.parse(jsonString);
    return { isValid: true, parsed };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON' 
    };
  }
}

export function flattenNodes(nodes: JsonNode[]): JsonNode[] {
  const result: JsonNode[] = [];
  
  function traverse(nodeList: JsonNode[]) {
    nodeList.forEach(node => {
      result.push(node);
      if (node.children && node.expanded) {
        traverse(node.children);
      }
    });
  }
  
  traverse(nodes);
  return result;
}

export function findNodeById(nodes: JsonNode[], id: string): JsonNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function moveNodeInTree(
  nodes: JsonNode[], 
  draggedId: string, 
  targetId: string, 
  position: 'before' | 'after' | 'inside'
): JsonNode[] {
  // Create a deep copy of nodes
  const newNodes = JSON.parse(JSON.stringify(nodes));
  
  // Find the dragged node and remove it from its current position
  const draggedNode = findAndRemoveNode(newNodes, draggedId);
  if (!draggedNode) return nodes;
  
  // Find the target node and insert the dragged node
  insertNodeAtPosition(newNodes, draggedNode, targetId, position);
  
  return newNodes;
}

function findAndRemoveNode(nodes: JsonNode[], nodeId: string): JsonNode | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      return nodes.splice(i, 1)[0];
    }
    
    if (nodes[i].children) {
      const found = findAndRemoveNode(nodes[i].children!, nodeId);
      if (found) return found;
    }
  }
  return null;
}

function insertNodeAtPosition(
  nodes: JsonNode[], 
  nodeToInsert: JsonNode, 
  targetId: string, 
  position: 'before' | 'after' | 'inside'
): boolean {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    
    if (node.id === targetId) {
      switch (position) {
        case 'before':
          nodes.splice(i, 0, nodeToInsert);
          return true;
        case 'after':
          nodes.splice(i + 1, 0, nodeToInsert);
          return true;
        case 'inside':
          if (!node.children) node.children = [];
          node.children.push(nodeToInsert);
          node.expanded = true; // Auto-expand when adding children
          return true;
      }
    }
    
    if (node.children && insertNodeAtPosition(node.children, nodeToInsert, targetId, position)) {
      return true;
    }
  }
  
  return false;
}

export function expandAllNodes(nodes: JsonNode[]): JsonNode[] {
  const nodesToExpand: JsonNode[] = [];
  
  function traverse(nodeList: JsonNode[]) {
    nodeList.forEach(node => {
      if ((node.type === 'object' || node.type === 'array') && !node.expanded) {
        nodesToExpand.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  }
  
  traverse(nodes);
  return nodesToExpand;
}

export function collapseAllNodes(nodes: JsonNode[]): JsonNode[] {
  const nodesToCollapse: JsonNode[] = [];
  
  function traverse(nodeList: JsonNode[]) {
    nodeList.forEach(node => {
      if ((node.type === 'object' || node.type === 'array') && node.expanded) {
        nodesToCollapse.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  }
  
  traverse(nodes);
  return nodesToCollapse;
}