import React, { useState } from 'react'
import toast from 'react-hot-toast'

const NewLetter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const emailTrim = email.trim()
    if (!emailTrim || !/^\S+@\S+\.\S+$/.test(emailTrim)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setEmail('')
      toast.success('Subscribed — check your inbox!')
    }, 800)
  }

  return (
    <section className="mt-24 pb-14">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-white to-green-50 rounded-2xl shadow-md p-8 sm:p-12 text-center">
        <h2 className="md:text-4xl text-2xl font-semibold text-gray-900">Never Miss a Deal!</h2>
        <p className="md:text-lg text-gray-600 mt-2">Subscribe to get the latest offers, new arrivals, and exclusive discounts</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full sm:flex-1 px-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-green-300 outline-none"
            aria-label="Email address"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}

export default NewLetter
