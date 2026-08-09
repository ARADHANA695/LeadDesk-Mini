import { useState } from "react";
import { createLead } from "../../api/leadApi";

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.name ||
    !formData.email ||
    !formData.budget ||
    !formData.message
  ) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await createLead(formData);

    alert(res.data.message);

    setFormData({
      name: "",
      email: "",
      budget: "",
      message: "",
    });
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
    console.error(error);
  }
};

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Contact Us
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Budget</option>
            <option value="Below ₹10,000">Below ₹10,000</option>
            <option value="₹10,000 - ₹50,000">₹10,000 - ₹50,000</option>
            <option value="Above ₹50,000">Above ₹50,000</option>
          </select>

          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Submit Lead
          </button>

        </form>
      </div>
    </section>
  );
};

export default LeadForm;