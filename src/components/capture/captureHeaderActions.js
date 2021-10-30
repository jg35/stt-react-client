import { useContext } from "react";
import { Button, Grid } from "~/components/_styled";
import Svg from "~/components/svg";
import {
  makeCreateFragmentForm,
  makeCreateUserEventForm,
} from "~/lib/uiManager";
import { UIContext } from "~/app";

function CaptureHeaderActionButton({ action, icon, type }) {
  return (
    <Button
      css="px-4 md:h-full flex-col justify-around md:justify-center h-14 md:flex-row"
      onClick={action}
    >
      <Svg name={icon} css="md:hidden" color="currentColor" size={18} />
      <span className="text-sm md:text-base">
        <span className="hidden md:block">
          Add
          <br />
        </span>
        {type}
      </span>
    </Button>
  );
}

export default function CaptureHeaderActions({}) {
  const { updateUiState, uiState } = useContext(UIContext);
  return (
    <Grid
      colSpan={["col-span-3 md:col-span-4"]}
      height="h-full"
      gap="gap-x-2 md:gap-x-4"
    >
      {window.innerWidth < 768 && (
        <Button
          css={`px-4 h-14 justify-around flex-col ${
            uiState.questionVisible &&
            "shadow bg-darkGray hover:bg-darkGray hover:border-darkGray border-darkGray text-white"
          } `}
          onClick={() =>
            updateUiState({ questionVisible: !uiState.questionVisible }, false)
          }
        >
          <Svg name="question" css="md:hidden" color="currentColor" size={18} />
          <span className="text-sm md:text-base">Questions</span>
        </Button>
      )}
      <CaptureHeaderActionButton
        icon="calendar"
        type="Event"
        action={() =>
          updateUiState(
            makeCreateUserEventForm({}, { revealAfterCreate: true }),
            false
          )
        }
      />

      <CaptureHeaderActionButton
        icon="writing"
        type="Memory"
        action={() =>
          updateUiState(
            makeCreateFragmentForm(
              {
                type: "TEXT",
              },
              { revealAfterCreate: true }
            ),
            false
          )
        }
      />

      <CaptureHeaderActionButton
        icon="photo"
        type="Photo"
        action={() =>
          updateUiState(
            makeCreateFragmentForm(
              {
                type: "PHOTO",
              },
              { revealAfterCreate: true }
            ),
            false
          )
        }
      />
    </Grid>
  );
}
