type Props = {
  user: {
    full_name: string;
    qr_id: string;
    tamu: string | null;
    active: boolean;
    org: string | null;
  };
};

export default function UserCard({
  user,
}: Props) {
  const isVip =
    user.tamu?.toUpperCase() === "VIP";

  return (
    <div
      className={`rounded-xl shadow-lg p-6 ${
        isVip
          ? "bg-amber-50 border-2 border-amber-400"
          : "bg-white"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Guest&apos;s Information
        </h2>

        {isVip && (
          <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            ⭐ VIP GUEST
          </span>
        )}
      </div>

      {/* GUEST DETAILS */}
      <div className="space-y-3">
        <div>
          <p className="text-gray-500">
            Full Name
          </p>

          <p className="font-semibold">
            {user.full_name}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Tamu
          </p>

          <p className="font-semibold">
            {user.tamu ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Keterangan
          </p>

          <p className="font-semibold">
            {user.org ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Status
          </p>

          <span
            className={`inline-block px-3 py-1 rounded-full text-white ${
              user.active
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {user.active
              ? "ACTIVE"
              : "INACTIVE"}
          </span>
        </div>
      </div>
    </div>
  );
}