import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    paidSales: 0,
    salesByStatus: {},
  });
  const [recentSales, setRecentSales] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [eventsRes, salesRes, eventsStatsRes, salesStatsRes] =
        await Promise.all([
          axios.get(`${API}/api/events`),
          axios.get(`${API}/api/sales`),
          axios.get(`${API}/api/events/stats`),
          axios.get(`${API}/api/sales/stats`),
        ]);

      const events = eventsRes.data;
      const sales = salesRes.data;

      setStats(eventsStatsRes.data);
      setSalesStats(salesStatsRes.data);
      setRecentSales(sales.slice(0, 5));
      setUpcomingEvents(
        events.filter((event) => new Date(event.date) > new Date()).slice(0, 3)
      );
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
      setError(
        "Failed to load dashboard data. Make sure the backend server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  }

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div
      className={`stat-card ${color} transform hover:scale-105 transition-transform duration-200`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs opacity-80 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl opacity-90">{icon}</div>
      </div>
    </div>
  );

  const salesChartData = {
    labels: Object.keys(salesStats.salesByStatus || {}),
    datasets: [
      {
        data: Object.values(salesStats.salesByStatus || {}),
        backgroundColor: [
          "#f59e0b", // pending - amber
          "#22c55e", // paid - green
          "#ef4444", // cancelled - red
          "#6b7280", // refunded - gray
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const revenueChartData = {
    labels: ["Events", "Tickets", "Revenue"],
    datasets: [
      {
        label: "Performance Metrics",
        data: [
          stats.totalEvents,
          stats.totalTicketsSold,
          stats.totalRevenue / 100,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(34, 197, 94)",
          "rgb(245, 158, 11)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon="🎭"
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle={`${stats.upcomingEvents} upcoming`}
        />
        <StatCard
          title="Tickets Sold"
          value={stats.totalTicketsSold}
          icon="🎫"
          color="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="All time"
        />
        <StatCard
          title="Total Revenue"
          value={`R$ ${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="From paid sales"
        />
        <StatCard
          title="Total Sales"
          value={salesStats.totalSales}
          icon="📈"
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle={`${salesStats.paidSales} paid`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span> Sales Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🚀</span> Performance Metrics
          </h3>
          <div className="h-64">
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔄</span> Recent Sales
          </h3>
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        sale.saleStatus === "paid"
                          ? "bg-green-500"
                          : sale.saleStatus === "pending"
                            ? "bg-yellow-500"
                            : sale.saleStatus === "cancelled"
                              ? "bg-red-500"
                              : "bg-gray-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {sale.event?.description || "Event"}
                      </p>
                      <p className="text-sm text-gray-600">
                        User: {sale.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      R$ {sale.totalAmount?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {sale.saleStatus}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💸</div>
                <p>No recent sales</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⏳</span> Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {event.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} •{" "}
                      {new Date(event.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">
                      R$ {event.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.availableTickets} tickets left
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📅</div>
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
