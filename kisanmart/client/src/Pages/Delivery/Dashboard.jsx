import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { FiPackage, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { axios, deliveryProfile } = useAppContext();
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalEarnings: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this from your API
        // const { data } = await axios.get('/api/delivery/dashboard');
        
        // Mock data - replace with actual API call
        setTimeout(() => {
          setStats({
            pending: 5,
            inProgress: 3,
            completed: 24,
            totalEarnings: 1245.50
          });
          
          setRecentOrders([
            {
              _id: '1',
              orderId: 'ORD-001',
              status: 'pending',
              amount: 45.99,
              items: [{ name: 'Product 1' }, { name: 'Product 2' }],
              deliveryAddress: '123 Main St, Anytown, USA',
              deliveryTime: 'Within 1 hour',
              paymentMethod: 'Cash on Delivery',
              isPaid: false,
              createdAt: new Date()
            },
            {
              _id: '2',
              orderId: 'ORD-002',
              status: 'accepted',
              amount: 78.50,
              items: [{ name: 'Product 3' }],
              deliveryAddress: '456 Oak Ave, Somewhere, USA',
              deliveryTime: 'ASAP',
              paymentMethod: 'Card',
              isPaid: true,
              createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
            }
          ]);
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      // In a real app, you would make an API call to update the order status
      // await axios.put(`/api/orders/${orderId}/accept`);
      
      // Update local state
      setRecentOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'accepted' } 
            : order
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        inProgress: prev.inProgress + 1
      }));
      
      toast.success('Order accepted successfully');
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      // In a real app, you would make an API call to update the order status
      // await axios.put(`/api/orders/${orderId}/complete`);
      
      // Update local state
      setRecentOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'completed' } 
            : order
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        inProgress: prev.inProgress - 1,
        completed: prev.completed + 1,
        totalEarnings: prev.totalEarnings + 10 // Assuming $10 per delivery
      }));
      
      toast.success('Order marked as delivered');
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {deliveryProfile?.name || 'Delivery Partner'}!</h2>
        <p className="mt-1 text-sm text-gray-500">Here's what's happening with your deliveries today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Orders */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <FiPackage className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Deliveries</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.pending}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <FiClock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.inProgress}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <FiCheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.completed}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <FiDollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${stats.totalEarnings.toFixed(2)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            View All
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by accepting new delivery requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onAccept={handleAcceptOrder}
                onComplete={handleCompleteOrder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
