function Hero() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="gradient-orb top-right" aria-hidden="true"></div>
      <div className="gradient-orb bottom-left" aria-hidden="true"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fadeInUp">
            <span className="inline-block bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-semibold animate-pulse hover:bg-brand/20 transition-colors duration-300">
              🚀 Innovation Catalyst
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
              We Don't Just Build{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-200 animate-gradient">
                Technology
              </span>
              —We Ignite Possibilities
            </h1>
            <p className="text-lg text-warmBrown leading-relaxed">
              Siklab Solutions ignites digital transformation for ambitious startups and small businesses ready to compete beyond their size. 
              We are innovation catalysts who spark bold ideas into secure, scalable digital realities. Through creative problem-solving, 
              enterprise-grade security, and rapid execution, we fuel business growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61584462523408" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-brand to-brand-200 text-white px-8 py-3 rounded-lg font-semibold shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transform transition-all duration-300 text-lg active:translate-y-0 hover:brightness-110 inline-block group"
              >
                <span className="flex items-center gap-2">
                  Spark Your Vision
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </a>
            </div>
          </div>

          <div className="flex justify-center animate-fadeInDown">
            <div className="relative w-full max-w-md group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand to-brand-200 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="bg-gradient-to-br from-brand/20 to-brand-200/20 rounded-3xl p-8 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 relative">
                <div className="bg-white/90 rounded-2xl p-8 space-y-6 hover:bg-white transition-colors duration-300">
                  <svg viewBox="0 0 320 220" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#ff8c42" stopOpacity="0.95" />
                      </linearGradient>
                    </defs>
                    <g stroke="url(#g1)" strokeWidth="1.6" fill="none" strokeLinecap="round">
                      <path d="M20 40 H120 V80 H260" className="animate-pulse" />
                      <path d="M40 160 H180 V120 H300" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                      <path d="M60 20 V60 H100" className="animate-pulse" style={{animationDelay: '1s'}} />
                    </g>
                    <g fill="url(#g1)">
                      <circle cx="20" cy="40" r="4.5" className="hover:r-6 transition-all" />
                      <circle cx="120" cy="40" r="4.5" />
                      <circle cx="260" cy="80" r="4.5" />
                      <circle cx="40" cy="160" r="4.5" />
                      <circle cx="180" cy="160" r="4.5" />
                      <circle cx="300" cy="120" r="4.5" />
                      <circle cx="100" cy="60" r="3.5" />
                    </g>
                  </svg>
                  <div className="text-center">
                    <code className="text-sm text-brand font-mono bg-brand/10 px-4 py-2 rounded hover:bg-brand/20 transition-colors duration-300">
                      const spark = igniteInnovation()
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
