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

function getEventColor(type: EventLogEntry["type"]): string {
  switch (type) {
    case "OrderLinePicked":
      return "#2e7d32";
    case "InOrder":
      return "#1565c0";
    case "DifferencePosting":
      return "#b54300";
    case "TransferToReject":
      return "#c62828";
    case "EmptyPalletConfirm":
      return "#6a1b9a";
    default:
      return "#424242";
  }
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
                  style={{ backgroundColor: getEventColor(event.type) }}
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
