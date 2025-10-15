// frontend/src/components/PaymentModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PaymentModal({ sale, isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [pixPayment, setPixPayment] = useState(null);
  const [pixStatus, setPixStatus] = useState("pending");

  // Credit/Debit Card Form State
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
    installments: 1,
  });

  // PIX Form State
  const [pixKey, setPixKey] = useState("");

  useEffect(() => {
    if (pixPayment && pixPayment.status === "pending") {
      // Auto-check PIX status every 10 seconds
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${API}/api/payments/pix/status/${pixPayment.id}`
          );
          setPixPayment(response.data.payment);
          setPixStatus(response.data.payment.status);

          if (response.data.payment.status === "completed") {
            clearInterval(interval);
            onSuccess(response.data.payment);
            setTimeout(() => onClose(), 2000);
          }
        } catch (error) {
          console.error("Error checking PIX status:", error);
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [pixPayment, onSuccess, onClose]);

  if (!isOpen) return null;

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = activeTab === "credit" ? "credit-card" : "debit-card";
      const response = await axios.post(`${API}/api/payments/${endpoint}`, {
        saleId: sale.id,
        cardData,
      });

      if (response.data.success) {
        onSuccess(response.data.payment);
        setTimeout(() => onClose(), 1500);
      } else {
        alert(`Payment failed: ${response.data.message}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePixGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/api/payments/pix/generate`, {
        saleId: sale.id,
        pixKey: pixKey || null,
      });

      setPixPayment(response.data.payment);
      setPixStatus("pending");
    } catch (error) {
      alert(error.response?.data?.message || "PIX generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardData({ ...cardData, cardNumber: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.replace(/(\d{2})(?=\d)/, "$1/");
    }
    setCardData({ ...cardData, cardExpiry: value });
  };

  const resetForm = () => {
    setCardData({
      cardNumber: "",
      cardHolder: "",
      cardExpiry: "",
      cardCvv: "",
      installments: 1,
    });
    setPixKey("");
    setPixPayment(null);
    setPixStatus("pending");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Complete Payment
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="mt-2">
            <p className="text-gray-600">
              Event:{" "}
              <span className="font-semibold">{sale.event?.description}</span>
            </p>
            <p className="text-gray-600">
              Total:{" "}
              <span className="font-bold text-green-600 text-lg">
                R$ {sale.totalAmount?.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "credit"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("credit");
                resetForm();
              }}
            >
              💳 Credit Card
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "debit"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("debit");
                resetForm();
              }}
            >
              💳 Debit Card
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "pix"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("pix");
                resetForm();
              }}
            >
              📱 PIX
            </button>
          </div>
        </div>

        {/* Payment Content */}
        <div className="p-6">
          {/* Credit/Debit Card Forms */}
          {(activeTab === "credit" || activeTab === "debit") && (
            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  placeholder="JOAO DA SILVA"
                  value={cardData.cardHolder}
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      cardHolder: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.cardExpiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardData.cardCvv}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cardCvv: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    maxLength={4}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>
              </div>

              {activeTab === "credit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installments
                  </label>
                  <select
                    value={cardData.installments}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        installments: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num}x{" "}
                        {num === 1
                          ? "à vista"
                          : `de R$ ${(sale.totalAmount / num).toFixed(2)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  `Pay R$ ${sale.totalAmount?.toFixed(2)} with ${activeTab === "credit" ? "Credit Card" : "Debit Card"}`
                )}
              </button>
            </form>
          )}

          {/* PIX Form */}
          {activeTab === "pix" && (
            <div>
              {!pixPayment ? (
                <form onSubmit={handlePixGenerate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIX Key (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="CPF, CNPJ, Email, Phone, or leave blank for random key"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to generate a random PIX key
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      "Generate PIX QR Code"
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Scan the QR Code
                    </h3>
                    <img
                      src={pixPayment.pixQrCode}
                      alt="PIX QR Code"
                      className="mx-auto w-48 h-48 border-2 border-gray-300 rounded-lg"
                    />
                  </div>

                  <div
                    className={`p-3 rounded-xl ${
                      pixStatus === "completed"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : pixStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    <p className="font-medium">
                      {pixStatus === "completed"
                        ? "✅ Payment Confirmed!"
                        : pixStatus === "pending"
                          ? "⏳ Waiting for payment..."
                          : "❌ Payment Failed"}
                    </p>
                    {pixStatus === "pending" && (
                      <p className="text-sm mt-1">
                        Expires at:{" "}
                        {new Date(
                          pixPayment.pixExpiration
                        ).toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm bg-blue-50 p-3 rounded-xl">
                    <p>
                      <strong>Transaction ID:</strong>{" "}
                      {pixPayment.transactionId}
                    </p>
                    <p>
                      <strong>Amount:</strong> R$ {pixPayment.amount.toFixed(2)}
                    </p>
                    {pixPayment.pixKey && (
                      <p>
                        <strong>PIX Key:</strong> {pixPayment.pixKey}
                      </p>
                    )}
                  </div>

                  {pixStatus === "pending" && (
                    <p className="text-xs text-gray-500">
                      Status will update automatically. Keep this window open.
                    </p>
                  )}

                  {pixStatus === "completed" && (
                    <button
                      onClick={handleClose}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
