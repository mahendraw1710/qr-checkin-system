type Props = {
  visible: boolean;
};

export default function ScannerPanel({
  visible,
}: Props) {
  if (!visible) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        Scan QR Code
      </h2>

      <div
        id="reader"
        className="rounded overflow-hidden"
      ></div>
    </div>
  );
}