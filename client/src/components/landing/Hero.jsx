const Hero = () => {
  const handleGetStarted = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="home"
      className="flex min-h-[350px] items-center justify-center bg-blue-50 px-5 py-16 sm:min-h-[400px] sm:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Simple Lead Management
        </span>

        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Welcome to <span className="text-blue-600">LeadDesk Mini</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          Capture customer enquiries, manage leads, and track your business
          opportunities—all in one place.
        </p>

        <button
          type="button"
          onClick={handleGetStarted}
          className="mt-7 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;