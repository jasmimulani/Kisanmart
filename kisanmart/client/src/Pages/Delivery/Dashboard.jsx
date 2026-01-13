import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { FiPackage, FiCheckCircle, FiClock, FiDollarSign } from "react-icons/fi";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { deliveryProfile, axios, currency } = useAppContext();

  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalEarnings: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Fetch orders (same API as Orders page)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/seller");

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      const orders = data.orders || [];

      // 🔹 Sort by latest & take last 10
      const latestOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      setRecentOrders(latestOrders);

      // 🔹 Calculate stats
      let pending = 0;
      let inProgress = 0;
      let completed = 0;
      let earnings = 0;

      orders.forEach((order) => {
        if (order.status === "pending") pending++;
        if (order.status === "accepted") inProgress++;
        if (order.status === "completed") {
          completed++;
          earnings += order.amount || 0;
        }
      });

      setStats({
        pending,
        inProgress,
        completed,
        totalEarnings: earnings,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // auto refresh every 5 sec (same as orders page)
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">
        Welcome, {deliveryProfile?.name || "Delivery Partner"}
      </h2>

      {/* 🔹 STATS */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending" value={stats.pending} icon={<FiPackage />} />
        <StatCard title="In Progress" value={stats.inProgress} icon={<FiClock />} />
        <StatCard title="Completed" value={stats.completed} icon={<FiCheckCircle />} />
        <StatCard
          title="Earnings"
          value={`${currency}${stats.totalEarnings}`}      
        />
      </div> */}

      {/* 🔹 RECENT 10 ORDERS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Orders (Last 10)</h3>

        {recentOrders.length === 0 && (
          <p className="text-gray-500">No orders found</p>
        )}

        {recentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Order ID: {order._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-600">
                {order.items?.length || 0} items
              </p>
              <p className="text-sm">
                Status:{" "}
                <span className="font-medium capitalize">
                  {order.status}
                </span>
              </p>
              <p className="text-sm">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">
                {currency}{order.amount}
              </p>
              <p className="text-sm text-gray-500">
                {order.paymentType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded shadow flex items-center gap-4">
    <div className="text-2xl text-primary">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
