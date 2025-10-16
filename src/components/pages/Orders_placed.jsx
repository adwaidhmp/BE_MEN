import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package, Truck, Home, ArrowRight } from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-16">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <CheckCircle className="w-24 h-24 text-green-500 animate-[bounce_1s_ease-in-out]" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                </div>
                <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {order.order_status || "PENDING"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="font-semibold text-gray-900">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-900">{order.payment_method || "COD"}</p>
                </div>
                {order.total_amount && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-gray-900">${order.total_amount}</p>
                  </div>
                )}
                {order.phone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact</p>
                    <p className="font-semibold text-gray-900">{order.phone}</p>
                  </div>
                )}
              </div>

              {order.shipping_address && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                  <p className="text-gray-900">{order.shipping_address}</p>
                </div>
              )}
            </div>
          )}

          {/* What's Next */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              What's Next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700">We'll send you a confirmation email with your order details</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700">Your order will be processed and prepared for shipping</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700">Track your order status from your account dashboard</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <Package className="w-5 h-5" />
              View My Orders
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Auto Redirect Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-600">
              Redirecting to home in <span className="font-bold text-green-600">{countdown}</span> seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;