"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Home() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        alert(`QR Detected: ${decodedText}`);
      },
      () => {}
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">
        QR Check-In System
      </h1>

      <div id="reader"></div>
    </div>
  );
}