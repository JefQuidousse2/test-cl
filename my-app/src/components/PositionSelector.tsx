import { useState } from "react";
import { Button, Card, IconButton, Dialog } from "@movu/ui";
import ToggleOn from "@mui/icons-material/ToggleOn";
import ToggleOff from "@mui/icons-material/ToggleOff";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import type { PickingPosition } from "../types";
import { PICKING_POSITIONS } from "../data/mockData";

interface PositionSelectorProps {
  onSelect: (position: PickingPosition) => void;
  isGateEnabled: (code: string) => boolean;
  isTerminalFullyEnabled: (terminal: string) => boolean;
  toggleGate: (code: string) => void;
  toggleTerminal: (terminal: string) => void;
}

function groupByTerminal(positions: PickingPosition[]) {
  const groups: Record<string, PickingPosition[]> = {};
  for (const pos of positions) {
    if (!groups[pos.terminal]) {
      groups[pos.terminal] = [];
    }
    groups[pos.terminal].push(pos);
  }
  return groups;
}

export function PositionSelector({
  onSelect,
  isGateEnabled,
  isTerminalFullyEnabled,
  toggleGate,
  toggleTerminal,
}: PositionSelectorProps) {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const terminalGroups = groupByTerminal(PICKING_POSITIONS);

  return (
    <div className="position-selector">
      <h2>Select Picking Position</h2>
      <p className="subtitle">Choose a terminal and gate to begin picking</p>

      {Object.entries(terminalGroups).map(([terminal, positions]) => {
        const allEnabled = isTerminalFullyEnabled(terminal);
        return (
          <div key={terminal} className="terminal-section">
            <div className="terminal-header">
              <h3 className="terminal-title">{terminal}</h3>
              <Button
                variant="soft"
                color={allEnabled ? "danger" : "primary"}
                label={allEnabled ? "Disable All Gates" : "Enable All Gates"}
                startIcon={allEnabled ? <ToggleOff /> : <ToggleOn />}
                size="sm"
                onClick={() => toggleTerminal(terminal)}
              />
            </div>
            <div className="position-grid">
              {positions.map((pos) => {
                const enabled = isGateEnabled(pos.code);
                return (
                  <div
                    key={pos.code}
                    className={`position-card-wrapper ${!enabled ? "position-card-disabled" : ""}`}
                  >
                    <Card>
                      <div className="position-card-content">
                        <div className="gate-header-row">
                          <h3>{pos.label}</h3>
                          <IconButton
                            icon={enabled ? <ToggleOn color="success" /> : <ToggleOff />}
                            tooltip={enabled ? "Disable gate" : "Enable gate"}
                            onClick={() => toggleGate(pos.code)}
                          />
                        </div>
                        <p className="position-code">{pos.code}</p>
                        {!enabled && (
                          <>
                            <div className="gate-disabled-message">
                              <span>Disabled for free picking</span>
                              <IconButton
                                icon={<InfoOutlined fontSize="small" />}
                                tooltip="More info"
                                onClick={() => setInfoDialogOpen(true)}
                              />
                            </div>
                          </>
                        )}
                        <Button
                          variant="solid"
                          color="primary"
                          label="Select"
                          disabled={!enabled}
                          onClick={() => onSelect(pos)}
                        />
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <Dialog
        open={infoDialogOpen}
        title="Gate Disabled"
        onClose={() => setInfoDialogOpen(false)}
        size="sm"
      >
        <p>
          This gate is only disabled for the free picking flow and can still be
          used for other purposes.
        </p>
      </Dialog>
    </div>
  );
}
