import { JsonNode } from '@/types';

export function moveNodeUp(nodes: JsonNode[], nodeId: string): JsonNode[] {
  const newNodes = JSON.parse(JSON.stringify(nodes));
  
  function findAndMoveUp(nodeList: JsonNode[], parentList?: JsonNode[]): boolean {
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      
      if (node.id === nodeId) {
        if (i > 0) {
          // Move up within the same level
          const temp = nodeList[i];
          nodeList[i] = nodeList[i - 1];
          nodeList[i - 1] = temp;
          return true;
        }
        return false; // Already at the top
      }
      
      if (node.children && findAndMoveUp(node.children, nodeList)) {
        return true;
      }
    }
    return false;
  }
  
  findAndMoveUp(newNodes);
  return newNodes;
}

export function moveNodeDown(nodes: JsonNode[], nodeId: string): JsonNode[] {
  const newNodes = JSON.parse(JSON.stringify(nodes));
  
  function findAndMoveDown(nodeList: JsonNode[], parentList?: JsonNode[]): boolean {
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      
      if (node.id === nodeId) {
        if (i < nodeList.length - 1) {
          // Move down within the same level
          const temp = nodeList[i];
          nodeList[i] = nodeList[i + 1];
          nodeList[i + 1] = temp;
          return true;
        }
        return false; // Already at the bottom
      }
      
      if (node.children && findAndMoveDown(node.children, nodeList)) {
        return true;
      }
    }
    return false;
  }
  
  findAndMoveDown(newNodes);
  return newNodes;
}

export function canMoveUp(nodes: JsonNode[], nodeId: string): boolean {
  function findNodePosition(nodeList: JsonNode[]): number {
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      
      if (node.id === nodeId) {
        return i;
      }
      
      if (node.children) {
        const childPosition = findNodePosition(node.children);
        if (childPosition !== -1) {
          return childPosition;
        }
      }
    }
    return -1;
  }
  
  const position = findNodePosition(nodes);
  return position > 0;
}

export function canMoveDown(nodes: JsonNode[], nodeId: string): boolean {
  function findNodePosition(nodeList: JsonNode[]): { position: number; listLength: number } | null {
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      
      if (node.id === nodeId) {
        return { position: i, listLength: nodeList.length };
      }
      
      if (node.children) {
        const childResult = findNodePosition(node.children);
        if (childResult) {
          return childResult;
        }
      }
    }
    return null;
  }
  
  const result = findNodePosition(nodes);
  return result ? result.position < result.listLength - 1 : false;
}

export function moveSelectedNodesUp(nodes: JsonNode[], selectedIds: string[]): JsonNode[] {
  let newNodes = [...nodes];
  
  // Sort selected nodes by their position (top to bottom) to maintain order
  const sortedIds = selectedIds.sort((a, b) => {
    const posA = getNodePosition(newNodes, a);
    const posB = getNodePosition(newNodes, b);
    return posA - posB;
  });
  
  // Move each node up, starting from the top
  for (const nodeId of sortedIds) {
    if (canMoveUp(newNodes, nodeId)) {
      newNodes = moveNodeUp(newNodes, nodeId);
    }
  }
  
  return newNodes;
}

export function moveSelectedNodesDown(nodes: JsonNode[], selectedIds: string[]): JsonNode[] {
  let newNodes = [...nodes];
  
  // Sort selected nodes by their position (bottom to top) to maintain order
  const sortedIds = selectedIds.sort((a, b) => {
    const posA = getNodePosition(newNodes, a);
    const posB = getNodePosition(newNodes, b);
    return posB - posA;
  });
  
  // Move each node down, starting from the bottom
  for (const nodeId of sortedIds) {
    if (canMoveDown(newNodes, nodeId)) {
      newNodes = moveNodeDown(newNodes, nodeId);
    }
  }
  
  return newNodes;
}

function getNodePosition(nodes: JsonNode[], nodeId: string): number {
  let position = 0;
  
  function traverse(nodeList: JsonNode[]): boolean {
    for (const node of nodeList) {
      if (node.id === nodeId) {
        return true;
      }
      position++;
      
      if (node.children && node.expanded) {
        if (traverse(node.children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  traverse(nodes);
  return position;
}