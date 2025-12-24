import React from 'react'
import { features } from '../assets/assets'

const Services = () => {
  return (
    <div className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12">
          <h3 className="text-2xl font-semibold mb-2">Why Choose KisanMart</h3>
          <p className="text-gray-500 mb-6 max-w-2xl">Quality produce, direct from farms — fast delivery, best prices, and trusted service.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                <img src={f.icon} alt={f.title} className="w-10 h-10 object-contain" />
                <div>
                  <h4 className="font-semibold text-gray-800">{f.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
