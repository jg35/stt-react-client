import { useState } from "react";
import { Button, Card, Title } from "~/components/_styled";
import TextElementControls from "~/components/publish/textElementControls";
import CollapseControlWrapper from "~/components/publish/collapseControlWrapper";

export default function TextElementControlList({
  show,
  elements,
  add,
  update,
  remove,
}) {
  const [expandId, setExpandId] = useState(null);
  return (
    <CollapseControlWrapper isCollapsed={show}>
      {elements.map((el) => (
        <TextElementControls
          isSticky
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
    </CollapseControlWrapper>
  );
}
