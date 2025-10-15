import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function SeederPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    checkBackendStatus();
  }, []);

  async function checkBackendStatus() {
    try {
      await axios.get(`${API}/health`, { timeout: 5000 });
      setBackendStatus("connected");
    } catch (error) {
      setBackendStatus("disconnected");
    }
  }

  async function runSeed() {
    if (backendStatus !== "connected") {
      setMessage("❌ Cannot seed: Backend server is not connected.");
      return;
    }

    try {
      setLoading(true);
      setMessage("🌱 Seeding database with sample data...");

      const response = await axios.post(`${API}/api/seed`);

      if (response.data.success) {
        setMessage("✅ " + response.data.message);
      } else {
        setMessage("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Seed error:", error);
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes("ECONNREFUSED")) {
        setMessage(
          "❌ Cannot connect to backend server. Please ensure it's running on " +
            API
        );
      } else {
        setMessage("❌ Failed to seed database: " + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  const isActionDisabled = loading || backendStatus !== "connected";

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              🌱 Database Seeder
            </h2>
            <p className="text-gray-600">
              Professional database management and sample data generation
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              backendStatus === "connected"
                ? "bg-green-100 text-green-800 border border-green-200"
                : backendStatus === "checking"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {backendStatus === "connected"
              ? "✅ Backend Connected"
              : backendStatus === "checking"
                ? "⏳ Checking Connection..."
                : "❌ Backend Disconnected"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔌</span> System Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Backend API:</span>
                <span
                  className={`font-medium ${
                    backendStatus === "connected"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {backendStatus === "connected" ? "Online" : "Offline"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Environment:</span>
                <span className="font-medium text-blue-600">Development</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center">
              <span className="mr-2">⚡</span> Quick Actions
            </h3>
            <div className="text-blue-700 text-sm">
              <p className="mb-2">
                <strong>Development Tools:</strong>
              </p>
              <div className="bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-xs">
                <div># Check backend health</div>
                <div className="text-gray-400">GET {API}/health</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mr-4">
              🌱
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Add Sample Data
              </h3>
              <p className="text-sm text-gray-600">Non-destructive operation</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            Safely adds sample events and sales data to your existing database.
            Perfect for testing features without affecting current data. Creates
            realistic sample data including events, sales, and customer records.
          </p>
          <button
            onClick={runSeed}
            disabled={isActionDisabled}
            className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Seeding Database...
              </>
            ) : (
              <>
                <span className="mr-2">🌱</span>
                Seed Database
              </>
            )}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl mb-6 border-2 ${
              message.includes("✅")
                ? "bg-green-50 text-green-800 border-green-200"
                : message.includes("❌")
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-yellow-50 text-yellow-800 border-yellow-200"
            }`}
          >
            <div className="flex items-start">
              <span className="text-lg mr-3 mt-0.5">
                {message.includes("✅") ? "✅" : "❌"}
              </span>
              <div>
                <p className="font-medium">{message}</p>
                {message.includes("disconnected") && (
                  <p className="text-sm mt-1 opacity-80">
                    Ensure your backend is running on{" "}
                    <code className="bg-gray-100 px-1 rounded">{API}</code>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-800 mb-3 flex items-center">
            <span className="mr-2">💡</span> Professional Usage Guidelines
          </h3>
          <div className="text-yellow-700 text-sm space-y-3">
            <div>
              <strong className="block mb-1">Sample Data Includes:</strong>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Multiple event categories (Concerts, Theater, Sports,
                  Workshops)
                </li>
                <li>Realistic sales data with different payment methods</li>
                <li>Customer records with UUID identifiers</li>
                <li>Proper event-sales relationships and foreign keys</li>
                <li>Updated ticket availability and revenue calculations</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <strong>🎯 Use Cases:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Development & Testing</li>
                  <li>Demo Presentations</li>
                  <li>Feature Validation</li>
                </ul>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <strong>🚫 Production Warning:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Never use in production</li>
                  <li>Backup data first</li>
                  <li>Test in isolated environments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
