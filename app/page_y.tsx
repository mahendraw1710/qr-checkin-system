"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("users")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    testConnection();
  }, []);

  return <div>Testing Supabase...</div>;
}