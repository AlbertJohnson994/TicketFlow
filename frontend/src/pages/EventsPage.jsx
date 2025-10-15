import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    description: "",
    type: 1,
    date: "",
    startSales: "",
    endSales: "",
    price: 0,
    availableTickets: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/api/events`);
      setEvents(res.data);
    } catch (e) {
      console.error("Failed to fetch events:", e);
      setError(
        "Failed to load events. Make sure the backend server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createEvent(e) {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/events`, form);
      setForm({
        description: "",
        type: 1,
        date: "",
        startSales: "",
        endSales: "",
        price: 0,
        availableTickets: 100,
      });
      fetchEvents();
      setError("");
      alert("Event created successfully! 🎉");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  const eventTypes = [
    { id: 1, name: "Concert", emoji: "🎵" },
    { id: 2, name: "Theater", emoji: "🎭" },
    { id: 3, name: "Sports", emoji: "⚽" },
    { id: 4, name: "Conference", emoji: "📊" },
    { id: 5, name: "Workshop", emoji: "🔧" },
    { id: 6, name: "Festival", emoji: "🎪" },
  ];

  const getEventType = (typeId) => {
    return (
      eventTypes.find((t) => t.id === typeId) || { emoji: "🎭", name: "Show" }
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            🎭 Events Manager
          </h2>
          <p className="text-gray-600">
            Create and manage all your events in one place
          </p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
          {events.length} {events.length === 1 ? "Event" : "Events"}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Create Event Form */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-1 mb-8">
        <form onSubmit={createEvent} className="bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">✨</span> Create New Event
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Event Name
              </label>
              <input
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Enter event title or description"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Event Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: +e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              >
                {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.emoji} {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Event Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Ticket Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: +e.target.value })}
                  placeholder="0.00"
                  className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🟢 Sales Start Date
              </label>
              <input
                type="datetime-local"
                required
                value={form.startSales}
                onChange={(e) =>
                  setForm({ ...form, startSales: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔴 Sales End Date
              </label>
              <input
                type="datetime-local"
                required
                value={form.endSales}
                onChange={(e) => setForm({ ...form, endSales: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎫 Available Tickets
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.availableTickets}
                onChange={(e) =>
                  setForm({ ...form, availableTickets: +e.target.value })
                }
                placeholder="100"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-6 flex items-center">
            <span className="mr-2">✨</span> Create Event
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">📋</span> All Events
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-500">Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 text-sm font-medium">
                  <th className="p-4">Event</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Tickets</th>
                  <th className="p-4">Sales Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((ev) => {
                  const eventType = getEventType(ev.type);
                  return (
                    <tr key={ev.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="font-medium text-gray-800">
                          {ev.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                          <span className="mr-1">{eventType.emoji}</span>
                          {eventType.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700">
                          {new Date(ev.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(ev.date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">
                          R$ {ev.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-gray-700">
                            <span className="font-semibold">
                              {ev.soldTickets}
                            </span>{" "}
                            sold
                          </div>
                          <div className="text-gray-500">
                            <span className="font-semibold">
                              {ev.availableTickets}
                            </span>{" "}
                            available
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          <div>
                            Start:{" "}
                            {new Date(ev.startSales).toLocaleDateString()}
                          </div>
                          <div>
                            End: {new Date(ev.endSales).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-lg">No events created yet</p>
            <p className="text-sm">
              Create your first event using the form above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
