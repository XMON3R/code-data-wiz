import React, { useRef, useEffect, useState, useCallback } from "react";
import "./vertical-splitter.css";

interface VerticalSplitterProps {
  className?: string;
  children: React.ReactElement[];
  initialSize?: number;
}

/**
 * Vertical Splitter component that allows resizing the left and right sections
 * BASED ON DATASPENCER (https://github.com/mff-uk/dataspecer)
 */
export const VerticalSplitter: React.FC<VerticalSplitterProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const leftRef = useRef<HTMLDivElement>(null!);
  const [leftWidth, setLeftWidth] = useState<number>(props.initialSize || 50); // Default to 50%

  // Ensure there are exactly two children passed
  console.assert(props.children.length === 2, {
    message: "Invalid number of children",
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
    // Reinstated h-full here. This ensures the splitter takes the full height available from App.tsx.
    // The className from App.tsx (flex-1 min-h-0) controls how much space it gets.
    <div
      className={`flex flex-row h-full ${props.className ?? ""}`} /* ADDED h-full back */
      ref={containerRef}
    >
      {/* Left Panel: Width controlled by style. It will stretch vertically by default (align-items: stretch). */}
      <div ref={leftRef} style={{ width: `${leftWidth}%` }}>
        {props.children[0]}
      </div>
      <div
        className="splitter__divider bg-slate-300"
        onMouseDown={handleMouseDown}
        style={{ cursor: "col-resize" }}
      />
      {/* Right Panel: Uses 'grow' to take remaining horizontal space and handle internal scrolling.
          It will also stretch vertically by default. */}
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
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [leftRef, containerRef, setLeftWidth]
  );
}

export default VerticalSplitter;