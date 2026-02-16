export interface PickingPosition {
  terminal: string;
  gate: string;
  code: string; // e.g. "T1G2"
  label: string; // e.g. "Terminal1 Gate2"
}

export interface PickingItem {
  handlingUnitId: string;
  stockId: string;
  terminal: string;
  gate: string;
  gateCode: string;
  allocatedQuantity: number;
  currentHuQuantity: number;
  orderLines: number;
  pallets: number;
  customProperties: Record<string, unknown>;
}

export interface OrderLinePickedPayload {
  notificationType: "OrderLinePicked";
  contextType: "Picking";
  payload: {
    handlingUnitId: string;
    quantityPicked: number;
    quantityMissing: number | "";
    gate: string;
  };
}

export interface InOrderRequest {
  id: string;
  type: "In";
  orderLines: {
    id: string;
    handlingUnitId: string;
    storageProfile: {
      stockId: string;
      quantity: number;
      carrierType: "EU";
      partial: true;
    };
  }[];
}

export interface DifferencePostingPayload {
  notificationType: "DifferencePosting";
  contextType: "Load";
  payload: {
    handlingUnitId: string;
    stockId: string;
    differenceQuantity: number;
  };
}

export interface EventLogEntry {
  id: string;
  timestamp: Date;
  type: "OrderLinePicked" | "InOrder" | "DifferencePosting" | "TransferToReject" | "EmptyPalletConfirm";
  data: unknown;
}

export type PickingStep =
  | "position-select"
  | "picking"
  | "completed";
