import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { JsonNode } from '@/types';

export function useDragDrop(
  nodes: JsonNode[],
  onNodeMove: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? over.id as string : null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    const draggedId = active.id as string;
    const targetId = over.id as string;
    
    // Determine drop position based on drop zone
    const dropPosition = determineDropPosition(event, targetId);
    
    onNodeMove(draggedId, targetId, dropPosition);
    
    setActiveId(null);
    setOverId(null);
  }, [onNodeMove]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  return {
    activeId,
    overId,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}

function determineDropPosition(
  event: DragEndEvent,
  targetId: string
): 'before' | 'after' | 'inside' {
  // Get the target element
  const targetElement = document.querySelector(`[data-node-id="${targetId}"]`);
  if (!targetElement) return 'after';

  const rect = targetElement.getBoundingClientRect();
  
  // Try to get mouse position from the activator event
  let y = rect.top + rect.height / 2; // Default to middle
  
  if (event.activatorEvent && 'clientY' in event.activatorEvent) {
    y = (event.activatorEvent as MouseEvent).clientY;
  }
  
  // If dropped in the top third, insert before
  if (y < rect.top + rect.height / 3) {
    return 'before';
  }
  
  // If dropped in the bottom third, insert after
  if (y > rect.top + (2 * rect.height) / 3) {
    return 'after';
  }
  
  // Otherwise, insert inside (make child)
  return 'inside';
}

export function flattenNodesForDnd(nodes: JsonNode[]): JsonNode[] {
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