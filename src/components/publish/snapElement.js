import reactable from "reactablejs";
import interact from "interactjs";
import React, { useState } from "react";

function Draggable({ children, position, parentRef, maxWidth, css, getRef }) {
  return (
    <div
      className={css}
      ref={getRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        display: "inline-block",
        maxWidth: (parentRef.current.clientWidth / 100) * maxWidth,
        position: "absolute",
        left: 0,
        top: 0,
      }}
    >
      {children}
    </div>
  );
}

const Reactable = reactable(Draggable);

export default function SnapElement({
  children,
  position,
  parentRef,
  onChange,
  maxWidth = 90,
  css = "",
}) {
  const [coords, setCoords] = useState({
    x: position.x,
    y: position.y,
  });

  return (
    <Reactable
      css={css}
      parentRef={parentRef}
      children={children}
      position={coords}
      maxWidth={maxWidth}
      draggable={{
        modifiers: [
          interact.modifiers.restrict({
            restriction: parentRef.current,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          }),
        ],
        onmove: (event) => {
          const x = (coords.x += event.dx);
          const y = (coords.y += event.dy);
          setCoords({ x, y });
          let relX = Math.floor((100 / parentRef.current.clientWidth) * x);
          let relY = Math.floor((100 / parentRef.current.clientHeight) * y);
          if (relX < 0) {
            relX = 0;
          }
          if (relY < 0) {
            relY = 0;
          }

          onChange({
            position: { x, y },
            relativePosition: { x: relX, y: relY },
          });
        },
      }}
    />
  );
}
