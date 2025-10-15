// frontend/src/pages/SalesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentModal from "../components/paymentModal";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    event_id: "",
    saleStatus: "pending",
    quantity: 1,
    paymentMethod: "credit_card",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchSales();
    fetchEvents();
    fetchPayments();
  }, []);

  async function fetchSales() {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/api/sales`);
      setSales(res.data);
    } catch (e) {
      console.error("Failed to fetch sales:", e);
      setError(
        "Failed to load sales data. Make sure the backend server is running on port 4000."
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchEvents() {
    try {
      const res = await axios.get(`${API}/api/events`);
      setEvents(res.data);
    } catch (e) {
      console.error("Failed to fetch events:", e);
    }
  }

  async function fetchPayments() {
    try {
      const res = await axios.get(`${API}/api/payments`);
      setPayments(res.data);
    } catch (e) {
      console.error("Failed to fetch payments:", e);
    }
  }

  const handleCreateSale = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/api/sales`, form);
      const newSale = response.data;

      setSales([newSale, ...sales]);
      setForm({
        user_id: "",
        event_id: "",
        saleStatus: "pending",
        quantity: 1,
        paymentMethod: "credit_card",
      });

      setError("");

      // If sale is created as pending, show payment modal
      if (newSale.saleStatus === "pending") {
        setSelectedSale(newSale);
        setShowPaymentModal(true);
      } else {
        alert("Sale registered successfully! 🎉");
      }

      // Refresh payments list
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handlePaymentSuccess = (payment) => {
    // Update the sale in the list
    setSales(
      sales.map((sale) =>
        sale.id === selectedSale.id ? { ...sale, saleStatus: "paid" } : sale
      )
    );

    // Add to payments list
    setPayments([payment, ...payments]);

    alert(
      `Payment completed successfully! Transaction: ${payment.transactionId}`
    );
  };

  const handleProcessPayment = (sale) => {
    if (sale.saleStatus === "pending") {
      setSelectedSale(sale);
      setShowPaymentModal(true);
    } else {
      alert("This sale is already paid or has been processed.");
    }
  };

  const handleRefund = async (saleId) => {
    if (
      !window.confirm(
        "Are you sure you want to refund this sale? This action cannot be undone."
      )
    )
      return;

    try {
      // Find the payment associated with this sale
      const paymentResponse = await axios.get(
        `${API}/api/payments/sale/${saleId}`
      );
      const payment = paymentResponse.data;

      if (!payment) {
        alert("No payment found for this sale.");
        return;
      }

      if (payment.status !== "completed") {
        alert("Only completed payments can be refunded.");
        return;
      }

      const refundResponse = await axios.post(
        `${API}/api/payments/refund/${payment.id}`
      );

      // Update sales and payments lists
      setSales(
        sales.map((sale) =>
          sale.id === saleId ? { ...sale, saleStatus: "refunded" } : sale
        )
      );

      setPayments(
        payments.map((p) =>
          p.id === payment.id ? refundResponse.data.payment : p
        )
      );

      alert("Refund processed successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Refund failed");
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this sale? This action cannot be undone."
      )
    )
      return;

    try {
      await axios.delete(`${API}/api/sales/${saleId}`);
      setSales(sales.filter((sale) => sale.id !== saleId));
      alert("Sale deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      emoji: "⏳",
    },
    paid: { label: "Paid", color: "bg-green-100 text-green-800", emoji: "✅" },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      emoji: "❌",
    },
    refunded: {
      label: "Refunded",
      color: "bg-orange-100 text-orange-800",
      emoji: "↩️",
    },
  };

  const paymentMethodConfig = {
    credit_card: "💳 Credit Card",
    debit_card: "💳 Debit Card",
    pix: "📱 PIX",
    cash: "💵 Cash",
  };

  const totalRevenue = sales
    .filter((s) => s.saleStatus === "paid")
    .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">💰 Sales Center</h2>
          <p className="text-gray-600">Manage ticket sales and track revenue</p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          Total Revenue: R$ {totalRevenue.toFixed(2)}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Register Sale Form */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-1 mb-8">
        <form onSubmit={handleCreateSale} className="bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="mr-2">🎫</span> Register New Sale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Customer ID
              </label>
              <input
                required
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                placeholder="Enter customer identifier"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎭 Select Event
              </label>
              <select
                required
                value={form.event_id}
                onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              >
                <option value="">Choose an event...</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.description} - R$ {ev.price.toFixed(2)} (
                    {ev.availableTickets} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔢 Quantity
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: +e.target.value })
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💳 Payment Method
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm({ ...form, paymentMethod: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              >
                {Object.entries(paymentMethodConfig).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Sale Status
              </label>
              <select
                value={form.saleStatus}
                onChange={(e) =>
                  setForm({ ...form, saleStatus: e.target.value })
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              >
                {Object.entries(statusConfig).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.emoji} {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-success mt-6 flex items-center">
            <span className="mr-2">💾</span> Register Sale
          </button>
        </form>
      </div>

      {/* Sales History */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">📈</span> Sales History
          </h3>
          <div className="text-sm text-gray-500">
            {sales.filter((s) => s.saleStatus === "paid").length} completed
            sales
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="mt-2 text-gray-500">Loading sales data...</p>
          </div>
        ) : sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 text-sm font-medium">
                  <th className="p-4">Sale ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.map((s) => {
                  const status =
                    statusConfig[s.saleStatus] || statusConfig.pending;
                  const payment = payments.find((p) => p.sale_id === s.id);

                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-sm text-gray-500">
                        #{s.id.slice(0, 8)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">
                          {s.user_id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          {s.event?.description || s.event_id}
                        </div>
                        {s.event && (
                          <div className="text-sm text-gray-500">
                            {new Date(s.event.date).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-blue-600">
                          {s.quantity} ticket{s.quantity !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">
                          R$ {s.totalAmount?.toFixed(2) || "0.00"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${status.color}`}
                        >
                          <span className="mr-1">{status.emoji}</span>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {paymentMethodConfig[s.paymentMethod] ||
                            s.paymentMethod}
                        </span>
                        {payment && (
                          <div className="text-xs text-gray-400">
                            {payment.transactionId}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-500">
                          {s.saleDate
                            ? new Date(s.saleDate).toLocaleDateString()
                            : "—"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {s.saleStatus === "pending" && (
                            <button
                              onClick={() => handleProcessPayment(s)}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Pay
                            </button>
                          )}
                          {s.saleStatus === "paid" && (
                            <button
                              onClick={() => handleRefund(s.id)}
                              className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors"
                            >
                              Refund
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSale(s.id)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
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
            <div className="text-6xl mb-4">💰</div>
            <p className="text-lg">No sales recorded yet</p>
            <p className="text-sm">
              Register your first sale using the form above!
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedSale && (
        <PaymentModal
          sale={selectedSale}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedSale(null);
            fetchSales(); // Refresh sales data
            fetchPayments(); // Refresh payments data
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
