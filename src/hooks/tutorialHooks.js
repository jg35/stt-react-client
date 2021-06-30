import { useContext, useState, useEffect } from "react";
import { UIContext } from "~/app";

export function useStepActive(steps) {
  const { uiState } = useContext(UIContext);
  const [active, setActive] = useState(steps.includes(uiState.tutorialStep));

  useEffect(() => {
    console.log(uiState.tutorialStep);
    setActive(steps.includes(uiState.tutorialStep));
  }, [uiState.tutorialStep]);

  return active;
}
