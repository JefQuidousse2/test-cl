import { useState } from "react";
import { Button, Card, TextInput, Dialog } from "@movu/ui";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import type { PickingItem, PickingPosition } from "../types";
import { StockCountingPanel } from "./StockCountingPanel";

interface PickingScreenProps {
  item: PickingItem;
  position: PickingPosition;
  remainingQuantity: number;
  itemIndex: number;
  totalItems: number;
  onConfirmPick: (quantityPicked: number) => void;
  onInspectPallet: (action: "transfer-reject" | "in-order-reject", reason: string) => void;
  onConfirmEmptyPallet: (isEmpty: boolean) => void;
  onUpdateStockCount: (newQuantity: number) => void;
  onGoBack: () => void;
}

export function PickingScreen({
  item,
  position,
  remainingQuantity,
  itemIndex,
  totalItems,
  onConfirmPick,
  onInspectPallet,
  onConfirmEmptyPallet,
  onUpdateStockCount,
  onGoBack,
}: PickingScreenProps) {
  const [quantityInput, setQuantityInput] = useState("");
  const [showDeviationDialog, setShowDeviationDialog] = useState(false);
  const [pendingQuantity, setPendingQuantity] = useState(0);

  const isBox = item.customProperties.box === true;

  const handleSubmitQuantity = () => {
    const qty = Number(quantityInput);
    if (isNaN(qty) || qty < 0) return;

    if (qty !== item.allocatedQuantity) {
      setPendingQuantity(qty);
      setShowDeviationDialog(true);
    } else {
      onConfirmPick(qty);
      setQuantityInput("");
    }
  };

  const handleConfirmDeviation = () => {
    onConfirmPick(pendingQuantity);
    setShowDeviationDialog(false);
    setQuantityInput("");
  };

  return (
    <div className="picking-screen">
      <div className="picking-header">
        <Button
          variant="plain"
          size="sm"
          onClick={onGoBack}
          className="back-button"
        >
          <KeyboardBackspaceIcon style={{ marginRight: "0.35rem" }} />
          Back to Positions
        </Button>
        <h2>
          Picking — {position.label}
        </h2>
        <span className="item-counter">
          Item {itemIndex + 1} of {totalItems}
        </span>
      </div>

      {isBox && (
        <div className="box-banner">
          <WarningAmberIcon />
          <span>Always pick full boxes. You may round quantity.</span>
        </div>
      )}

      <Card>
        <div className="picking-details">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Handling Unit ID</span>
              <span className="detail-value">{item.handlingUnitId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stock ID</span>
              <span className="detail-value">{item.stockId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Terminal &amp; Gate</span>
              <span className="detail-value">
                {item.terminal} {item.gate}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Requested Quantity</span>
              <span className="detail-value highlight">{item.allocatedQuantity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current HU Quantity</span>
              <span className="detail-value">{remainingQuantity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"># Orderlines</span>
              <span className="detail-value">{item.orderLines}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"># Pallets</span>
              <span className="detail-value">{item.pallets}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="quantity-section">
          <h3>Enter Picked Quantity</h3>
          <div className="quantity-input-row">
            <TextInput
              label="Quantity Picked"
              placeholder="Enter quantity"
              value={quantityInput}
              onChange={(val) => setQuantityInput(val)}
              type="number"
            />
            <Button
              variant="solid"
              color="primary"
              label="Confirm Pick"
              onClick={handleSubmitQuantity}
              disabled={!quantityInput}
            />
          </div>
        </div>
      </Card>

      <StockCountingPanel
        item={item}
        remainingQuantity={remainingQuantity}
        onInspectPallet={onInspectPallet}
        onConfirmEmptyPallet={onConfirmEmptyPallet}
        onUpdateStockCount={onUpdateStockCount}
      />

      <Dialog
        open={showDeviationDialog}
        title="Quantity Deviation"
        onClose={() => setShowDeviationDialog(false)}
        onConfirm={handleConfirmDeviation}
        confirmLabel="Continue"
        hasCancel
        cancelLabel="Cancel"
      >
        <p>
          Entered quantity (<strong>{pendingQuantity}</strong>) deviates from
          requested quantity (<strong>{item.allocatedQuantity}</strong>).
          Continue?
        </p>
      </Dialog>
    </div>
  );
}
