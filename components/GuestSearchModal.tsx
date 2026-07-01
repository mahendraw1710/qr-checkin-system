"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Guest = {
  qr_id: string;
  full_name: string;
  active: boolean;
  tamu: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectGuest: (guest: Guest) => void;
};

export default function GuestSearchModal({
  open,
  onClose,
  onSelectGuest,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const resetSearch = () => {
  setKeyword("");
  setResults([]);
  setLoading(false);
};

useEffect(() => {
  if (!open) {
    resetSearch();
  }
}, [open]);

  if (!open) return null;

  const searchGuests = async () => {
  const searchText = keyword.trim();

  if (searchText.length < 4) {
    setResults([]);
    alert("Please enter at least 4 characters.");
    return;
  }

  setLoading(true);

    const { data, error } = await supabase
        .from("users")
        .select("qr_id, full_name, active, tamu")
        .or(
          `full_name.ilike.%${searchText}%,tamu.ilike.%${searchText}%`
        )
        .limit(10);

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    setResults(data ?? []);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold">
              Search Guest
            </h2>
            <p className="text-gray-500 text-sm">
              Search by guest name or invited by
            </p>
          </div>

          <button
              onClick={() => {
                resetSearch();
                onClose();
              }}
              className="text-gray-500 hover:text-black text-2xl"
            >
              ×
        </button>
        </div>

        <div className="flex gap-2 mb-5">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchGuests();
            }}
            placeholder="Example: Ratna or Zahro family"
            className="border rounded-lg px-4 py-3 flex-1"
          />

          <button
            onClick={searchGuests}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="text-gray-500">Searching...</p>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((guest) => (
            <button
              key={guest.qr_id}
              onClick={() => {
                onSelectGuest(guest);
                resetSearch();
                onClose();
              }}
              className="w-full text-left border rounded-xl p-4 hover:bg-blue-50 transition"
            >
              <p className="font-semibold text-lg">
                {guest.full_name}
              </p>

              <p className="text-sm text-gray-500">
                QR ID: {guest.qr_id}
              </p>

              <p className="text-sm text-gray-500">
                Invited by: {guest.tamu ?? "-"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}