import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/leads");
      setLeads(res.data.leads);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch leads.");
    }
  };

  // Check Login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchLeads();
  }, []);

  // Update Lead Status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/leads/${id}`, {
        status,
      });

      fetchLeads();
      alert("Status Updated Successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to update status.");
    }
  };

  // Delete Lead
  const deleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/leads/${id}`);

      fetchLeads();
      alert("Lead Deleted Successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to delete lead.");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  // Search Filter
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  );

  // Dashboard Statistics
  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const closedLeads = leads.filter(
    (lead) => lead.status === "Closed"
  ).length;

  // Card Style
  const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

 

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>LeadDesk Admin Dashboard</h1>

        <button
          onClick={logout}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Leads</h3>
          <h2>{totalLeads}</h2>
        </div>

        <div style={cardStyle}>
          <h3>New</h3>
          <h2>{newLeads}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Contacted</h3>
          <h2>{contactedLeads}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Qualified</h3>
          <h2>{qualifiedLeads}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Closed</h3>
          <h2>{closedLeads}</h2>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Name or Email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "350px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
        border="1"
        cellPadding="12"
      >
        <thead
          style={{
            background: "#f3f4f6",
          }}
        >
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Budget</th>
            <th>Message</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.budget}</td>
                <td>{lead.message}</td>

                <td>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(lead._id, e.target.value)
                    }
                    style={{
                      padding: "6px",
                      borderRadius: "5px",
                    }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => deleteLead(lead._id)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No Leads Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;