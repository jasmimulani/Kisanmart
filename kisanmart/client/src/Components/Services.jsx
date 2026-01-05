import React from "react";
import { features } from "../assets/assets";

const Services = () => {
  return (
    <div className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12">
          <h3 className="text-2xl font-semibold mb-2">
            Why Choose KisanMart
          </h3>
          <p className="text-gray-500 mb-6 max-w-2xl">
            Quality produce, direct from farms — fast delivery, best prices, and
            trusted service.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white"
              >
                {/* ICON */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold text-xl transition-transform duration-300 group-hover:scale-110">
                  
                  {idx === 2 ? (
                    "₹"
                  ) : (
                    <img
                      src={f.icon}
                      alt={f.title}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                </div>

                {/* TEXT */}
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-green-600 transition">
                    {f.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
