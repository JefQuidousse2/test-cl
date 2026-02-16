import { usePickingFlow } from "./hooks/usePickingFlow";
import { useEventLog } from "./hooks/useEventLog";
import { PositionSelector } from "./components/PositionSelector";
import { PickingScreen } from "./components/PickingScreen";
import { CompletedScreen } from "./components/CompletedScreen";
import { EventLog } from "./components/EventLog";
import "./App.css";

function App() {
  const { events, addEvent, clearEvents } = useEventLog();
  const picking = usePickingFlow({ addEvent });

  const handleReset = () => {
    picking.reset();
    clearEvents();
  };

  return (
    <div className="app-layout">
      <div className="main-panel">
        {picking.step === "position-select" && (
          <PositionSelector onSelect={picking.selectPosition} />
        )}
        {picking.step === "picking" && picking.currentItem && picking.selectedPosition && (
          <PickingScreen
            item={picking.currentItem}
            position={picking.selectedPosition}
            remainingQuantity={
              picking.remainingQuantities[picking.currentItem.handlingUnitId]
            }
            itemIndex={picking.currentItemIndex}
            totalItems={picking.items.length}
            onConfirmPick={picking.confirmPick}
            onInspectPallet={picking.inspectPallet}
            onConfirmEmptyPallet={picking.confirmEmptyPallet}
            onUpdateStockCount={picking.updateStockCount}
            onGoBack={picking.goBack}
          />
        )}
        {picking.step === "completed" && (
          <CompletedScreen onReset={handleReset} />
        )}
      </div>
      <div className="side-panel">
        <EventLog events={events} />
      </div>
    </div>
  );
}

export default App;
