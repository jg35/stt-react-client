import { useState } from "react";
import { Button, Card, Title } from "~/components/_styled";
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
        <Title>Text</Title>
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
