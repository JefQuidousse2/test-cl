import type { PickingItem, PickingPosition } from "../types";

export const PICKING_POSITIONS: PickingPosition[] = [
  { terminal: "Terminal1", gate: "Gate2", code: "T1G2", label: "Terminal1 Gate2" },
  { terminal: "Terminal1", gate: "Gate3", code: "T1G3", label: "Terminal1 Gate3" },
  { terminal: "Terminal4", gate: "Gate1", code: "T4G1", label: "Terminal4 Gate1" },
];

export const MOCK_PICKING_ITEMS: Record<string, PickingItem[]> = {
  T1G2: [
    {
      handlingUnitId: "HU-001",
      stockId: "STK-2001",
      terminal: "Terminal1",
      gate: "Gate2",
      gateCode: "T1G2",
      allocatedQuantity: 50,
      currentHuQuantity: 120,
      orderLines: 3,
      pallets: 2,
      customProperties: { box: true },
    },
    {
      handlingUnitId: "HU-002",
      stockId: "STK-2002",
      terminal: "Terminal1",
      gate: "Gate2",
      gateCode: "T1G2",
      allocatedQuantity: 25,
      currentHuQuantity: 80,
      orderLines: 1,
      pallets: 1,
      customProperties: {},
    },
  ],
  T1G3: [
    {
      handlingUnitId: "HU-003",
      stockId: "STK-3001",
      terminal: "Terminal1",
      gate: "Gate3",
      gateCode: "T1G3",
      allocatedQuantity: 10,
      currentHuQuantity: 10,
      orderLines: 2,
      pallets: 1,
      customProperties: { box: true },
    },
    {
      handlingUnitId: "HU-004",
      stockId: "STK-3002",
      terminal: "Terminal1",
      gate: "Gate3",
      gateCode: "T1G3",
      allocatedQuantity: 100,
      currentHuQuantity: 200,
      orderLines: 5,
      pallets: 3,
      customProperties: {},
    },
  ],
  T4G1: [
    {
      handlingUnitId: "HU-005",
      stockId: "STK-4001",
      terminal: "Terminal4",
      gate: "Gate1",
      gateCode: "T4G1",
      allocatedQuantity: 8,
      currentHuQuantity: 15,
      orderLines: 2,
      pallets: 1,
      customProperties: { box: false },
    },
  ],
};
