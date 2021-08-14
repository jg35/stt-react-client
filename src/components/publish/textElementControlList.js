import { useState } from "react";
import Button from "~/components/button";
import Card from "~/components/card";
import TextElementControls from "~/components/publish/textElementControls";

export default function TextElementControlList({
  elements,
  add,
  update,
  remove,
}) {
  const [expandId, setExpandId] = useState(null);
  return (
    <div className="px-4 w-full">
      <Card>
        <h1 className="text-xl mb-4">Text</h1>
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
          variant="secondary"
          onClick={() => {
            const addId = add();
          }}
        >
          Add text
        </Button>
      </Card>
    </div>
  );
}
