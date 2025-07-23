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