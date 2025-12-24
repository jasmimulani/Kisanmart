import React from 'react'
import { Link } from 'react-router-dom'
import { footerLinks } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-0">
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-green-600 to-green-400" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2" aria-label="KisanMart home">
              <span className="text-accent text-3xl font-bold tracking-wide leading-none">Kisan<span className="text-green-400">Mart</span></span>
            </Link>
            <p className="text-gray-400 mt-3">Quality produce and farming supplies — direct from farms to your doorstep.</p>
          </div>

          {footerLinks.slice(0,3).map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.text}>
                    {l.url.startsWith('http') ? (
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">{l.text}</a>
                    ) : (
                      <Link to={l.url} className="text-gray-400 hover:text-white">{l.text}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {footerLinks[3].links.map((s) => (
                <a key={s.text} href={s.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400">{s.text}</a>
              ))}
            </div>

            <form className="mt-6 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-newsletter" className="sr-only">Email</label>
              <input id="footer-newsletter" type="email" placeholder="Your email" className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-sm" />
              <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {new Date().getFullYear()} <span className="font-semibold">KisanMart</span>. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-gray-400 hover:text-white">Back to top</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer