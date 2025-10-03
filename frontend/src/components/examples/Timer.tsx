import Timer from '../Timer';

export default function TimerExample() {
  return (
    <div className="p-8 space-y-6 bg-background">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large - Critical (2 min)</p>
        <Timer initialSeconds={120} size="lg" onTimeUp={() => console.log('Time up!')} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medium - Warning (5 min)</p>
        <Timer initialSeconds={300} size="md" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small - Normal (10 min)</p>
        <Timer initialSeconds={600} size="sm" />
      </div>
    </div>
  );
}
