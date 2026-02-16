import { useCallback, useState } from "react";
import type { EventLogEntry } from "../types";

let eventCounter = 0;

export function useEventLog() {
  const [events, setEvents] = useState<EventLogEntry[]>([]);

  const addEvent = useCallback(
    (type: EventLogEntry["type"], data: unknown) => {
      eventCounter += 1;
      const entry: EventLogEntry = {
        id: `evt-${eventCounter}`,
        timestamp: new Date(),
        type,
        data,
      };
      setEvents((prev) => [entry, ...prev]);
    },
    []
  );

  const clearEvents = useCallback(() => setEvents([]), []);

  return { events, addEvent, clearEvents };
}
