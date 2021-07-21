import { useState } from "react";
import Button from "~/components/button";
import TextElementControls from "~/components/publish/textElementControls";

export default function TextElementControlList({
  elements,
  add,
  update,
  remove,
}) {
  const [expandId, setExpandId] = useState(elements.length && elements[0].id);
  return (
    <div className="px-4 w-full">
      <h1 className="text-xl mb-4">Elements</h1>
      {elements.map((el) => (
        <TextElementControls
          key={el.id}
          element={el}
          update={update}
          remove={remove}
          expandedId={expandId}
          expand={setExpandId}
        />
      ))}
      <Button
        cta
        onClick={() => {
          const addId = add();
          setExpandId(addId);
        }}
      >
        Add element
      </Button>
    </div>
  );
}
