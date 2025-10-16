import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, cancelOrder } from "../redux/slice/orderSlice";
import { toast } from "react-toastify";
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Calendar, DollarSign, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const resultAction = await dispatch(cancelOrder(orderId));
      if (cancelOrder.fulfilled.match(resultAction)) {
        toast.success("Order cancelled successfully");
      } else {
        toast.error(resultAction.payload || "Failed to cancel order");
      }
    } catch (err) {
        console.log(err)
      toast.error("Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
      DELIVERED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock className="w-4 h-4" />,
      PROCESSING: <Package className="w-4 h-4" />,
      SHIPPED: <Truck className="w-4 h-4" />,
      DELIVERED: <CheckCircle className="w-4 h-4" />,
      CANCELLED: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const canCancelOrder = (status) => {
    return status === "PENDING" || status === "PROCESSING";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchOrders())}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <a
              href="/home"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-4 py-2 rounded-lg font-medium text-sm border flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)}
                        {order.order_status}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Payment:</span>
                      <span>{order.payment_method}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                        order.payment_status === 'PAID' 
                          ? 'bg-green-100 text-green-700' 
                          : order.payment_status === 'REFUNDED'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Contact:</span>
                      <span>{order.phone}</span>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    {expandedOrder === order.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        View Details
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        Shipping Address
                      </h4>
                      <p className="text-gray-700 pl-6">{order.shipping_address}</p>
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-600" />
                          Items ({order.items.length})
                        </h4>
                        <div className="space-y-2 pl-6">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.product?.name || item.product_name || `Product #${item.product}`}
                                </p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                ${parseFloat(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      {canCancelOrder(order.order_status) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all">
                        Need Help?
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;