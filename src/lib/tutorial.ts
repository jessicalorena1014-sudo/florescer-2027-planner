import { useCallback } from "react";
import { useLocalState } from "@/lib/storage";

export type TutorialState = {
  completed: boolean;
  version: number;
};

const CURRENT_VERSION = 1;

export function useTutorial() {
  const [state, setState] = useLocalState<TutorialState>("tutorial:state", {
    completed: false,
    version: 0,
  });

  const shouldShow = !state.completed || state.version < CURRENT_VERSION;

  const finish = useCallback(
    () => setState({ completed: true, version: CURRENT_VERSION }),
    [setState],
  );
  const restart = useCallback(
    () => setState({ completed: false, version: 0 }),
    [setState],
  );

  return { shouldShow, finish, restart };
}

export function useTipSeen(key: string) {
  const [seen, setSeen] = useLocalState<boolean>(`tutorial:tip:${key}`, false);
  return { seen, markSeen: () => setSeen(true) };
}
