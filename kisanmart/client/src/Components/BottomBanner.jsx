import React from "react";
import { assets } from "../assets/assets";

const BottomBanner = () => {
  return (
    <section className="w-full mt-24 bg-[#e9efe6] overflow-hidden">
      
      {/* BANNER */}
      <div className="relative w-full h-[420px] md:h-[500px]">

        {/* IMAGE */}
        <img
          src="https://www.shutterstock.com/image-photo/automatic-irrigation-system-water-sprinkler-600nw-2636207293.jpg"
          alt="Automatic Irrigation"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* GREEN GRADIENT OVERLAY (like photo) */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-800/50 to-green-700/20"></div>

        {/* PAPER WAVE TOP */}
        <svg
          className="absolute top-0 left-0 w-full h-14"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
        >
          <path
            fill="#e9efe6"
            d="M0,40 C120,60 240,20 360,30 480,40 600,70 720,60 840,50 960,20 1080,25 1200,30 1320,50 1440,40 L1440,0 L0,0 Z"
          />
        </svg>

        {/* PAPER WAVE BOTTOM */}
        <svg
          className="absolute bottom-0 left-0 w-full h-14"
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
        >
          <path
            fill="#e9efe6"
            d="M0,50 C120,30 240,70 360,60 480,50 600,20 720,30 840,40 960,70 1080,65 1200,60 1320,40 1440,50 L1440,90 L0,90 Z"
          />
        </svg>

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-xl px-6 md:px-20 text-white">

            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              We are Launching Automatic <br />
              Irrigation System Soon...
            </h1>

            <p className="mt-4 text-sm md:text-base text-green-100">
              Let us introduce our upcoming product. Automatic irrigation
              system helps farmers irrigate fields without manual effort.
              Comes with a smart control system.
            </p>

            <button className="mt-6 px-10 py-3 rounded-full bg-white text-green-700 text-sm font-semibold hover:bg-green-600 hover:text-white transition-all">
              READ BLOG
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomBanner;
