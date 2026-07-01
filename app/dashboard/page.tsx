"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type RecentLog = {
  qr_id: string;
  full_name: string;
  checkin_time: string;
};

type TamuChartData = {
  name: string;
  value: number;
};

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

export default function DashboardPage() {
  const [totalGuests, setTotalGuests] = useState(0);
  const [checkedInToday, setCheckedInToday] = useState(0);
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);
  const [checkedInByTamu, setCheckedInByTamu] = useState<TamuChartData[]>([]);
  const [notCheckedInByTamu, setNotCheckedInByTamu] = useState<TamuChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const remainingGuests = totalGuests - checkedInToday;

  const attendanceRate =
    totalGuests === 0
      ? 0
      : Math.round((checkedInToday / totalGuests) * 100);

  const getTodayRange = () => {
    const now = new Date();

    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupByTamu = (
    
    guests: { tamu: string | null }[]
  ) => {
    const grouped: Record<string, number> = {};
    

    guests.forEach((guest) => {
    const getTamuName = (tamu: string | null) => {
      switch (tamu) {
        case "PP":
          return "PP - Pengantin Pria";
    
        case "PW":
          return "PW - Pengantin Wanita";
    
        default:
          return tamu || "Unknown";
      }
    };
    const key = getTamuName(guest.tamu);
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const loadDashboard = async () => {
    setLoading(true);

    const { start, end } = getTodayRange();

    const { data: allGuests } = await supabase
      .from("users")
      .select("qr_id, full_name, tamu");

    const { data: todayLogs } = await supabase
      .from("checkin_logs")
      .select("qr_id, checkin_time")
      .gte("checkin_time", start)
      .lt("checkin_time", end)
      .order("checkin_time", { ascending: false });

    const guests = allGuests ?? [];
    const logs = todayLogs ?? [];

    const checkedQrIds = new Set(
      logs.map((log) => log.qr_id)
    );

    const checkedGuests = guests.filter((guest) =>
      checkedQrIds.has(guest.qr_id)
    );

    const notCheckedGuests = guests.filter(
      (guest) => !checkedQrIds.has(guest.qr_id)
    );

    const recentMerged =
      logs.slice(0, 10).map((log) => {
        const guest = guests.find(
          (g) => g.qr_id === log.qr_id
        );

        return {
          qr_id: log.qr_id,
          checkin_time: log.checkin_time,
          full_name: guest?.full_name ?? "Unknown",
        };
      });

    setTotalGuests(guests.length);
    setCheckedInToday(checkedGuests.length);
    setRecentLogs(recentMerged);
    setCheckedInByTamu(groupByTamu(checkedGuests));
    setNotCheckedInByTamu(groupByTamu(notCheckedGuests));

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold">
            Zahro & Mahen Wedding Dashboard
          </h1>

          <p className="text-blue-100 mt-2">
            Live guest attendance overview
          </p>
        </header>

        <section className="grid md:grid-cols-4 gap-6">
          <StatCard title="Total Guests" value={totalGuests} color="blue" />
          <StatCard title="Checked In Today" value={checkedInToday} color="green" />
          <StatCard title="Remaining" value={remainingGuests} color="yellow" />
          <StatCard title="Attendance" value={`${attendanceRate}%`} color="purple" />
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                Today's Attendance Progress
              </h2>

              <p className="text-gray-500">
                Updated automatically every 10 seconds
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Refresh
            </button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="bg-blue-600 h-6 rounded-full transition-all"
              style={{
                width: `${attendanceRate}%`,
              }}
            />
          </div>

          <p className="mt-3 text-gray-600">
            {checkedInToday} of {totalGuests} guests checked in
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <PieCard
            title="Checked In by Invited By"
            data={checkedInByTamu}
          />

          <PieCard
            title="Not Checked In by Invited By"
            data={notCheckedInByTamu}
          />
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Recent Check-ins Today
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading dashboard...</p>
          ) : recentLogs.length === 0 ? (
            <p className="text-gray-500">No guests checked in today.</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={`${log.qr_id}-${log.checkin_time}`}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">
                      {log.full_name}
                    </p>

                    <p className="text-sm text-gray-500">
                      QR ID: {log.qr_id}
                    </p>
                  </div>

                  <span className="text-gray-600">
                    {formatTime(log.checkin_time)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number | string;
  color: "blue" | "green" | "yellow" | "purple";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <p className="text-gray-500">
        {title}
      </p>

      <p
        className={`text-4xl font-bold mt-3 rounded-xl inline-block px-4 py-2 ${colors[color]}`}
      >
        {value}
      </p>
    </div>
  );
}

function PieCard({
  title,
  data,
}: {
  title: string;
  data: TamuChartData[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">
          No data available.
        </p>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}