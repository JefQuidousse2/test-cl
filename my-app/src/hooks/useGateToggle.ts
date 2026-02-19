import { useState, useCallback } from "react";
import type { PickingPosition } from "../types";

interface UseGateToggleOptions {
  positions: PickingPosition[];
}

export function useGateToggle({ positions }: UseGateToggleOptions) {
  const [disabledGates, setDisabledGates] = useState<Set<string>>(new Set());

  const isGateEnabled = useCallback(
    (code: string) => !disabledGates.has(code),
    [disabledGates]
  );

  const isTerminalFullyEnabled = useCallback(
    (terminal: string) => {
      const terminalGates = positions.filter((p) => p.terminal === terminal);
      return terminalGates.every((p) => !disabledGates.has(p.code));
    },
    [positions, disabledGates]
  );

  const toggleGate = useCallback((code: string) => {
    setDisabledGates((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  }, []);

  const toggleTerminal = useCallback(
    (terminal: string) => {
      const terminalGates = positions.filter((p) => p.terminal === terminal);
      const anyEnabled = terminalGates.some((p) => !disabledGates.has(p.code));

      setDisabledGates((prev) => {
        const next = new Set(prev);
        if (anyEnabled) {
          // Disable all gates in this terminal
          terminalGates.forEach((p) => next.add(p.code));
        } else {
          // Enable all gates in this terminal
          terminalGates.forEach((p) => next.delete(p.code));
        }
        return next;
      });
    },
    [positions, disabledGates]
  );

  return { isGateEnabled, isTerminalFullyEnabled, toggleGate, toggleTerminal };
}
