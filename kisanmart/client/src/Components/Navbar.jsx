import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    user,
    setUser,
    SetShowUserLogin,
    navigate,
    searchQuery,
    SetSearchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) navigate("/products");
  }, [searchQuery]);

  return (
    <nav className="sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="bg-[#12232e]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-4">
          <NavLink to="/" className="text-orange-400 text-3xl font-bold">
            Kisan<span className="text-green-500">Mart</span>
          </NavLink>

          {/* SEARCH */}
          <div className="flex-1 hidden sm:flex justify-center">
            <div className="w-full max-w-2xl flex bg-white rounded-full overflow-hidden">
              <input
                type="search"
                placeholder="Search Products..."
                onChange={(e) => SetSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 outline-none text-sm"
              />
              <button className="px-4 bg-gray-200">
                <img src={assets.search_icon} className="w-4 invert" />
              </button>
            </div>
          </div>

          {/* CART + USER */}
          <div className="flex items-center gap-3 text-white">
            <button onClick={() => navigate("/cart")} className="relative">
              <img src={assets.nav_cart_icon} className="w-6 invert" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>

            {!user ? (
              <button onClick={() => SetShowUserLogin(true)}>
                <img src={assets.profile_icon} className="w-6" />
              </button>
            ) : (
              <div className="relative group">
                <img src={assets.profile_icon} className="w-6 cursor-pointer" />
                <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded shadow opacity-0 group-hover:opacity-100 invisible group-hover:visible">
                  <button
                    onClick={() => navigate("/my-orders")}
                    className="block w-full px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU BAR */}
      <div className="bg-[#0f1b22]">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 h-14 text-white text-sm font-medium">
            <NavLink to="/" className="hover:text-green-400">
              Home
            </NavLink>

            <Dropdown
              title="Tools"
              items={["Agriculture Tools", "Rubber Plantation","Organic Fertilizer"]}
            />
        
            <Dropdown
              title="Farm Accessories"
              items={["Accessories", "Beekeeper Accessories"]}
            />

            <Dropdown
              title="Seeds"
              items={["Vegetable Seeds", "Flower Seeds", "Fruit Seeds"]}
            />

            <NavLink to="/about" className="hover:text-green-400">
              About
            </NavLink>
            <NavLink to="/contact" className="hover:text-green-400">
              Contact
            </NavLink>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

/* ================= DROPDOWN ================= */

const Dropdown = ({ title, items }) => {
  return (
    <li className="relative group cursor-pointer">
      <div className="flex items-center gap-1 hover:text-green-400">
        <span>{title}</span>
        ▼
      </div>

      <div className="absolute top-full left-0 mt-2 w-56 bg-white text-black rounded shadow-lg
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
        {items.map((item, index) => (
          <NavLink
            key={index}
            to={`/products?category=${encodeURIComponent(item)}`}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {item}
          </NavLink>
        ))}
      </div>
    </li>
  );
};
