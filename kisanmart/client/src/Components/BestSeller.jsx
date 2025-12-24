import React from "react";

const BestSeller = () => {
  return (
    <div className="w-full bg-[#e9f5ea] py-16">
      {/* MAIN WRAPPER */}
      <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden rounded-3xl">

        {/* BACKGROUND IMAGE */}
        <img
          src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202504/paddy-field-230021521-16x9_0.jpg?VersionId=1XxrW8SnGVdrE3N2cgaBUpzs4DPOOVwv&size=690:388"
          alt="Farmer"
          className="w-full h-[420px] md:h-[480px] object-cover"
        />

        {/* GREEN OVERLAY */}
        <div className="absolute inset-0 bg-green-900/40"></div>

        {/* TORN PAPER EFFECT - TOP */}
        <div className="absolute top-0 left-0 w-full h-16 bg-[#e9f5ea] rounded-b-[100%]"></div>

        {/* TORN PAPER EFFECT - BOTTOM */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-[#e9f5ea] rounded-t-[100%]"></div>

        {/* CONTENT */}
        <div className="absolute inset-0 flex items-center">
          <div className="ml-auto mr-10 md:mr-20 max-w-lg text-white">
            <h1 className="text-3xl md:text-4xl font-bold leading-snug">
              India’s First Online Agricultural <br /> Plant Store
            </h1>

            <p className="mt-4 text-sm md:text-base text-green-100">
              We provide agricultural plants and make it easily accessible
              for everyone!
            </p>

            <button className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full text-sm font-semibold transition">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
