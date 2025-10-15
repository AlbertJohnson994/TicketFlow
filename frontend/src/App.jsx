import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import SalesPage from "./pages/SalesPage";
import SeederPage from "./pages/SeederPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-primary-600 to-primary-800 shadow-xl flex flex-col">
          <div className="p-6 border-b border-primary-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-primary-800 font-bold text-xl">
                🎟️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TicketFlow</h1>
                <p className="text-primary-200 text-sm">Sales Management</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col mt-6 space-y-2 px-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-primary-600 shadow-lg"
                    : "text-primary-100 hover:bg-primary-500 hover:text-white"
                }`
              }
            >
              <span className="mr-3 text-lg">📊</span>
              Dashboard
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-primary-600 shadow-lg"
                    : "text-primary-100 hover:bg-primary-500 hover:text-white"
                }`
              }
            >
              <span className="mr-3 text-lg">🎭</span>
              Events Manager
            </NavLink>
            <NavLink
              to="/sales"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-primary-600 shadow-lg"
                    : "text-primary-100 hover:bg-primary-500 hover:text-white"
                }`
              }
            >
              <span className="mr-3 text-lg">💰</span>
              Sales Center
            </NavLink>
            <NavLink
              to="/seeder"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-primary-600 shadow-lg"
                    : "text-primary-100 hover:bg-primary-500 hover:text-white"
                }`
              }
            >
              <span className="mr-3 text-lg">🌱</span>
              Database Seeder
            </NavLink>
          </nav>

          {/* Stats Summary */}
          <div className="mt-8 mx-3 p-4 bg-primary-500/30 rounded-xl border border-primary-400/30">
            <p className="text-primary-100 text-sm font-medium">Quick Stats</p>
            <div className="flex justify-between mt-2 text-xs">
              <div className="text-center">
                <p className="text-white font-bold">12+</p>
                <p className="text-primary-200">Events</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">50+</p>
                <p className="text-primary-200">Sales</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold">R$ 5k+</p>
                <p className="text-primary-200">Revenue</p>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-primary-500 text-xs text-primary-300">
            © {new Date().getFullYear()} TicketFlow v2.0
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/seeder" element={<SeederPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
