type Props = {
  userName: string;
  onRetry: () => void;
  onEnd: () => void;
};

export default function SuccessCard({
  userName,
  onRetry,
  onEnd,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">

      <div className="text-6xl mb-4">
        ✅
      </div>

      <h2 className="text-3xl font-bold">
        Check-In Successful
      </h2>

      <p className="mt-4 text-gray-600">
        Welcome,
      </p>

      <p className="text-xl font-semibold">
        {userName}
      </p>

      <div className="flex justify-center gap-4 mt-8">

        <button
          onClick={onRetry}
          className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
        >
          Retry Photo
        </button>

        <button
          onClick={onEnd}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          End Session
        </button>

      </div>

    </div>
  );
}