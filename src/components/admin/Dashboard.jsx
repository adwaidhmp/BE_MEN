import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ffbb28"];

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const getToday = () => new Date().toLocaleDateString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:3001/users");
        const allUsers = userRes.data;
        const totuser = allUsers.filter((u) => u.role !== "admin");
        setUsers(totuser);

        const allOrders = allUsers.flatMap((user) =>
          (user.order || []).map((o) => ({
            ...o,
            userId: user.id,
          }))
        );
        setOrders(allOrders);

        const productRes = await axios.get("http://localhost:3001/products");
        setProducts(productRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, []);

  const today = getToday();
  const todayOrders = orders.filter(
    (order) => new Date(order.date).toLocaleDateString() === today
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (parseFloat(order.price) || 0), 0);

  const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.price) || 0), 0);

  //  Monthly Income Chart Data
  const incomeByMonth = {};
  orders.forEach((order) => {
    const dateObj = new Date(order.date);
    const key = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
    incomeByMonth[key] = (incomeByMonth[key] || 0) + (parseFloat(order.price) || 0);
  });

  const incomeChartData = Object.entries(incomeByMonth).map(([month, income]) => ({
    month,
    income,
  }));

  //  Donut chart - Product saled by Category Count
  const categoryCount = {};
  orders.forEach((order) => {
    if (order.category) {
      categoryCount[order.category] = (categoryCount[order.category] || 0) + (order.quantity || 1);
    }
  });

  const donutData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));

    //  Daily Income Bar Chart Data
  const incomeByDay = {};
  orders.forEach((order) => {
    const key = new Date(order.date).toLocaleDateString();
    incomeByDay[key] = (incomeByDay[key] || 0) + (parseFloat(order.price) || 0);
  });

  const dailyChartData = Object.entries(incomeByDay).map(([day, income]) => ({
    day,
    income,
  }));
  
  return (
    <div className="container">
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-4">Welcome, Admin</h2>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow p-6 rounded-lg text-green-600">
            <h3 className="text-xl font-semibold">Revenue Today</h3>
            <p className="text-3xl font-bold mt-2">${todayRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Orders Today</h3>
            <p className="text-3xl font-bold mt-2">{todayOrders.length}</p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg text-red-600">
            <h3 className="text-xl font-semibold">Orders Pending</h3>
            <p className="text-3xl font-bold mt-2">
              {orders.filter((o) => o.status !== "delivered").length}
            </p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg text-green-600">
            <h3 className="text-xl font-semibold">Orders Delivered</h3>
            <p className="text-3xl font-bold mt-2">
              {orders.filter((o) => o.status === "delivered").length}
            </p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-3xl font-bold mt-2">{users.length}</p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold mt-2">{orders.length}</p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold">Total Products</h3>
            <p className="text-3xl font-bold mt-2">{products.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Income Line Chart */}
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Monthly Income Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={incomeChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Product Sales by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  fill="#8884d8"
                  label
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Revenue Chart */}
          <div className="bg-white shadow p-6 rounded-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Daily Revenue</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyChartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
