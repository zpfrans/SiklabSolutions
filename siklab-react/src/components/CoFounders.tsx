function CoFounders() {
  const coFounders = [
    {
      name: 'Jabez Antiñero',
      title: 'Co-Founder',
      bio: 'At the heart of Siklab IT Solutions is Jabez Antiñero, a visionary Co-Founder and recognized leader who seamlessly blends academic excellence as President of the Business Management Group at APC with high-stakes entrepreneurial experience. A Business Analytics specialist and elite SAP Varsity member, Jabez provides clients a decisive edge by implementing rigorous enterprise-grade standards and "smart and enticing" branding strategies. His technical prowess is proven on the national stage, having secured a prestigious award at the Philtech AI Innovathon 2026 and a podium finish at the BPI DATA Wave 2025. By leveraging his background in IT consultancy and data-driven growth, Jabez ensures that Siklab doesn\'t just build systems, but ignites growth through technical precision and unyielding integrity.',
      expertise: 'Business Strategy, Leadership, Technology Vision',
      photo: '/assets/cofounderone.jpg',
      facebook: 'https://www.facebook.com/antjabz',
      linkedin: 'https://www.linkedin.com/in/jabez-anti%C3%B1ero-2129b2362/'
    },
    {
      name: 'Francis Ryan Dichoso',
      title: 'Co-Founder',
      bio: 'Francis Ryan Dichoso is a Computer Science professional based at Asia Pacific College in Taguig, National Capital Region, Philippines, actively involved in tech and cybersecurity communities through leadership roles in organizations such as CyberPH, the Junior Philippine Computer Society, Microsoft Community – Asia Pacific College, and the Junior Information Systems Security Association, while also serving as an ambassador for DEVCON Philippines and pursuing certifications in cybersecurity, programming, and entrepreneurship.',
      expertise: 'Fullstack Development, Cybersecurity',
      photo: '/assets/cofoundertwo.jpg',
      facebook: 'https://www.facebook.com/franszp/',
      linkedin: 'https://www.linkedin.com/in/francis-ryan-dichoso-b4907a315/'
    }
  ];

  return (
    <section id="co-founders" className="py-20 relative overflow-hidden bg-gradient-to-b from-white via-brand/5 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-200/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-200">Co-Founders</span>
          </h2>
          <p className="text-lg text-warmBrown max-w-2xl mx-auto">
            The visionary leaders driving Siklab Solutions forward with passion and innovation.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {coFounders.map((founder, index) => (
            <div 
              key={index}
              className="group"
              style={{
                animation: `${index === 0 ? 'slideInLeft' : 'slideInRight'} 0.8s ease-out forwards`,
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand to-brand-200 rounded-card blur opacity-0 group-hover:opacity-30 transition duration-500 -z-10"></div>
              
              <div className="bg-gradient-to-br from-white to-brand/5 hover:from-brand/10 hover:to-brand-200/10 p-8 rounded-card shadow-lg hover:shadow-2xl transition-all duration-300 h-full group-hover:-translate-y-2">
                {/* Avatar circle with photo */}
                <div className="mb-6 flex justify-center">
                  <div className="w-80 h-80 bg-gradient-to-br from-brand to-brand-200 rounded-full p-1 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <img 
                      src={founder.photo} 
                      alt={founder.name}
                      className="w-full h-full rounded-full object-cover object-center"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-charcoal text-center mb-2 group-hover:text-brand transition-colors duration-300">
                  {founder.name}
                </h3>
                <p className="text-brand font-semibold text-center mb-4 text-sm uppercase tracking-wider">
                  {founder.title}
                </p>
                <p className="text-warmBrown text-center mb-6 leading-relaxed">
                  {founder.bio}
                </p>
                
                <div className="border-t border-brand/20 group-hover:border-brand/40 pt-4 transition-colors duration-300">
                  <p className="text-sm font-semibold text-brand mb-2">🎯 Expertise:</p>
                  <p className="text-sm text-warmBrown leading-relaxed">
                    {founder.expertise}
                  </p>
                </div>

                {/* Social links */}
                <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-brand/20">
                  {founder.facebook && (
                    <a href={founder.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300 group-hover:scale-110 transform">
                      <span>f</span>
                    </a>
                  )}
                  {founder.linkedin && (
                    <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300 group-hover:scale-110 transform">
                      <span>in</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoFounders;
