import { Card } from "@movu/ui";
import type { EventLogEntry } from "../types";

interface EventLogProps {
  events: EventLogEntry[];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getEventBadgeStyle(type: EventLogEntry["type"]): React.CSSProperties {
  const cssVars = {
    OrderLinePicked: "var(--event-badge-picked)",
    InOrder: "var(--event-badge-in-order)",
    DifferencePosting: "var(--event-badge-difference)",
    TransferToReject: "var(--event-badge-transfer)",
    EmptyPalletConfirm: "var(--event-badge-empty)",
  } as Record<string, string>;

  return {
    backgroundColor: cssVars[type] || "var(--event-badge-default)",
  };
}

export function EventLog({ events }: EventLogProps) {
  return (
    <div className="event-log">
      <h3>Event Log</h3>
      <div className="event-log-list">
        {events.length === 0 && (
          <p className="event-log-empty">No events yet</p>
        )}
        {events.map((event) => (
          <Card key={event.id}>
            <div className="event-entry">
              <div className="event-header">
                <span
                  className="event-type-badge"
                  style={getEventBadgeStyle(event.type)}
                >
                  {event.type}
                </span>
                <span className="event-time">{formatTime(event.timestamp)}</span>
              </div>
              <pre className="event-data">
                {JSON.stringify(event.data, null, 2)}
              </pre>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
