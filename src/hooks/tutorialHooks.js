import { useContext, useState, useEffect } from "react";
import { UIContext } from "@src/app";

export function useStepActive(steps) {
  const { uiState } = useContext(UIContext);
  const [active, setActive] = useState(steps.includes(uiState.tutorialStep));

  useEffect(() => {
    setActive(steps.includes(uiState.tutorialStep));
  }, [uiState.tutorialStep]);

  return active;
}

export function useTutorialActive() {
  const { uiState } = useContext(UIContext);
  const [active, setActive] = useState(!!uiState.tutorialStep);

  useEffect(() => {
    setActive(!!uiState.tutorialStep);
  }, [uiState.tutorialStep]);

  return active;
}
