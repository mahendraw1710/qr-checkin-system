type Props = {
  message: string;
  type?: "success" | "error" | "info";
};

export default function StatusBanner({
  message,
  type = "info",
}: Props) {
  if (!message) return null;

  const colors = {
    success:
      "bg-green-100 text-green-700 border-green-300",

    error:
      "bg-red-100 text-red-700 border-red-300",

    info:
      "bg-blue-100 text-blue-700 border-blue-300",
  };

  return (
    <div
      className={`border rounded-xl p-4 ${colors[type]}`}
    >
      {message}
    </div>
  );
}