import React from "react";
import { FiCloudRain, FiSmartphone, FiDroplet, FiZap, FiSun, FiLayers } from "react-icons/fi";

const BottomBanner = () => {
  const features = [
    { icon: <FiCloudRain className="text-3xl mb-2" />, title: "Smart Soil Sensors", desc: "Detect soil moisture for efficient irrigation." },
    { icon: <FiSmartphone className="text-3xl mb-2" />, title: "Mobile Control", desc: "Manage irrigation from anywhere using your phone." },
    { icon: <FiDroplet className="text-3xl mb-2" />, title: "Water Efficiency", desc: "Reduce water usage and save on costs." },
    { icon: <FiZap className="text-3xl mb-2" />, title: "Energy Saving", desc: "Minimal electricity usage while maximizing irrigation." },
    { icon: <FiSun className="text-3xl mb-2" />, title: "Weather Adaptive", desc: "Adjusts watering based on forecast and sunlight." },
    { icon: <FiLayers className="text-3xl mb-2" />, title: "Crop-Specific", desc: "Irrigate rice, wheat, vegetables, and orchards effectively." },
  ];

  const testimonials = [
    { text: "Kisamnart increased my wheat yield by 40%!", name: "Ramesh Patel", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { text: "Easy to install and use, my farm water usage dropped.", name: "Sunita Verma", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { text: "Reliable system, my orchard is thriving!", name: "Mohan Singh", img: "https://randomuser.me/api/portraits/men/65.jpg" },
  ];

  const stats = [
    { value: "500+", label: "Fields Covered" },
    { value: "10M+", label: "Liters Water Saved" },
    { value: "1200+", label: "Farmers Benefited" },
    { value: "99%", label: "Satisfaction Rate" },
  ];

  return (
    <section className="w-full relative overflow-hidden">

      {/* HERO VIDEO */}
      <div className="relative h-[600px] md:h-[700px] w-full">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-800/50 to-green-700/20"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Smart <span className="text-yellow-300">Irrigation System</span> <br /> for Farmers
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mb-8 font-medium drop-shadow-md">
            Save water, increase yield, and manage your farm efficiently with our smart irrigation system.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-10 py-3 rounded-full bg-white text-green-700 font-semibold hover:bg-green-600 hover:text-white transition-all">
              WATCH DEMO
            </button>
            <button className="px-10 py-3 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-green-700 transition-all">
              PRE-ORDER NOW
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-6 md:px-20 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-white/90 p-8 rounded-xl shadow-lg text-gray-800 text-center hover:shadow-xl transition-all hover:-translate-y-1">
            {f.icon}
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-sm mt-2">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-green-900/80 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-20 text-white">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">Farmers Love Kisamnart</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-green-800/50 p-6 rounded-lg flex-1">
                <div className="flex items-center mb-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                  <h4 className="font-semibold">{t.name}</h4>
                </div>
                <p className="italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto px-6 md:px-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center py-16">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-3xl font-bold">{s.value}</h3>
            <p className="mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      {/* FINAL CTA */}
      <div className="text-center py-20 bg-gradient-to-r from-green-700 to-green-800 px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Pre-Order Your Smart Irrigation System Today
        </h2>
        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
          Join our waiting list and get exclusive updates for farmers.
        </p>
        <button className="px-10 py-3 rounded-full bg-green-700 text-white text-sm font-semibold hover:bg-green-900 transition-all">
          JOIN WAITING LIST
        </button>
      </div>
    </section>
  );
};

export default BottomBanner;
