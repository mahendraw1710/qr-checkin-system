"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/lib/supabase";
import PhotoCapture from "@/components/PhotoCapture";
import { uploadPhoto } from "@/lib/uploadPhoto";
import { base64ToFile } from "@/lib/base64ToFile";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import ScannerPanel from "@/components/ScannerPanel";
import UserCard from "@/components/UserCard";
import StatusBanner from "@/components/StatusBanner";
import SuccessCard from "@/components/SuccessCard";
import RecentCheckins from "@/components/RecentCheckins";
import GuestSearch from "@/components/GuestSearch";
import GuestSearchModal from "@/components/GuestSearchModal";

type User = {
  qr_id: string;
  tamu: string | null;
  full_name: string;
  active: boolean;
  org: string | null;
};

export default function Home() {
  const [step, setStep] = useState<
    "scan" | "photo" | "success"
  >("scan");

  const [recentLogs, setRecentLogs] = useState<
  {
    full_name: string;
    checkin_time: string;
  }[]
>([]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const processingRef = useRef(false);
  const [message, setMessage] = useState("");
  const isVip =
  user?.tamu?.toUpperCase() === "VIP";
  const hasCheckedInToday = async (
  qrId: string
) => {
  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).toISOString();

  const { data, error } = await supabase
    .from("checkin_logs")
    .select("*")
    .eq("qr_id", qrId)
    .gte("checkin_time", startOfDay)
    .limit(1);

  if (error) {
    console.error(error);
    return false;
  }

  return data.length > 0;
};
  
  const showMessage = (
    text: string,
    duration = 3000
  ) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, duration);
};

  const loadRecentCheckins = async () => {
  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).toISOString();
  // Get latest 5 logs
  const { data: logs, error: logError } = await supabase
    .from("checkin_logs")
    .select("qr_id, checkin_time")
    .gte("checkin_time", startOfDay)
    .order("checkin_time", {
      ascending: false,
    })
  .limit(5);

  if (logError) {
    console.error(logError);
    return;
  }

  if (!logs || logs.length === 0) {
    setRecentLogs([]);
    return;
  }

  // Get matching users
  const qrIds = logs.map((log) => log.qr_id);

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("qr_id, full_name")
    .in("qr_id", qrIds);

  if (userError) {
    console.error(userError);
    return;
  }

  // Merge data
  const merged = logs.map((log) => ({
    full_name:
      users?.find((u) => u.qr_id === log.qr_id)?.full_name ??
      "Unknown",
    checkin_time: log.checkin_time,
  }));

  console.log("Merged Logs:", merged);

  setRecentLogs(merged);
};

  const saveCheckin = async () => {
  if (!photo || !user) {
    setMessage("Photo or user is missing.");
    return;
  }

  try {
    const file = base64ToFile(
      photo,
      `${user.qr_id}.jpg`
    );

    const photoUrl =
      await uploadPhoto(file);

    console.log(
      "Photo uploaded:",
      photoUrl
    );

    const { error } =
      await supabase
        .from("checkin_logs")
        .insert({
          qr_id: user.qr_id,
          photo_url: photoUrl,
        });

    if (error) {
      throw error;
    }

    await loadRecentCheckins();

    setStep("success");
  } catch (error) {
    console.error(error);

    setMessage("Failed to save check-in.");
  }
};

  useEffect(() => {
    loadRecentCheckins();

    if (step !== "scan") return;

    setTimeout(() => {
      processingRef.current = false;
    }, 1500);

    const checkUser = async (qrId: string) => {
      console.log("QR:", qrId);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("qr_id", qrId)
        .single();

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error || !data) {
        showMessage("❌ QR Not Registered");
        processingRef.current = false;
        return;
      }

      const alreadyCheckedIn = await hasCheckedInToday(qrId);

      if (alreadyCheckedIn) {

      showMessage(
        `${data.full_name} has already checked in today.`
      );

      processingRef.current = false;

      return;
    }
      setUser(data);
      setStep("photo");
    };

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 320,
          height: 320
        },
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (processingRef.current) return;

        processingRef.current = true;

        await checkUser(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [step]);

  const endSession = async () => {
    try {
      await scannerRef.current?.clear();
    } catch {}

    setUser(null);
    setPhoto(null);
    setMessage("");
    setStep("scan");

    setTimeout(() => {
      processingRef.current = false;
    }, 1500);
  };

  return (
  <main className="min-h-screen bg-slate-100">

    <div className="max-w-7xl mx-auto p-6 space-y-6">

      <Header />

      <ProgressBar step={step} />

      <StatusBanner
        message={message}
        type="info"
      />

      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT */}

        <div>

          <ScannerPanel
            visible={step === "scan"}
          />
          {step === "scan" && (
  <div className="mt-4 text-center">
    <p className="text-sm text-gray-500 mb-2">
      Guest forgot or cannot scan QR?
    </p>

    <button
      onClick={() => setSearchOpen(true)}
      className="bg-white border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50"
    >
      🔍 Search Guest Manually
    </button>
  </div>
)}

          {step === "photo" && !photo && (

            <PhotoCapture
              onCapture={(image) =>
                setPhoto(image)
              }
            />

          )}

          {step === "photo" && photo && (

            <div className="bg-white rounded-xl shadow-lg p-6">

              <img
                src={photo}
                alt="Captured"
                className="rounded-lg"
              />

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    setPhoto(null)
                  }
                  className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
                >
                  Retake
                </button>

                <button
                  onClick={saveCheckin}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Continue
                </button>

              </div>

            </div>

          )}

        </div>

        {/* RIGHT */}

        <div className="space-y-6">
          <RecentCheckins logs={recentLogs} />
          {user && step !== "success" && (
            <UserCard user={user} />
          )}

          {step === "success" && user && (

            <SuccessCard
              userName={user.full_name}
              onRetry={() => {
                setPhoto(null);
                setStep("photo");
              }}
              onEnd={endSession}
            />

          )}

        </div>

      </div>

    </div>
      <GuestSearchModal
      open={searchOpen}
      onClose={() => setSearchOpen(false)}
      onSelectGuest={async (guest) => {
        const alreadyCheckedIn =
          await hasCheckedInToday(guest.qr_id);
      
        if (alreadyCheckedIn) {
          showMessage(
            `${guest.full_name} has already checked in today.`
          );
          return;
        }
      
        setUser(guest);
        setStep("photo");
      }}
    />
  </main>
);
}