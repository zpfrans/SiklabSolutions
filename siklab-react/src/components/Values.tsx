function Values() {
  const values = [
    {
      icon: '🔥',
      title: 'Innovation Spark',
      description: 'We approach every challenge with creative curiosity, igniting new possibilities rather than applying cookie-cutter solutions.',
    },
    {
      icon: '🛡️',
      title: 'Fearless Security',
      description: 'We build with OWASP-aware, security-first architecture so clients can innovate boldly without compromise.',
    },
    {
      icon: '🤝',
      title: 'Catalyst Partnership',
      description: "We're not vendors—we're co-creators who ignite your vision and fan the flames of your success.",
    },
    {
      icon: '📈',
      title: 'Scalable Foundations',
      description: 'We architect for the spark today and the wildfire growth tomorrow—solutions that scale with your ambition.',
    },
    {
      icon: '⚡',
      title: 'Transparent Velocity',
      description: 'We deliver with milestone-driven speed and clear communication—fast results, zero surprises.',
    },
  ];

  return (
    <section id="values" className="py-20 bg-gradient-to-b from-white to-brand/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-brand/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-brand-200/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-200">Core Values</span>
          </h2>
          <p className="text-lg text-warmBrown max-w-2xl mx-auto">
            Guiding principles that fuel every innovation and partnership.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className="group relative"
              style={{
                animation: `fadeInUp 0.8s ease-out forwards`,
                animationDelay: `${index * 0.15}s`,
                opacity: 0
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand/40 to-brand-200/40 rounded-card blur opacity-0 group-hover:opacity-50 transition duration-500 -z-10"></div>
              
              <div className="bg-white/80 backdrop-blur-sm h-full p-6 rounded-card shadow-lg group-hover:shadow-2xl hover:border-brand border border-brand/20 transition-all duration-300 group-hover:-translate-y-2">
                {/* Icon with animation */}
                <div className="text-5xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 origin-center inline-block">
                  {value.icon}
                </div>
                
                <h4 className="text-xl font-bold mb-3 text-charcoal group-hover:text-brand transition-colors duration-300">
                  {value.title}
                </h4>
                
                <p className="text-warmBrown leading-relaxed group-hover:text-charcoal transition-colors duration-300">
                  {value.description}
                </p>

                {/* Accent line */}
                <div className="mt-4 h-1 w-0 group-hover:w-8 bg-gradient-to-r from-brand to-brand-200 rounded-full transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Values;
