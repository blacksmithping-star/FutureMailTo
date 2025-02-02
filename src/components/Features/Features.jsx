function Features() {
  const features = [
    {
      title: "Private & Personal",
      description: "Emails are private, ensuring your thoughts remain confidential.",
      icon: "🔒"
    },
    {
      title: "Choose Your Date",
      description: "Schedule delivery for any future date, from tomorrow to years ahead.",
      icon: "📅"
    },
    {
      title: "100% Free",
      description: "Write and receive letters at no cost, with unlimited storage.",
      icon: "✨"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} 
              className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-gray-800 rounded-2xl p-10 shadow-lg shadow-black/50 transition duration-300
                hover:shadow-xl hover:-translate-y-1 border border-gray-700">
                <div className="text-5xl mb-6 transform transition duration-300 group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-200 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features; 