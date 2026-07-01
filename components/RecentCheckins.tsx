type Log = {
  full_name: string;
  checkin_time: string;
};

type Props = {
  logs: Log[];
};

export default function RecentCheckins({
  logs,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Recent Check-ins
      </h2>

      {logs.length === 0 ? (
        <p className="text-gray-500">
          No guests checked in yet.
        </p>
      ) : (
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-2"
            >
              <span>{log.full_name}</span>

              <span className="text-gray-500 text-sm">
                {new Date(log.checkin_time).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}