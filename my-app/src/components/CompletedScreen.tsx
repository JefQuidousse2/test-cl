import { Button, Card } from "@movu/ui";

interface CompletedScreenProps {
  onReset: () => void;
}

export function CompletedScreen({ onReset }: CompletedScreenProps) {
  return (
    <div className="completed-screen">
      <Card>
        <div className="completed-content">
          <h2>Picking Complete</h2>
          <p>All items for this position have been picked.</p>
          <Button
            variant="solid"
            color="primary"
            label="Start New Picking Session"
            onClick={onReset}
          />
        </div>
      </Card>
    </div>
  );
}
