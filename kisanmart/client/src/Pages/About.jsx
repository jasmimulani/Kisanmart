import React from "react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        About AgriAccess
      </h1>

      {/* MISSION SECTION */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* TEXT */}
        <div>
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Our Mission
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            At AgriAccess, we're dedicated to providing farmers and agricultural
            professionals with the highest quality tools, equipment, and
            accessories to enhance productivity and sustainability in modern
            farming practices.
          </p>

          <p className="text-gray-600 leading-relaxed">
            With years of experience in the agricultural industry, we understand
            the challenges farmers face and strive to offer innovative solutions
            that make farming more efficient and profitable.
          </p>
        </div>

        {/* IMAGE */}
        <div>
          <img
            src="https://www.shutterstock.com/shutterstock/videos/3541834649/thumb/9.jpg?ip=x480"
            alt="Farming Equipment"
            className="w-full h-[350px] object-cover rounded-lg shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-green-700 mb-10 text-center">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Quality Products
            </h3>
            <p className="text-gray-600">
              We source only the highest quality agricultural tools and
              accessories from trusted manufacturers.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">👨‍🌾</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Expert Advice
            </h3>
            <p className="text-gray-600">
              Our team of agricultural experts helps you choose the right
              equipment for your needs.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Fast Shipping
            </h3>
            <p className="text-gray-600">
              Quick and reliable delivery to your farm, no matter where you are
              located.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
