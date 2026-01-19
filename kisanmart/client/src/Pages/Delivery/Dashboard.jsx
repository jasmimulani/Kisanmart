import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import { FiPackage, FiCheckCircle, FiClock, FiTrendingUp, FiCalendar, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { deliveryProfile, axios, currency } = useAppContext();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalEarnings: 0,
    totalOrders: 0,
    todayOrders: 0,
    thisWeekOrders: 0,
    thisMonthOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/delivery/stats");
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/delivery/orders");

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      const orders = data.orders || [];

      // Sort by latest & take last 10
      const latestOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      setRecentOrders(latestOrders);

      // Prepare chart data (last 7 days)
      const last7Days = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === date.toDateString();
        });

        last7Days.push({
          date: dateStr,
          orders: dayOrders.length,
          completed: dayOrders.filter(o => o.status === 'Delivered' || o.status === 'completed').length,
        });
      }

      setChartData(last7Days);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOrders();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {deliveryProfile?.name || "Delivery Partner"} 
          </h2>
          <p className="text-gray-600 mt-1">Here's your delivery overview</p>
        </div>
        <button
          onClick={() => navigate("/delivery/orders")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          View All Orders
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Pending Orders" 
          value={stats.pending} 
          icon={<FiPackage className="w-6 h-6" />}
          color="bg-yellow-100 text-yellow-600"
          iconBg="bg-yellow-500"
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={<FiClock className="w-6 h-6" />}
          color="bg-blue-100 text-blue-600"
          iconBg="bg-blue-500"
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={<FiCheckCircle className="w-6 h-6" />}
          color="bg-green-100 text-green-600"
          iconBg="bg-green-500"
        />
        <StatCard 
          title="Total Earnings" 
          value={`${currency}${stats.totalEarnings.toFixed(2)}`}
          icon={<FiTrendingUp className="w-6 h-6" />}
          color="bg-purple-100 text-purple-600"
          iconBg="bg-purple-500"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-800">{stats.todayOrders}</p>
            </div>
            <FiCalendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-800">{stats.thisWeekOrders}</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-800">{stats.thisMonthOrders}</p>
            </div>
            <FiMapPin className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Orders Overview (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Total Orders" />
                <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" name="Total Orders" />
                <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Orders</h3>
          <button
            onClick={() => navigate("/delivery/orders")}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            View All →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const totalAmount = order.items?.reduce((sum, item) => {
                const price = item.product?.offerprice ?? item.product?.price ?? 0;
                return sum + price * item.quantity;
              }, 0) || order.amount || 0;

              return (
                <div
                  key={order._id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors cursor-pointer"
                  onClick={() => navigate("/delivery/orders")}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-800">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' || order.status === 'completed' 
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Out for delivery'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>{order.items?.length || 0} items</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        {order.address && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FiMapPin className="w-4 h-4" />
                              {order.address.city || 'N/A'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        {currency}{totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {order.paymentType || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, iconBg }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`${iconBg} p-3 rounded-lg text-white`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;
