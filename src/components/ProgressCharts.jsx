import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const toISODate = (date) => new Date(date).toLocaleDateString("en-CA");

// ✅ Calculate last 7 days only once
const last7Days = (() => {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: toISODate(d),
    });
  }
  return days;
})();

const ProgressCharts = () => {
  const { user } = useSelector((state) => state.auth);
  const [weeklyData, setWeeklyData] = useState(Array(7).fill(0));
  const [loading, setLoading] = useState(true);

  // ✅ Fetch habits progress
  useEffect(() => {
    if (!user?.uid) {
      setWeeklyData(Array(7).fill(0));
      setLoading(false);
      return;
    }

    const habitsRef = ref(db, `users/${user.uid}/habits`);

    const unsubscribe = onValue(habitsRef, (snapshot) => {
      const counts = Array(7).fill(0);

      if (snapshot.exists()) {
        const data = snapshot.val();

        Object.values(data).forEach((habit) => {
          if (habit.history) {
            Object.entries(habit.history).forEach(([date, completed]) => {
              if (completed) {
                const dayIndex = last7Days.findIndex((d) => d.date === date);
                if (dayIndex !== -1) counts[dayIndex] += 1;
              }
            });
          }
        });
      }

      setWeeklyData(counts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // ✅ Memoized chart data
  const chartData = useMemo(
    () => ({
      labels: last7Days.map((d) => d.label),
      datasets: [
        {
          label: "Habits Completed",
          data: weeklyData,
          borderColor: "rgba(236, 72, 153, 1)", // neon pink
          backgroundColor: "rgba(236, 72, 153, 0.2)", // soft glow
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(236, 72, 153, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    }),
    [weeklyData]
  );

  // ✅ Memoized options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#e5e7eb",
            font: { size: 14 },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#a78bfa", font: { size: 13 } },
          grid: { color: "rgba(167, 139, 250, 0.1)" },
        },
        y: {
          ticks: { color: "#f9a8d4", font: { size: 13 } },
          grid: { color: "rgba(236, 72, 153, 0.1)" },
        },
      },
    }),
    []
  );

  return (
    <section className="my-8 mx-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
        📈 This Week’s Progress
      </h2>

      <div
        className="relative bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a003f]/90 
                   border border-violet-500/30 backdrop-blur-xl 
                   rounded-2xl p-3 md:p-6 shadow-lg 
                   h-56 sm:h-64 md:h-80 lg:h-96"
      >
        {/* Glow layer */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r 
                        from-indigo-500/10 via-purple-500/10 to-pink-500/10 
                        blur-2xl opacity-60" />

        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            Loading progress...
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </section>
  );
};

export default ProgressCharts;
