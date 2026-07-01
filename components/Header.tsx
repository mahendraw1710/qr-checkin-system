"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-lg p-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">
          Zahro & Mahen Wedding
        </h1>

        <p className="text-blue-100">
          QR Check-in System
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm opacity-80">
          Current Time
        </p>

        <p className="font-semibold">
          {time}
        </p>
      </div>
    </header>
  );
}