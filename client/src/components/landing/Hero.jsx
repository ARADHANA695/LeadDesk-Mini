const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to LeadDesk Mini
        </h1>

        <p className="mt-4 text-gray-600">
          Capture and manage your leads with ease.
        </p>

        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;