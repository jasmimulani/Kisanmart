import React from "react";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top green border */}
      <div className="h-1 bg-green-600"></div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div>
            <NavLink to="/" className="text-orange-400 text-3xl font-bold">
              Kisan<span className="text-green-500">Mart</span>
            </NavLink>
            <p className="mt-3 text-sm text-gray-400">
              KisanMart connects farmers and customers with quality agricultural
              products at fair prices.
            </p>
          </div>

          {/* TOOLS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products?category=Agriculture Tools"
                  className="hover:text-white"
                >
                  Agriculture Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Rubber Plantation"
                  className="hover:text-white"
                >
                  Rubber Plantation
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Organic Fertilizer"
                  className="hover:text-white"
                >
                  Organic Fertilizer
                </Link>
              </li>
            </ul>
          </div>

          {/* FARM ACCESSORIES */}
          <div>
            <h4 className="text-white font-semibold mb-4">Farm Accessories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products?category=Accessories"
                  className="hover:text-white"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Beekeeper Accessories"
                  className="hover:text-white"
                >
                  Beekeeper Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* SEEDS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Seeds</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products?category=Vegetable Seeds"
                  className="hover:text-white"
                >
                  Vegetable Seeds
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Flower Seeds"
                  className="hover:text-white"
                >
                  Flower Seeds
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Fruit Seeds"
                  className="hover:text-white"
                >
                  Fruit Seeds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">KisanMart</span>.  
            All Rights Reserved.
          </p>

          <div className="flex gap-4 mt-3 md:mt-0">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-white"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
