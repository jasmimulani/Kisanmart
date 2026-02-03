import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiTruck, FiActivity } from 'react-icons/fi'
// import Categoris from '../Components/Categoris'
import BestSeller from '../Components/BestSeller'
import ProductGrid from '../Components/ProductGrid'
import Services from '../Components/Services'
import BottomBanner from '../Components/BottomBanner'
import NewLetter from '../Components/NewLetter'

const Home = () => {
  return (
    <main aria-label="Homepage" className="overflow-x-hidden bg-[#faf9f6]">
      {/* CINEMATIC FULL-SCREEN AGRICULTURE HERO */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
            alt="Premium Farm Landscape"
            className="w-full h-full object-cover scale-105"
          />
          {/* Multi-layered Deep Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/20"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24 w-full">
          <div className="max-w-4xl pt-20">
            {/* Thematic Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 backdrop-blur-xl rounded-full border border-emerald-500/20 mb-10 transform -rotate-1 shadow-lg">
              <FiActivity className="text-emerald-400 w-5 h-5 animate-pulse" />
              <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">
                Redefining Modern Agriculture
              </span>
            </div>

            {/* Title with focus on "Excellence" */}
            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] mb-10 tracking-tighter">
              Harvest The <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Future.</span>
            </h1>

            {/* High-quality description */}
            <p className="text-2xl md:text-3xl text-stone-200/90 mb-14 leading-[1.4] max-w-2xl font-light">
              Empowering farmers with <span className="text-white font-bold italic">premium supplies</span> and sustainable solutions delivered with speed and integrity.
            </p>

            {/* Styled Primary Actions */}
            <div className="flex flex-wrap items-center gap-6">
              <Link
                to="/products"
                className="group relative flex items-center gap-4 px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_15px_50px_-10px_rgba(5,150,105,0.4)] transition-all hover:-translate-y-2 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Start Harvesting</span>
                <FiArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <button className="flex items-center gap-4 px-10 py-6 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-[2.5rem] font-bold text-xl border border-white/20 transition-all hover:-translate-y-1 active:scale-95">
                <span>Watch Our Story</span>
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center p-2">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white ml-1"></div>
                </div>
              </button>
            </div>

            {/* Stats/Badges */}
            <div className="mt-20 flex flex-wrap items-center gap-12">
              <div className="flex flex-col">
                <span className="text-white text-4xl font-black tracking-tighter">10k+</span>
                <span className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Active Farmers</span>
              </div>
              <div className="h-12 w-px bg-stone-800 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-white text-4xl font-black tracking-tighter">100%</span>
                <span className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Purity Assured</span>
              </div>
              <div className="h-12 w-px bg-stone-800 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-white text-4xl font-black tracking-tighter">24/7</span>
                <span className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Support Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Curved Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf9f6] to-transparent z-20"></div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-24">
        <section aria-label="Product categories">
          <div className="flex flex-col items-center mb-20 text-center">
            <div className="w-12 h-1.5 bg-emerald-500 rounded-full mb-6"></div>
            <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Our Premium Catalog</span>
            <h2 className="text-5xl md:text-7xl font-black text-stone-900 mb-8 tracking-tighter">Quality Roots, Stronger Fruits</h2>
            <p className="text-stone-500 max-w-2xl text-lg font-medium">Explore our curated selection of high-yield seeds and modern farming equipment designed for the sustainable agriculturist.</p>
          </div>
          <ProductGrid />
        </section>

        <section aria-label="Best sellers" className="mt-32">
          <BestSeller />
        </section>

        <section aria-label="Our services" className="mt-24">
          <Services />
        </section>
      </div>

      <section aria-label="Why we are the best">
        <BottomBanner />
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-32">
        <section aria-label="Newsletter" className="bg-emerald-950 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(6,78,59,0.3)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 -mr-48 -mt-48 rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 -ml-32 -mb-32 rounded-full blur-[80px] opacity-10"></div>
          <div className="relative z-10">
            <NewLetter />
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
