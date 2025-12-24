// In About.jsx
const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">About AgriAccess</h1>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At AgriAccess, we're dedicated to providing farmers and agricultural professionals with 
            the highest quality tools, equipment, and accessories to enhance productivity and 
            sustainability in modern farming practices.
          </p>
          <p className="text-gray-600 mb-6">
            With years of experience in the agricultural industry, we understand the challenges 
            farmers face and strive to offer innovative solutions that make farming more efficient 
            and profitable.
          </p>
        </div>
        <div>
          <img 
            src="https://images.unsplash.com/photo-1581093452174-5dde54c5bc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80" 
            alt="Farming Equipment" 
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-green-700 mb-8 text-center">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Quality Products',
              description: 'We source only the highest quality agricultural tools and accessories from trusted manufacturers.',
              icon: '✅'
            },
            {
              title: 'Expert Advice',
              description: 'Our team of agricultural experts is here to help you find the right equipment for your needs.',
              icon: '👨‍🌾'
            },
            {
              title: 'Fast Shipping',
              description: 'Quick delivery to your farm, no matter where you are located.',
              icon: '🚚'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

    export default About;