import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Siklab Philosophy', href: '#about' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Co-Founders', href: '#co-founders' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <a href="#" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative overflow-hidden">
              <img 
                src="/assets/Siklab.png" 
                alt="Siklab Solutions logo" 
                className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-brand to-brand-200 bg-clip-text text-transparent group-hover:from-brand-200 group-hover:to-brand transition-all duration-300">
              Siklab Solutions
            </span>
          </a>
          
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <svg 
              className={`w-6 h-6 text-charcoal transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation menu */}
          <ul className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-2 lg:gap-8 items-center absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-white lg:bg-transparent p-4 lg:p-0 shadow-lg lg:shadow-none rounded-b-lg lg:rounded-none`}>
            {navLinks.map((link, index) => (
              <li key={index} className="w-full lg:w-auto">
                <a 
                  href={link.href}
                  className="block px-4 py-2 lg:px-0 lg:py-0 text-charcoal hover:text-brand font-medium relative group transition-colors duration-300 hover:bg-gray-50 lg:hover:bg-transparent rounded-lg lg:rounded-none"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-4 lg:left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-brand to-brand-200 transition-all duration-300"></span>
                </a>
              </li>
            ))}
            
            {/* Call to action button */}
            <li className="w-full lg:w-auto mt-4 lg:mt-0">
              <a 
                href="https://www.facebook.com/profile.php?id=61584462523408" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full lg:w-auto text-center bg-gradient-to-r from-brand to-brand-200 text-white px-6 py-3 lg:py-2 rounded-lg font-semibold shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transform transition-all duration-300 active:translate-y-0 hover:brightness-110"
              >
                Let's Connect
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
