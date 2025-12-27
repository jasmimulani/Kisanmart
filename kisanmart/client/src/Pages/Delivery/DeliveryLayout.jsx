import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiUser, 
  FiLogOut,
  FiHome,
  FiMenu,
  FiX
} from 'react-icons/fi';

const DeliveryLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: <FiHome className="w-5 h-5" />, label: 'Dashboard', to: '/delivery/dashboard' },
    { icon: <FiPackage className="w-5 h-5" />, label: 'New Orders', to: '/delivery/orders' },
    { icon: <FiTruck className="w-5 h-5" />, label: 'In Progress', to: '/delivery/in-progress' },
    { icon: <FiCheckCircle className="w-5 h-5" />, label: 'Completed', to: '/delivery/completed' },
    { icon: <FiUser className="w-5 h-5" />, label: 'Profile', to: '/delivery/profile' },
  ];

  const handleLogout = async () => {
    try {
      // Add your logout logic here
      navigate('/delivery/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-16 bg-green-600">
            <h1 className="text-white text-xl font-bold">Delivery Panel</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md group"
                activeClassName="bg-green-50 text-green-600"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md group"
            >
              <FiLogOut className="mr-3 w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex items-center justify-center h-16 bg-green-600">
              <h1 className="text-white text-xl font-bold">Delivery Panel</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <FiLogOut className="mr-3 w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;