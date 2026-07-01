type Props = {
  step: "scan" | "photo" | "success";
};

export default function ProgressBar({
  step,
}: Props) {
  const current =
    step === "scan"
      ? 1
      : step === "photo"
      ? 2
      : 3;

  const steps = [
    "Scan QR",
    "Take Photo",
    "Completed",
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between">
        {steps.map((title, index) => (
          <div
            key={title}
            className="flex flex-col items-center flex-1"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                current >= index + 1
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>

            <span className="mt-2 text-sm">
              {title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}