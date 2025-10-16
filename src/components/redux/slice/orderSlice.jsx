// redux/slice/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// --------------------- Thunks ---------------------

// Fetch all user orders
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/my-orders/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Place order (single or multiple)
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ items, shipping_address, phone, payment_method }, { rejectWithValue }) => {
    try {
      // Payload format expected by backend
      const payload = {
        orders: items.map((i) => ({
          product: i.product?.id || i.id,
          quantity: i.quantity,
          shipping_address,
          phone,
          payment_method,
        })),
      };

      const res = await api.post("/checkout/", payload);
      return res.data; // Contains orders and Razorpay info if applicable
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/my-orders/${orderId}/`);
      return { orderId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --------------------- Slice ---------------------

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    lastOrder: null,      // store last placed order (needed for checkout page)
    razorpayInfo: null,   // store Razorpay order info if payment method is RAZORPAY
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.lastOrder = null;
      state.razorpayInfo = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- fetchOrders ----------
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- placeOrder ----------
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        // Store last order for redirect/checkout page
        state.lastOrder = data;

        // If Razorpay, store its info
        if (data.razorpay_order_id) {
          state.razorpayInfo = {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_key: data.razorpay_key,
            amount: data.amount,
            currency: data.currency,
          };
        } else {
          state.razorpayInfo = null;
        }

        // Optionally add orders to state.orders
        state.orders.push(...(data.orders || []));
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- cancelOrder ----------
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId } = action.payload;
        state.orders = state.orders.map((o) =>
          o.id === orderId ? { ...o, order_status: "CANCELLED", payment_status: "REFUNDED" } : o
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
