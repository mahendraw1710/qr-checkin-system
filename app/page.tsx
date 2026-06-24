"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

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
        const checkUser = async (qrId: string) => {
          const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("qr_id", qrId)
          .single();

        if (error || !data ) {
          alert("QR Not Registered");
          return;
        }

        alert(`Welcome ${data.full_name}`);
        };
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        QR Check-In System
      </h1>

      <div id="reader"></div>
    </main>
  );
}