import React from "react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import ChapterFragment from "./chapterFragment";
import MemoryFragment from "./memoryFragment";
import colors from "../../lib/colors";

export default function Fragment({ id, index, moveFragment, fragment }) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveFragment(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  // const opacity = isDragging ? 1 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{
        borderColor: !isDragging ? "transparent" : colors.gray,
      }}
      className={`p-2 cursor-move rounded animate-fade-in border-2 border-dashed w-1/3`}
      data-handler-id={handlerId}
      data-fragment-id={fragment.id}
    >
      <div className="rounded p-2 bg-white h-20 shadow z-10">
        {fragment.type === "CHAPTER" && (
          <ChapterFragment title={fragment.content} />
        )}
        {fragment.type === "TEXT" && <MemoryFragment fragment={fragment} />}
      </div>
    </div>
  );
}
