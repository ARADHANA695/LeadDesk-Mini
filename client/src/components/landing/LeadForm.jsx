import { useState } from "react";
import { createLead } from "../../api/leadApi";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "",
};

const LeadForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const { name, email, phone, company, source } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !company.trim() ||
      !source
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await createLead({
        ...formData,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
      });

      setSuccess(
        res.data?.message || "Lead submitted successfully!"
      );

      setFormData(initialFormData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your lead. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Get in Touch
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Let's Talk About Your Project
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
            Submit your details to add a new lead to our management system.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={inputStyle}
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
                autoComplete="email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyle}
                autoComplete="tel"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-semibold text-slate-700">
                Company *
              </label>
              <input
                id="company"
                type="text"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
                className={inputStyle}
                autoComplete="organization"
                required
              />
            </div>

            {/* Source */}
            <div>
              <label htmlFor="source" className="mb-2 block text-sm font-semibold text-slate-700">
                Lead Source *
              </label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={inputStyle}
                required
              >
                <option value="">Select lead source</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            {success && (
              <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Lead"}
            </button>

            <p className="text-center text-xs text-slate-400">
              Required fields are marked with an asterisk (*).
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;