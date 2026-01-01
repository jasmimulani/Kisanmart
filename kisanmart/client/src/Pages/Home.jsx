import React from 'react'
import { Link } from 'react-router-dom'
// import Categoris from '../Components/Categoris'
import BestSeller from '../Components/BestSeller'
import ProductGrid from '../Components/ProductGrid'
import Services from '../Components/Services'
import BottomBanner from '../Components/BottomBanner'
import NewLetter from '../Components/NewLetter'

const Home = () => {
  return (
    <main aria-label="Homepage">
      <section className="relative w-screen h-[450px] sm:h-[550px] lg:h-[600px] 
                         left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">

        {/* Background Image */}
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/056/366/396/small/two-tractors-cultivating-a-lush-green-field-with-distant-mountains-and-a-cloudy-sky-photo.jpg"
          alt="Farm Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
            Everything for Your Farm
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-green-100">
            High-quality farming supplies at wholesale prices.
            We deliver directly to your farm.
          </p>

          <div className="mt-10">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 text-base font-semibold 
                         rounded-md text-green-700 bg-white hover:bg-green-50 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section aria-label="Product categories" className="mt-16">
          {/* <Categoris /> */}
          <ProductGrid />
        </section>
        <hr className="mt-12 border-gray-200/60" />
        <section aria-label="Best sellers" className="mt-12">
          <BestSeller />
        </section>

        <section aria-label="Our services" className="mt-8">
          <Services />
        </section>
      </div>
      <section aria-label="Why we are the best" className="mt-20">
        <BottomBanner />
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <section aria-label="Newsletter" className="mt-20">
          <NewLetter />
        </section>
      </div>
    </main>
  )
}

export default Home
