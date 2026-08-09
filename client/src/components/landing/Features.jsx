const features = [
  {
    title: "Lead Capture",
    description: "Collect leads through a clean and responsive form."
  },
  {
    title: "Secure Dashboard",
    description: "Manage all submitted leads from one admin panel."
  },
  {
    title: "Status Tracking",
    description: "Update lead status as New, Contacted, or Closed."
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800">
          Features
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Everything you need to manage your customer leads.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-blue-600">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;