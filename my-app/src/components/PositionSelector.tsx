import { Button, Card } from "@movu/ui";
import type { PickingPosition } from "../types";
import { PICKING_POSITIONS } from "../data/mockData";

interface PositionSelectorProps {
  onSelect: (position: PickingPosition) => void;
}

export function PositionSelector({ onSelect }: PositionSelectorProps) {
  return (
    <div className="position-selector">
      <h2>Select Picking Position</h2>
      <p className="subtitle">Choose a terminal and gate to begin picking</p>
      <div className="position-grid">
        {PICKING_POSITIONS.map((pos) => (
          <Card key={pos.code}>
            <div className="position-card-content">
              <h3>{pos.label}</h3>
              <p className="position-code">{pos.code}</p>
              <Button
                variant="solid"
                color="primary"
                label="Select"
                onClick={() => onSelect(pos)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
