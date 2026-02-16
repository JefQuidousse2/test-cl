import { useState } from "react";
import { Button, Card, TextInput, Dialog } from "@movu/ui";
import type { PickingItem } from "../types";

interface StockCountingPanelProps {
  item: PickingItem;
  remainingQuantity: number;
  onInspectPallet: (action: "transfer-reject" | "in-order-reject", reason: string) => void;
  onConfirmEmptyPallet: (isEmpty: boolean) => void;
  onUpdateStockCount: (newQuantity: number) => void;
}

export function StockCountingPanel({
  item,
  remainingQuantity,
  onInspectPallet,
  onConfirmEmptyPallet,
  onUpdateStockCount,
}: StockCountingPanelProps) {
  const [showInspectDialog, setShowInspectDialog] = useState(false);
  const [inspectAction, setInspectAction] = useState<"transfer-reject" | "in-order-reject">("transfer-reject");
  const [rejectReason, setRejectReason] = useState("");

  const [showEmptyDialog, setShowEmptyDialog] = useState(false);

  const [showLowVolumeDialog, setShowLowVolumeDialog] = useState(false);
  const [countInput, setCountInput] = useState("");

  const showEmptyCheck = remainingQuantity === 0;
  const showLowVolumeCheck = remainingQuantity > 0 && remainingQuantity < 10;

  const handleInspectConfirm = () => {
    onInspectPallet(inspectAction, rejectReason);
    setShowInspectDialog(false);
    setRejectReason("");
  };

  const handleEmptyConfirm = () => {
    onConfirmEmptyPallet(true);
    setShowEmptyDialog(false);
  };

  const handleCountSubmit = () => {
    const qty = Number(countInput);
    if (isNaN(qty) || qty < 0) return;
    onUpdateStockCount(qty);
    setShowLowVolumeDialog(false);
    setCountInput("");
  };

  return (
    <>
      <Card>
        <div className="stock-counting-section">
          <h3>Stock Counting</h3>
          <div className="stock-actions">
            <Button
              variant="outlined"
              color="warning"
              label="Inspect Pallet"
              onClick={() => setShowInspectDialog(true)}
            />
            {showEmptyCheck && (
              <Button
                variant="outlined"
                color="danger"
                label="Confirm Empty Pallet"
                onClick={() => setShowEmptyDialog(true)}
              />
            )}
            {showLowVolumeCheck && (
              <Button
                variant="outlined"
                color="warning"
                label={`Low Volume (${remainingQuantity}) — Count Items`}
                onClick={() => setShowLowVolumeDialog(true)}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Inspect Pallet Dialog */}
      <Dialog
        open={showInspectDialog}
        title="Inspect Pallet"
        onClose={() => setShowInspectDialog(false)}
        onConfirm={handleInspectConfirm}
        confirmLabel="Confirm"
        hasCancel
        cancelLabel="Cancel"
      >
        <div className="inspect-dialog-content">
          <p>
            Inspecting <strong>{item.handlingUnitId}</strong>
          </p>
          <div className="inspect-actions">
            <Button
              variant={inspectAction === "transfer-reject" ? "solid" : "outlined"}
              color="danger"
              label="Transfer to Reject"
              onClick={() => setInspectAction("transfer-reject")}
              size="sm"
            />
            <Button
              variant={inspectAction === "in-order-reject" ? "solid" : "outlined"}
              color="warning"
              label="In-order with Reject"
              onClick={() => setInspectAction("in-order-reject")}
              size="sm"
            />
          </div>
          <TextInput
            label="Reject Reason"
            placeholder="Enter reason"
            value={rejectReason}
            onChange={(val) => setRejectReason(val)}
          />
        </div>
      </Dialog>

      {/* Empty Pallet Dialog */}
      <Dialog
        open={showEmptyDialog}
        title="Empty Pallet Check"
        onClose={() => {
          onConfirmEmptyPallet(false);
          setShowEmptyDialog(false);
        }}
        onConfirm={handleEmptyConfirm}
        confirmLabel="Yes, it's empty"
        hasCancel
        cancelLabel="No, not empty"
        isDanger
      >
        <p>Confirm pallet is empty?</p>
        <p>
          If the pallet is not empty, it will be transferred to reject.
        </p>
      </Dialog>

      {/* Low Volume Count Dialog */}
      <Dialog
        open={showLowVolumeDialog}
        title="Low Volume — Count Remaining Items"
        onClose={() => setShowLowVolumeDialog(false)}
        onConfirm={handleCountSubmit}
        confirmLabel="Submit Count"
        hasCancel
        cancelLabel="Cancel"
      >
        <div className="low-volume-content">
          <p>
            Remaining quantity is low (<strong>{remainingQuantity}</strong>).
            Please count the remaining items on the pallet.
          </p>
          <TextInput
            label="Actual Count"
            placeholder="Enter count"
            value={countInput}
            onChange={(val) => setCountInput(val)}
            type="number"
          />
        </div>
      </Dialog>
    </>
  );
}
