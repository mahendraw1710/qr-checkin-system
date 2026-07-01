"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Guest = {
  qr_id: string;
  full_name: string;
  active: boolean;
  tamu: string | null;
};

type Props = {
  onSelectGuest: (guest: Guest) => void;
};

export default function GuestSearch({
  onSelectGuest,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);

  const searchGuests = async () => {
    if (!keyword.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("qr_id, full_name, active, tamu")
      .or(
        `full_name.ilike.%${keyword}%,tamu.ilike.%${keyword}%`
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
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Manual Guest Search
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchGuests();
          }}
          placeholder="Search guest name or invited by..."
          className="border rounded-lg px-4 py-2 flex-1"
        />

        <button
          onClick={searchGuests}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="text-gray-500">Searching...</p>
      )}

      <div className="space-y-3">
        {results.map((guest) => (
          <button
            key={guest.qr_id}
            onClick={() => onSelectGuest(guest)}
            className="w-full text-left border rounded-lg p-4 hover:bg-blue-50"
          >
            <p className="font-semibold">
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
  );
}