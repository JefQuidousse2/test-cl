import { useCallback, useState } from "react";
import type {
  PickingItem,
  PickingPosition,
  PickingStep,
  OrderLinePickedPayload,
  InOrderRequest,
  DifferencePostingPayload,
  EventLogEntry,
} from "../types";
import { MOCK_PICKING_ITEMS } from "../data/mockData";

let uniqueIdCounter = 0;
function generateId(): string {
  uniqueIdCounter += 1;
  return `Movu-${Date.now()}-${uniqueIdCounter}`;
}

interface UsePickingFlowProps {
  addEvent: (type: EventLogEntry["type"], data: unknown) => void;
}

export function usePickingFlow({ addEvent }: UsePickingFlowProps) {
  const [step, setStep] = useState<PickingStep>("position-select");
  const [selectedPosition, setSelectedPosition] = useState<PickingPosition | null>(null);
  const [items, setItems] = useState<PickingItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [remainingQuantities, setRemainingQuantities] = useState<Record<string, number>>({});

  const currentItem = items[currentItemIndex] ?? null;

  const selectPosition = useCallback((position: PickingPosition) => {
    setSelectedPosition(position);
    const positionItems = MOCK_PICKING_ITEMS[position.code] ?? [];
    setItems(positionItems);
    setCurrentItemIndex(0);
    const quantities: Record<string, number> = {};
    for (const item of positionItems) {
      quantities[item.handlingUnitId] = item.currentHuQuantity;
    }
    setRemainingQuantities(quantities);
    setStep("picking");
  }, []);

  const confirmPick = useCallback(
    (quantityPicked: number) => {
      if (!currentItem) return;

      // OrderLinePicked webhook
      const quantityMissing =
        quantityPicked < currentItem.allocatedQuantity
          ? currentItem.allocatedQuantity - quantityPicked
          : "";

      const webhook: OrderLinePickedPayload = {
        notificationType: "OrderLinePicked",
        contextType: "Picking",
        payload: {
          handlingUnitId: currentItem.handlingUnitId,
          quantityPicked,
          quantityMissing,
          gate: currentItem.gateCode,
        },
      };
      addEvent("OrderLinePicked", webhook);

      // Update remaining quantity
      const remaining =
        remainingQuantities[currentItem.handlingUnitId] - quantityPicked;
      setRemainingQuantities((prev) => ({
        ...prev,
        [currentItem.handlingUnitId]: remaining,
      }));

      // Create In-Order
      const inOrder: InOrderRequest = {
        id: generateId(),
        type: "In",
        orderLines: [
          {
            id: generateId(),
            handlingUnitId: currentItem.handlingUnitId,
            storageProfile: {
              stockId: currentItem.stockId,
              quantity: remaining,
              carrierType: "EU",
              partial: true,
            },
          },
        ],
      };
      addEvent("InOrder", { endpoint: "POST /api/v3/orders", body: inOrder });

      // Move to next item or complete
      if (currentItemIndex < items.length - 1) {
        setCurrentItemIndex((prev) => prev + 1);
      } else {
        setStep("completed");
      }
    },
    [currentItem, currentItemIndex, items.length, remainingQuantities, addEvent]
  );

  const inspectPallet = useCallback(
    (action: "transfer-reject" | "in-order-reject", reason: string) => {
      if (!currentItem) return;
      if (action === "transfer-reject") {
        addEvent("TransferToReject", {
          action: "Transfer to Reject",
          handlingUnitId: currentItem.handlingUnitId,
          reason,
        });
      } else {
        const inOrder: InOrderRequest = {
          id: generateId(),
          type: "In",
          orderLines: [
            {
              id: generateId(),
              handlingUnitId: currentItem.handlingUnitId,
              storageProfile: {
                stockId: currentItem.stockId,
                quantity: remainingQuantities[currentItem.handlingUnitId],
                carrierType: "EU",
                partial: true,
              },
            },
          ],
        };
        addEvent("TransferToReject", {
          action: "In-order with reject reason",
          reason,
          order: inOrder,
        });
      }
    },
    [currentItem, remainingQuantities, addEvent]
  );

  const confirmEmptyPallet = useCallback(
    (isEmpty: boolean) => {
      if (!currentItem) return;
      if (isEmpty) {
        addEvent("EmptyPalletConfirm", {
          handlingUnitId: currentItem.handlingUnitId,
          confirmed: true,
          message: "Pallet confirmed empty",
        });
      } else {
        addEvent("TransferToReject", {
          action: "Transfer to Reject (pallet not empty)",
          handlingUnitId: currentItem.handlingUnitId,
        });
      }
    },
    [currentItem, addEvent]
  );

  const updateStockCount = useCallback(
    (newQuantity: number) => {
      if (!currentItem) return;
      const expected = remainingQuantities[currentItem.handlingUnitId];
      const differenceQuantity = expected - newQuantity;

      setRemainingQuantities((prev) => ({
        ...prev,
        [currentItem.handlingUnitId]: newQuantity,
      }));

      const webhook: DifferencePostingPayload = {
        notificationType: "DifferencePosting",
        contextType: "Load",
        payload: {
          handlingUnitId: currentItem.handlingUnitId,
          stockId: currentItem.stockId,
          differenceQuantity,
        },
      };
      addEvent("DifferencePosting", webhook);
    },
    [currentItem, remainingQuantities, addEvent]
  );

  const reset = useCallback(() => {
    setStep("position-select");
    setSelectedPosition(null);
    setItems([]);
    setCurrentItemIndex(0);
    setRemainingQuantities({});
  }, []);

  return {
    step,
    selectedPosition,
    items,
    currentItem,
    currentItemIndex,
    remainingQuantities,
    selectPosition,
    confirmPick,
    inspectPallet,
    confirmEmptyPallet,
    updateStockCount,
    reset,
  };
}
