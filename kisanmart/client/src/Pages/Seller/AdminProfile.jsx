import React, { useState, useEffect } from "react";
import { useAppContext } from "../../Context/AppContext";
import { FiTrendingUp, FiPackage, FiUsers, FiTruck, FiShoppingCart, FiBarChart2, FiCalendar } from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const { sellerProfile, axios, currency } = useAppContext();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalDeliveryBoys: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch orders
      const ordersRes = await axios.get("/api/order/seller");
      const orders = ordersRes.data.orders || [];

      // Fetch products
      const productsRes = await axios.get("/api/product/list");
      const products = productsRes.data.products || [];

      // Fetch users
      const usersRes = await axios.get("/api/user/users");
      const users = usersRes.data.users || [];

      // Fetch delivery boys
      const deliveryRes = await axios.get("/api/delivery/list");
      const deliveryBoys = deliveryRes.data.list || [];

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let totalRevenue = 0;
      let todayRevenue = 0;
      let pendingOrders = 0;
      let completedOrders = 0;
      let todayOrders = 0;

      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const orderAmount = order.items?.reduce((sum, item) => {
          const price = item.product?.offerprice ?? item.product?.price ?? 0;
          return sum + price * item.quantity;
        }, 0) || order.amount || 0;

        totalRevenue += orderAmount;
        if (orderDate >= today) {
          todayRevenue += orderAmount;
          todayOrders++;
        }

        if (order.status === "pending" || order.status === "Order Placed") {
          pendingOrders++;
        } else if (order.status === "Delivered" || order.status === "completed") {
          completedOrders++;
        }
      });

      // Prepare chart data (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const dayOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === date.toDateString();
        });

        const dayRevenue = dayOrders.reduce((sum, order) => {
          return sum + (order.items?.reduce((s, item) => {
            const price = item.product?.offerprice ?? item.product?.price ?? 0;
            return s + price * item.quantity;
          }, 0) || order.amount || 0);
        }, 0);

        last7Days.push({
          date: dateStr,
          orders: dayOrders.length,
          revenue: dayRevenue,
        });
      }

      // Category distribution
      const categoryMap = {};
      products.forEach(product => {
        const cat = product.category || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      const categoryChartData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }));

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: users.length,
        totalProducts: products.length,
        totalDeliveryBoys: deliveryBoys.length,
        pendingOrders,
        completedOrders,
        todayOrders,
        todayRevenue,
      });

      setChartData(last7Days);
      setCategoryData(categoryChartData);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (!sellerProfile) {
    return (
      <div className="p-6 w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-[95vh] overflow-y-auto p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {sellerProfile.name}! 
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your store today</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Admin
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`${currency}${stats.totalRevenue.toFixed(2)}`}
            icon={<FiTrendingUp className="w-6 h-6" />}
            color="bg-green-500"
            bgColor="bg-green-50"
            textColor="text-green-700"
            change={`Today: ${currency}${stats.todayRevenue.toFixed(2)}`}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<FiPackage className="w-6 h-6" />}
            color="bg-blue-500"
            bgColor="bg-blue-50"
            textColor="text-blue-700"
            change={`Today: ${stats.todayOrders}`}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<FiUsers className="w-6 h-6" />}
            color="bg-purple-500"
            bgColor="bg-purple-50"
            textColor="text-purple-700"
            change={`Active customers`}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<FiShoppingCart className="w-6 h-6" />}
            color="bg-orange-500"
            bgColor="bg-orange-50"
            textColor="text-orange-700"
            change={`In catalog`}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Partners</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalDeliveryBoys}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiTruck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
              Revenue Overview (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${currency}${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-blue-600" />
              Orders Overview (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiShoppingCart className="w-5 h-5 text-purple-600" />
              Products by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={<FiPackage className="w-5 h-5" />}
              label="View Orders"
              to="/seller/dashboard/orders"
            />
            <QuickActionButton
              icon={<FiShoppingCart className="w-5 h-5" />}
              label="Add Product"
              to="/seller/dashboard/add-product"
            />
            <QuickActionButton
              icon={<FiUsers className="w-5 h-5" />}
              label="Manage Users"
              to="/seller/dashboard/user-list"
            />
            <QuickActionButton
              icon={<FiTruck className="w-5 h-5" />}
              label="Delivery List"
              to="/seller/dashboard/delivery-list"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bgColor, textColor, change }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        {change && <p className="text-xs text-gray-500 mt-1">{change}</p>}
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>
        <div className={textColor}>{icon}</div>
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, to }) => {
  const { navigate } = useAppContext();
  return (
    <button
      onClick={() => navigate(to)}
      className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-500 transition-colors"
    >
      <div className="text-green-600">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
};

// Add missing import
const FiCheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default AdminProfile;
