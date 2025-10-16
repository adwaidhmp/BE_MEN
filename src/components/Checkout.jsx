import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, fetchOrders } from "../components/redux/slice/orderSlice";
import { toast } from "react-toastify";
import { CreditCard, Banknote, Package, MapPin, Phone, ShoppingBag, Lock } from "lucide-react";
import api from "../components/api"

function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.order);

    const { items } = location.state || { items: [] };

    console.log(items);


    const [form, setForm] = useState({
        shipping_address: "",
        phone: "",
        payment_method: "COD",
    });
    const [processing, setProcessing] = useState(false);

    const total = items.reduce((sum, i) => sum + (i.product?.price || i.price || 0) * i.quantity, 0);

    // ------------------ Razorpay Integration ------------------
    // ------------------ Razorpay Integration ------------------
    const openRazorpay = (razorpayData) => {
        const options = {
            key: razorpayData.razorpay_key,
            amount: razorpayData.amount,
            currency: razorpayData.currency,
            name: "Your Store",
            description: "Order Payment",
            order_id: razorpayData.razorpay_order_id,
            handler: async function (response) {
                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                try {
                    // Verify payment on backend
                    await api.post("/razorpay/verify/", {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature,
                    });

                    toast.success("Payment successful!");
                    dispatch(fetchOrders());
                    navigate("/order-success", { state: { order: razorpayData } });
                } catch (err) {
                    console.error(err);
                    toast.error("Payment verification failed. Order was not completed.");
                }
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: form.phone,
            },
            theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // ------------------ Load Razorpay Script ------------------
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true); // already loaded

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };


    // ------------------ Checkout Handler ------------------
    const handleCheckout = async () => {
        if (!form.shipping_address || !form.phone) {
            toast.error("Please fill all details");
            return;
        }

        setProcessing(true);

        try {
            // ------------------ Load Razorpay script if needed ------------------
            if (form.payment_method === "RAZORPAY") {
                const res = await loadRazorpayScript();
                if (!res) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    setProcessing(false);
                    return; // stop checkout if script fails
                }
            }
            // -------------------------------------------------------------------

            // Build payload matching your backend
            const payload = {
                items,
                shipping_address: form.shipping_address,
                phone: form.phone,
                payment_method: form.payment_method,
            };

            const resultAction = await dispatch(placeOrder(payload));

            if (placeOrder.fulfilled.match(resultAction)) {
                const orderData = resultAction.payload;

                if (form.payment_method === "COD") {
                    toast.success("Order placed successfully!");
                    dispatch(fetchOrders());
                    navigate("/order-success", { state: { order: orderData } });
                } else if (form.payment_method === "RAZORPAY") {
                    // Open Razorpay window
                    openRazorpay({
                        razorpay_order_id: orderData.razorpay_order_id,
                        razorpay_key: orderData.razorpay_key,
                        amount: orderData.amount,
                        currency: orderData.currency,
                    });
                }
            } else {
                toast.error(resultAction.payload || "Checkout failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Checkout failed");
        } finally {
            setProcessing(false);
        }
    };


    // ------------------ JSX remains unchanged ------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                                    <textarea
                                        name="shipping_address"
                                        value={form.shipping_address}
                                        onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                                        placeholder="Enter your complete address with pincode"
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Phone Number
                                        </div>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                            </div>

                            <div className="space-y-3">
                                <label
                                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${form.payment_method === "COD"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="COD"
                                        checked={form.payment_method === "COD"}
                                        onChange={e => setForm({ ...form, payment_method: e.target.value })}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Banknote className="w-6 h-6 text-gray-600" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">Cash on Delivery</div>
                                        <div className="text-sm text-gray-500">Pay when you receive your order</div>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${form.payment_method === "RAZORPAY"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="RAZORPAY"
                                        checked={form.payment_method === "RAZORPAY"}
                                        onChange={e => setForm({ ...form, payment_method: e.target.value })}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <CreditCard className="w-6 h-6 text-gray-600" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">Online Payment</div>
                                        <div className="text-sm text-gray-500">UPI, Cards, Net Banking</div>
                                    </div>
                                </label>
                            </div>

                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                                <Lock className="w-4 h-4" />
                                <span>Your payment information is secure and encrypted</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                            <div className="flex items-center gap-2 mb-6">
                                <Package className="w-5 h-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                {items.map((i, idx) => (
                                    <div
                                        key={i.product?.id || i.id || idx}
                                        className="flex justify-between items-start pb-4 border-b border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            {(i.product?.image || i.product?.product_image || i.image) && (
                                                <img
                                                    src={
                                                        Array.isArray(i.product?.image)
                                                            ? i.product.image[0]
                                                            : i.product?.image ||
                                                            i.product?.product_image ||
                                                            (Array.isArray(i.image) ? i.image[0] : i.image)
                                                    }
                                                    alt={i.product?.name || i.name}
                                                    className="w-16 h-16 rounded-lg object-cover border"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{i.product?.name || i.name}</p>
                                                <p className="text-sm text-gray-500">{i.product?.brand}</p>
                                                <p className="text-sm text-gray-500">Qty: {i.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ₹{((i.product?.price || i.price || 0) * i.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-blue-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={processing || loading || !form.shipping_address || !form.phone || items.length === 0}
                                className={`w-full mt-6 py-4 rounded-lg font-semibold text-white transition-all transform ${processing || loading || !form.shipping_address || !form.phone || items.length === 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95"
                                    }`}
                            >
                                {processing || loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    "Complete Order"
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By completing this order, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
