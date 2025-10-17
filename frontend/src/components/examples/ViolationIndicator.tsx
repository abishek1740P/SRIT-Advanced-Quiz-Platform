import ViolationIndicator from '../Buttons/ViolationIndicator';

export default function ViolationIndicatorExample() {
  return (
    <div className="p-8 space-y-4 bg-background">
      <ViolationIndicator count={0} />
      <ViolationIndicator count={1} />
      <ViolationIndicator count={3} />
    </div>
  );
}
