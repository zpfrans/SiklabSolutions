function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gradient-to-br from-charcoal via-charcoal to-charcoal/95 text-white py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Email contact */}
          <div className="animate-fadeInUp">
            <a 
              href="mailto:contact@siklabitsolutions.com" 
              className="text-gray-400 hover:text-brand transition-all duration-300 flex items-center gap-3 group text-lg"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✉</span>
              <span className="group-hover:underline">contact@siklabitsolutions.com</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <p className="text-gray-500 hover:text-gray-400 transition-colors duration-300">
              © {currentYear} Siklab Solutions. All rights reserved. | Igniting Innovation 🔥
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
