function Portfolio() {
  const projects = [
    {
      title: 'Financial Dashboard',
      description: 'Analytics dashboard with secure payment processing.',
      image: 'project1.jpg'
    },
    {
      title: 'Online Store',
      description: 'Custom e-commerce platform with inventory management.',
      image: 'project2.jpg'
    },
    {
      title: 'Business API',
      description: 'Secure REST API with authentication and data management.',
      image: 'project3.jpg'
    },
    {
      title: 'Healthcare Portal',
      description: 'HIPAA-compliant patient management system with secure messaging.',
      image: 'project4.jpg'
    },
    {
      title: 'Real Estate Platform',
      description: 'Property listing site with advanced search and virtual tours.',
      image: 'project5.jpg'
    },
    {
      title: 'Restaurant Booking System',
      description: 'Online reservation platform with table management and SMS notifications.',
      image: 'project6.jpg'
    },
    {
      title: 'Fitness Tracking App',
      description: 'Mobile-first workout tracker with progress analytics and social features.',
      image: 'project7.jpg'
    },
    {
      title: 'Learning Management System',
      description: 'Educational platform with video streaming, quizzes, and progress tracking.',
      image: 'project8.jpg'
    },
    {
      title: 'Event Management Platform',
      description: 'Ticketing and event coordination system with attendee check-in.',
      image: 'project9.jpg'
    },
  ];

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-charcoal mb-4">Our Work</h2>
        <p className="text-warmBrown mb-12">Projects where we've ignited digital transformation.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-card shadow-md hover:shadow-warm-lg transition-all cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-brand/10 to-brand-200/10 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-brand text-6xl opacity-50 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-charcoal">{project.title}</h4>
              <p className="text-sm text-warmBrown">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
