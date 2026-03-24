function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-brand/5 via-white to-brand-200/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-brand-200/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Brand Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12 animate-fadeInUp">
            <span className="inline-block text-brand font-semibold mb-4 text-sm uppercase tracking-wider">The Siklab Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Every Great Business Starts with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-200">Spark</span>
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-warmBrown leading-relaxed">
            <p className="animate-fadeInUp text-lg border-l-4 border-brand pl-6">
              Every great business starts with a spark—a bold idea, an unmet need, a vision for something better. 
              But in today's digital landscape, that spark needs fuel, oxygen, and careful tending to become a lasting flame.
            </p>
            <p className="animate-fadeInUp text-lg" style={{animationDelay: '0.1s'}}>
              At Siklab Solutions, we're master fire-starters. We don't just build websites and applications—we ignite digital innovation. 
              We take your spark of an idea and combine it with enterprise-grade security, scalable architecture, and creative problem-solving 
              to create solutions that don't just launch—they blaze trails.
            </p>
            <p className="animate-fadeInUp text-lg" style={{animationDelay: '0.2s'}}>
              Too many startups and small businesses see their innovative ideas fizzle out due to security vulnerabilities, scalability issues, 
              or technical limitations. We ensure your digital solutions are built to catch fire in your market and sustain that growth.
            </p>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-200 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              🔥 We're the catalyst. You're the vision. Together, we ignite possibilities.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div 
            className="group relative"
            style={{
              animation: `slideInLeft 0.8s ease-out forwards`,
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 to-brand-200/20 rounded-card blur opacity-0 group-hover:opacity-50 transition duration-500 -z-10"></div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-card shadow-lg group-hover:shadow-2xl border-l-4 border-brand group-hover:border-brand-200 transition-all duration-300 h-full hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-charcoal group-hover:text-brand transition-colors duration-300">Our Vision</h3>
              </div>
              <p className="text-warmBrown leading-relaxed group-hover:text-charcoal transition-colors duration-300">
                To be the catalyst for digital innovation, and a trusted technology partner of businesses with transformative solutions 
                that turn ambitious visions into thriving digital realities.
              </p>
            </div>
          </div>

          <div 
            className="group relative"
            style={{
              animation: `slideInRight 0.8s ease-out forwards`,
            }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-200/20 to-brand/20 rounded-card blur opacity-0 group-hover:opacity-50 transition duration-500 -z-10"></div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-card shadow-lg group-hover:shadow-2xl border-l-4 border-brand-200 group-hover:border-brand transition-all duration-300 h-full hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-200 to-brand rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-charcoal group-hover:text-brand transition-colors duration-300">Our Mission</h3>
              </div>
              <p className="text-warmBrown leading-relaxed group-hover:text-charcoal transition-colors duration-300">
                To spark innovation and ignite business growth by delivering creative, secure digital solutions that empower 
                small businesses and startups to compete fearlessly in the digital economy.
              </p>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mt-16 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand/10 to-brand-200/10 px-6 py-3 rounded-full border border-brand/30 hover:border-brand hover:shadow-lg hover:from-brand/20 hover:to-brand-200/20 transition-all duration-300 group cursor-pointer">
            <span className="text-2xl group-hover:animate-float">🔥</span>
            <span className="text-brand font-bold text-lg group-hover:text-brand-200 transition-colors duration-300">Igniting Digital Innovation</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
