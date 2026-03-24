function Solutions() {
  const solutions = [
    {
      title: 'Enterprise Web Applications',
      subtitle: 'Spark Your Digital Product',
      description: "Custom platforms, SaaS solutions, and dashboards designed to ignite user engagement and scale with your growth. We don't just code—we architect digital experiences that catch fire in your market.",
      icon: '🚀'
    },
    {
      title: 'Security & Compliance',
      subtitle: 'Innovate Fearlessly',
      description: 'Vulnerability assessments, secure architecture, and compliance planning that protect your innovation. OWASP-aware implementations mean you can push boundaries without exposing vulnerabilities.',
      icon: '🔒'
    },
    {
      title: 'Managed Maintenance',
      subtitle: 'Keep Your Fire Burning',
      description: '24/7 monitoring, performance optimization, and on-call support that keeps your digital solutions running hot. We maintain the spark so you can focus on growth.',
      icon: '⚡'
    },
  ];

  return (
    <section id="solutions" className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-brand-200/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 animate-fadeInUp">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-2">
              How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-200">Ignite</span> Innovation
            </h2>
            <p className="text-warmBrown text-lg">Transformative solutions for ambitious businesses.</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div 
              key={index}
              className="group relative"
              style={{
                animation: `fadeInUp 0.8s ease-out forwards`,
                animationDelay: `${index * 0.2}s`,
                opacity: 0
              }}
            >
              {/* Card background glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand/30 to-brand-200/30 rounded-card blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10"></div>
              
              <div className="bg-white h-full p-8 rounded-card border border-brand/20 group-hover:border-brand shadow-lg group-hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Icon */}
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {solution.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-charcoal group-hover:text-brand transition-colors duration-300">
                  {solution.title}
                </h3>
                <p className="font-semibold text-brand mb-4 text-sm uppercase tracking-wider">
                  {solution.subtitle}
                </p>
                <p className="text-warmBrown leading-relaxed">
                  {solution.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Solutions;
