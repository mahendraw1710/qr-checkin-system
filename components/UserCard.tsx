type Props = {
  user: {
    full_name: string;
    qr_id: string;
    active: boolean;
  };
};

export default function UserCard({
  user,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="font-bold text-xl mb-4">
        Guest's Information
      </h2>

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
            QR ID
          </p>

          <p className="font-semibold">
            {user.qr_id}
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Status
          </p>

          <span
            className={`px-3 py-1 rounded-full text-white ${
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