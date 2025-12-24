// In MainBanner.jsx
const MainBanner = () => {
  return (
    <div className="w-full">
      <section className="relative w-full h-[420px] sm:h-[520px] lg:h-[600px] overflow-hidden">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/056/366/396/small/two-tractors-cultivating-a-lush-green-field-with-distant-mountains-and-a-cloudy-sky-photo.jpg"
          alt="Agricultural Equipment Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Premium Agricultural Equipment
            </h1>
            <p className="mt-4 text-base sm:text-lg text-green-100 max-w-2xl mx-auto">
              High-quality farming tools and accessories for modern agriculture
            </p>
            <button className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
              Shop Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainBanner;