//LOOK TO SPLITTER FOR ORIGINAL CODE, THIS IS AN EDIT TO MATCH THIS PROJECT

import React, { useRef, useEffect, useState, useCallback } from 'react';
import './splitter.css';

interface VerticalSplitterProps {
  className?: string;
  /**
   * We expect two children.
   */
  children: React.ReactElement[];
  /**
   * Initial value of the split.
   */
  initialSize?: number;
}

/**
 * Vertical Splitter component that allows resizing the left and right sections
 */
export const VerticalSplitter: React.FC<VerticalSplitterProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number>(props.initialSize || 50); // Default to 50%

  // Ensure there are exactly two children passed
  console.assert(props.children.length === 2, {
    message: 'Invalid number of children',
    actual: props.children.length,
  });

  // Mouse down handler for resizing
  const handleMouseDown = useHandleMouseDown(
    leftRef,
    containerRef,
    setLeftWidth
  );

  useEffect(() => {
    // Initialize the left side width on first render
    if (leftRef.current) {
      leftRef.current.style.width = `${leftWidth}%`;
    }
  }, [leftWidth]);

  return (
    <div
      className={`flex flex-row ${props.className ?? ''}`}
      ref={containerRef}
    >
      <div ref={leftRef} style={{ width: `${leftWidth}%` }}>
        {props.children[0]}
      </div>
      <div
        className="splitter__divider bg-slate-300"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'col-resize' }}
      />
      <div className="grow">{props.children[1]}</div>
    </div>
  );
};

/**
 * Handle mouse down event to start resizing.
 */
function useHandleMouseDown(
  leftRef: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>,
  setLeftWidth: React.Dispatch<React.SetStateAction<number>>
) {
  return useCallback(
    (event: React.MouseEvent) => {
      const start = { x: event.clientX, y: event.clientY };

      if (!leftRef.current || !containerRef.current) return;

      const leftWidth = leftRef.current.getBoundingClientRect().width;
      const containerWidth = containerRef.current.getBoundingClientRect().width;

      if (leftWidth === undefined || containerWidth === undefined) {
        return;
      }

      const handleMouseMove = (event: MouseEvent) => {
        const dx = event.clientX - start.x;
        const nextWidthFraction = ((leftWidth + dx) / containerWidth) * 100;

        // Set the new width while clamping it between 10% and 90%
        setLeftWidth(Math.min(Math.max(nextWidthFraction, 10), 90));
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [leftRef, containerRef, setLeftWidth]
  );
}

export default VerticalSplitter;
