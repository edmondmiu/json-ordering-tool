'use client';

interface DropIndicatorProps {
  position: 'before' | 'after' | 'inside';
  isVisible: boolean;
}

export function DropIndicator({ position, isVisible }: DropIndicatorProps) {
  if (!isVisible) return null;

  const getIndicatorStyles = () => {
    switch (position) {
      case 'before':
        return 'absolute -top-0.5 left-0 right-0 h-0.5 bg-blue-500 rounded-full';
      case 'after':
        return 'absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500 rounded-full';
      case 'inside':
        return 'absolute inset-0 border-2 border-blue-500 border-dashed rounded bg-blue-50 bg-opacity-50';
      default:
        return '';
    }
  };

  return (
    <div className={getIndicatorStyles()}>
      {position === 'inside' && (
        <div className="flex items-center justify-center h-full">
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
            Drop inside
          </span>
        </div>
      )}
    </div>
  );
}