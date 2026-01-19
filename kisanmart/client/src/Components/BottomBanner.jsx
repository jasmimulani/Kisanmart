import React from "react";
import {
  FiCloudRain,
  FiSmartphone,
  FiDroplet,
  FiZap,
  FiSun,
  FiLayers,
} from "react-icons/fi";

const BottomBanner = () => {
  const demoLink =
    "https://www.google.com/search?sca_esv=df7509ffe88df6d2&rlz=1C1UEAD_enIN1063IN1063&sxsrf=ANbL-n4tXB9ZUuNiw1qggbPodWwKTw-b8w:1768822495971&udm=7&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKp9lEhFAN_4ain3HSNQWw-mMGVXS0bCMe2eDZOQ2MOTwmdSduEdP1lcK-3UDyorIbYkF4w9ksckliRqNmnEiwdZq9hi6Uf0JMwEobPco1ddsraLMoix6VFcBVLI33WJ4qzChHA80y2JbwB7Ntoj9wD-E0QQ0ZdtEYmEVOXRtobBmtczcO1eywFdgs0HIQoWFlRkLvAJg&q=Smart+Irrigation+System+for+Farmers&sa=X&ved=2ahUKEwjy36ukwZeSAxWVTGwGHcLEBbAQtKgLegQIDRAB&biw=1600&bih=732&dpr=1.2&aic=0#fpstate=ive&vld=cid:e876eb13,vid:Ulf8E1XnhgI,st:0";

  const features = [
    {
      icon: <FiCloudRain className="text-3xl mb-2" />,
      title: "Smart Soil Sensors",
      desc: "Detect soil moisture for efficient irrigation.",
    },
    {
      icon: <FiSmartphone className="text-3xl mb-2" />,
      title: "Mobile Control",
      desc: "Manage irrigation from anywhere using your phone.",
    },
    {
      icon: <FiDroplet className="text-3xl mb-2" />,
      title: "Water Efficiency",
      desc: "Reduce water usage and save on costs.",
    },
    {
      icon: <FiZap className="text-3xl mb-2" />,
      title: "Energy Saving",
      desc: "Minimal electricity usage while maximizing irrigation.",
    },
    {
      icon: <FiSun className="text-3xl mb-2" />,
      title: "Weather Adaptive",
      desc: "Adjusts watering based on forecast and sunlight.",
    },
    {
      icon: <FiLayers className="text-3xl mb-2" />,
      title: "Crop-Specific",
      desc: "Irrigate rice, wheat, vegetables, and orchards effectively.",
    },
  ];

  const testimonials = [
    {
      text: "Kisamnart increased my wheat yield by 40%!",
      name: "Ramesh Patel",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      text: "Easy to install and use, my farm water usage dropped.",
      name: "Sunita Verma",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      text: "Reliable system, my orchard is thriving!",
      name: "Mohan Singh",
      img: "https://randomuser.me/api/portraits/men/65.jpg",
    },
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
          <source
            src="https://www.w3schools.com/howto/rain.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-800/50 to-green-700/20"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Smart <span className="text-yellow-300">Irrigation System</span>
            <br />
            for Farmers
          </h1>

          <p className="text-white text-lg md:text-xl max-w-2xl mb-8">
            Save water, increase yield, and manage your farm efficiently with our
            smart irrigation system.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.open(demoLink, "_blank")}
              className="px-10 py-3 rounded-full bg-white text-green-700 font-semibold hover:bg-green-600 hover:text-white transition-all"
            >
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
          <div
            key={i}
            className="bg-white/90 p-8 rounded-xl shadow-lg text-center hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {f.icon}
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-sm mt-2">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-green-900/80 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-20 text-white">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
            Farmers Love Kisamnart
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-green-800/50 p-6 rounded-lg flex-1">
                <div className="flex items-center mb-4">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
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
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl"
          >
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
        <button className="px-10 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-900 transition-all">
          JOIN WAITING LIST
        </button>
      </div>
    </section>
  );
};

export default BottomBanner;
