import { useState } from "react";
import { Button, Grid, Card, Title } from "~/components/_styled";
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
    <CollapseControlWrapper isCollapsed={show} css="block sm:w-10/12">
      <Grid colSpan={["col-span-12 sm:col-span-6 md:col-span-4"]}>
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
      </Grid>
    </CollapseControlWrapper>
  );
}
