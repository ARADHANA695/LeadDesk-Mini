import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const [leads, setLeads] = useState([]);
const [search, setSearch] = useState("");
const [filterStatus, setFilterStatus] = useState("All");

// Pagination and sorting
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalLeads, setTotalLeads] = useState(0);
const [statusCounts, setStatusCounts] = useState({
  New: 0,
  Contacted: 0,
  Qualified: 0,
  Lost: 0,
});
const [sortOrder, setSortOrder] = useState("newest");
const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [editingLead, setEditingLead] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Fetch all leads
  const fetchLeads = useCallback(async () => {
 try {
  setLoading(true);
  setError("");

    const res = await axios.get(
      `http://localhost:8000/api/leads?page=${currentPage}&limit=${limit}&sort=${sortOrder}`,
      authConfig()
    );

    setLeads(Array.isArray(res.data.leads) ? res.data.leads : []);
    setTotalPages(res.data.totalPages || 1);
    setTotalLeads(res.data.totalLeads || 0);
    setStatusCounts(
  res.data.statusCounts || {
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Lost: 0,
  }
);
  } catch (err) {
    console.error("Fetch leads error:", err);
    setError("Unable to load leads. Please check your server connection.");
  } finally {
    setLoading(false);
  }
}, [currentPage, limit, sortOrder]);

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchLeads();
  }, [navigate, fetchLeads]);

    // Open lead for editing
  const handleEdit = (lead) => {
    setEditingLead({
      _id: lead._id,
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source || "Website",
      status: lead.status || "New",
    });
  };

  // Save edited lead
const handleSaveEdit = async (e) => {
  e.preventDefault();

  try {
    setSavingEdit(true);

    await axios.put(
      `http://localhost:8000/api/leads/${editingLead._id}`,
      {
        name: editingLead.name,
        email: editingLead.email,
        phone: editingLead.phone,
        company: editingLead.company,
        source: editingLead.source,
        status: editingLead.status,
      },
      authConfig()
    );

    setEditingLead(null);
    await fetchLeads();

    alert("Lead updated successfully.");
  } catch (err) {
    console.error("Edit lead error:", err);
    alert(err.response?.data?.message || "Unable to update lead.");
  } finally {
    setSavingEdit(false);
  }
};
  // Update lead status
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

    await axios.put(
  `http://localhost:8000/api/leads/${id}`,
  { status },
  authConfig()
);

      await fetchLeads();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete lead
  const deleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

   await axios.delete(
  `http://localhost:8000/api/leads/${id}`,
  authConfig()
);

      setLeads((previousLeads) =>
        previousLeads.filter((lead) => lead._id !== id)
      );
    } catch (err) {
      console.error("Delete lead error:", err);
      alert("Failed to delete lead. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // Search filter
 const filteredLeads = leads.filter((lead) => {
  const name = (lead.name || "").toLowerCase();
  const email = (lead.email || "").toLowerCase();
  const query = search.trim().toLowerCase();

  const matchesSearch =
    name.includes(query) || email.includes(query);

  const matchesStatus =
    filterStatus === "All" || lead.status === filterStatus;

  return matchesSearch && matchesStatus;
});

  // Dashboard statistics
const statistics = [
  {
    label: "Total Leads",
    value: totalLeads,
    icon: "▤",
    color: "#2563eb",
    background: "#eff6ff",
  },
  {
    label: "New Leads",
    value: statusCounts.New,
    icon: "✦",
    color: "#7c3aed",
    background: "#f5f3ff",
  },
  {
    label: "Contacted",
    value: statusCounts.Contacted,
    icon: "↗",
    color: "#0369a1",
    background: "#e0f2fe",
  },
  {
    label: "Qualified",
    value: statusCounts.Qualified,
    icon: "✓",
    color: "#047857",
    background: "#d1fae5",
  },
  {
    label: "Lost",
    value: statusCounts.Lost,
    icon: "◉",
    color: "#b45309",
    background: "#fef3c7",
  },
];

  const getStatusStyle = (status) => {
    const styles = {
      New: {
        color: "#1d4ed8",
        background: "#dbeafe",
      },
      Contacted: {
        color: "#0369a1",
        background: "#e0f2fe",
      },
      Qualified: {
        color: "#047857",
        background: "#d1fae5",
      },
      Lost: {
        color: "#92400e",
        background: "#fef3c7",
      },
    };

    return styles[status] || {
      color: "#475569",
      background: "#f1f5f9",
    };
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f5f7fb",
      color: "#172033",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    sidebar: {
      width: "250px",
      minHeight: "100vh",
      background: "#ffffff",
      borderRight: "1px solid #e8edf5",
      padding: "28px 20px",
      boxSizing: "border-box",
      position: "fixed",
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      zIndex: 10,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "45px",
    },
    brandIcon: {
      width: "43px",
      height: "43px",
      borderRadius: "13px",
      background: "#2563eb",
      color: "#ffffff",
      display: "grid",
      placeItems: "center",
      fontSize: "23px",
      fontWeight: "800",
      boxShadow: "0 5px 14px rgba(37, 99, 235, 0.2)",
    },
    navLabel: {
      color: "#94a3b8",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
      margin: "0 0 14px 10px",
    },
    navItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "13px 14px",
      borderRadius: "10px",
      background: "#eff6ff",
      color: "#2563eb",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    sidebarBottom: {
      marginTop: "auto",
      padding: "17px 13px",
      border: "1px solid #e8edf5",
      borderRadius: "12px",
      background: "#f8fafc",
    },
    main: {
      marginLeft: "250px",
      padding: "30px 34px",
      boxSizing: "border-box",
      minWidth: 0,
    },
    topbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "18px",
      flexWrap: "wrap",
      marginBottom: "30px",
    },
    heading: {
      margin: 0,
      fontSize: "28px",
      fontWeight: "750",
      letterSpacing: "-0.8px",
      color: "#172033",
    },
    subtitle: {
      margin: "8px 0 0",
      fontSize: "14px",
      color: "#718096",
    },
    logoutButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "11px 17px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      color: "#dc2626",
      fontSize: "13px",
      fontWeight: "650",
      cursor: "pointer",
    },
    sectionTitle: {
      fontSize: "17px",
      fontWeight: "700",
      margin: "0 0 18px",
      color: "#1e293b",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "17px",
      marginBottom: "32px",
    },
    statCard: {
      background: "#ffffff",
      border: "1px solid #e9eef5",
      borderRadius: "15px",
      padding: "21px",
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.025)",
      minWidth: 0,
    },
    statTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "8px",
      marginBottom: "19px",
    },
    statIcon: {
      width: "40px",
      height: "40px",
      display: "grid",
      placeItems: "center",
      borderRadius: "12px",
      fontSize: "21px",
      fontWeight: "700",
    },
    statValue: {
      fontSize: "30px",
      lineHeight: 1.2,
      fontWeight: "750",
      letterSpacing: "-1px",
      margin: 0,
      color: "#172033",
    },
    statLabel: {
      fontSize: "13px",
      color: "#718096",
      fontWeight: "500",
      margin: "8px 0 0",
    },
    panel: {
      background: "#ffffff",
      border: "1px solid #e9eef5",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.025)",
      overflow: "hidden",
    },
    panelHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      padding: "23px 24px",
      borderBottom: "1px solid #edf1f7",
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "0 13px",
      background: "#ffffff",
      width: "min(100%, 320px)",
      boxSizing: "border-box",
    },
    searchInput: {
      width: "100%",
      border: "none",
      outline: "none",
      padding: "12px 0",
      color: "#334155",
      fontSize: "13px",
      background: "transparent",
      minWidth: 0,
    },
    tableWrapper: {
      width: "100%",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      minWidth: "900px",
      borderCollapse: "collapse",
      textAlign: "left",
    },
    th: {
      background: "#f8fafc",
      padding: "15px 20px",
      color: "#64748b",
      fontSize: "11px",
      fontWeight: "750",
      textTransform: "uppercase",
      letterSpacing: "0.7px",
      whiteSpace: "nowrap",
      borderBottom: "1px solid #edf1f7",
    },
    td: {
      padding: "17px 20px",
      borderBottom: "1px solid #f0f3f8",
      fontSize: "13px",
      color: "#475569",
      verticalAlign: "middle",
    },
    statusSelect: {
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "8px 10px",
      fontSize: "12px",
      fontWeight: "600",
      background: "#ffffff",
      color: "#334155",
      cursor: "pointer",
      maxWidth: "140px",
    },
    deleteButton: {
      border: "1px solid #fee2e2",
      borderRadius: "8px",
      padding: "8px 12px",
      background: "#fff7f7",
      color: "#dc2626",
      fontSize: "12px",
      fontWeight: "650",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    emptyState: {
      padding: "55px 20px",
      textAlign: "center",
      color: "#64748b",
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .ld-stat-card {
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .ld-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 24px rgba(15, 23, 42, 0.07) !important;
        }

        .ld-table-row:hover {
          background: #fafcff;
        }

        .ld-logout:hover {
          background: #fff1f2 !important;
        }

        .ld-delete:hover {
          background: #fee2e2 !important;
        }

        .ld-search:focus-within {
          border-color: #93b4ff !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .ld-status:disabled,
        .ld-delete:disabled {
          opacity: 0.6;
          cursor: wait !important;
        }
          /* Desktop layout width fix */
.ld-main {
  width: calc(100% - 240px) !important;
  max-width: calc(100% - 240px) !important;
  min-width: 0 !important;
}

.ld-stats-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: 100%;
  min-width: 0;
}

.ld-stat-card {
  min-width: 0;
}

.ld-panel-header {
  flex-wrap: wrap;
  min-width: 0;
}

        @media (max-width: 1000px) {
          .ld-sidebar {
            width: 205px !important;
            padding: 24px 15px !important;
          }

          .ld-main {
            margin-left: 205px !important;
            padding: 25px 22px !important;
          }
            .ld-main {
            width: calc(100% - 205px) !important;
            max-width: calc(100% - 205px) !important;
            min-width: 0 !important;
         }
        }

        @media (max-width: 700px) {
          .ld-sidebar {
            position: static !important;
            width: 100% !important;
            min-height: auto !important;
            padding: 15px 20px !important;
            border-right: none !important;
            border-bottom: 1px solid #e8edf5;
          }

          .ld-brand {
            margin-bottom: 15px !important;
          }

          .ld-nav-label,
          .ld-sidebar-bottom {
            display: none !important;
          }

          .ld-nav-item {
            margin: 0 !important;
            padding: 10px 12px !important;
          }

          .ld-main {
            margin-left: 0 !important;
            padding: 23px 15px !important;
          }

          .ld-heading {
            font-size: 24px !important;
          }

          .ld-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }

          .ld-stat-card {
            padding: 16px !important;
          }

          .ld-stat-value {
            font-size: 26px !important;
          }

          .ld-panel-header {
            padding: 18px !important;
          }

          .ld-search {
            width: 100% !important;
          }
            /* Mobile dashboard width */
.ld-main {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  margin-left: 0 !important;
  overflow-x: hidden;
}

/* Stack filters and search vertically */
.ld-panel-header {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 12px !important;
}

.ld-panel-header select {
  width: 100% !important;
}

.ld-search {
  width: 100% !important;
  min-width: 0 !important;
}

/* Keep table scrolling inside its container */
.ld-table-wrapper {
  width: 100%;
  max-width: 100%;
  overflow-x: auto !important;
}

.ld-table-wrapper table {
  min-width: 700px;
}
        }
           @media (max-width: 360px) {
          .ld-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="ld-sidebar" style={styles.sidebar}>
        <div className="ld-brand" style={styles.brand}>
          <div style={styles.brandIcon}>L</div>

          <div>
            <div
              style={{
                fontSize: "19px",
                fontWeight: "800",
                letterSpacing: "-0.6px",
                color: "#172033",
              }}
            >
              LeadDesk
            </div>

            <div
              style={{
                fontSize: "10px",
                fontWeight: "600",
                color: "#94a3b8",
                letterSpacing: "1.5px",
                marginTop: "3px",
              }}
            >
              LEAD MANAGEMENT
            </div>
          </div>
        </div>

        <div className="ld-nav-label" style={styles.navLabel}>
          WORKSPACE
        </div>

        <div className="ld-nav-item" style={styles.navItem}>
          <span style={{ fontSize: "19px" }}>▦</span>
          Dashboard
        </div>

        <div style={{ marginTop: "30px" }}>
          <div style={styles.navLabel}>ACCOUNT</div>

          <button
            className="ld-logout"
            onClick={logout}
            style={{
              ...styles.logoutButton,
              width: "100%",
              justifyContent: "flex-start",
              border: "none",
              background: "transparent",
            }}
          >
            <span style={{ fontSize: "17px" }}>↪</span>
            Sign out
          </button>
        </div>

        <div className="ld-sidebar-bottom" style={styles.sidebarBottom}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#334155",
              marginBottom: "6px",
            }}
          >
            LeadDesk Workspace
          </div>

          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
            Lead management made simple.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginTop: "15px",
              fontSize: "11px",
              color: "#047857",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
            Workspace active
          </div>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="ld-main" style={styles.main}>
        {/* Header */}
        <header className="ld-topbar" style={styles.topbar}>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              WORKSPACE / DASHBOARD
            </div>

            <h1 className="ld-heading" style={styles.heading}>
              Admin Dashboard
            </h1>

            <p style={styles.subtitle}>
              Manage your leads and track their progress.
            </p>
          </div>

          <button
            className="ld-logout"
            onClick={logout}
            style={styles.logoutButton}
          >
            <span style={{ fontSize: "16px" }}>↪</span>
            Logout
          </button>
        </header>

        {/* Statistics */}
        <section>
          <h2 style={styles.sectionTitle}>Overview</h2>

          <div className="ld-stats-grid" style={styles.statsGrid}>
            {statistics.map((stat) => (
              <div
                key={stat.label}
                className="ld-stat-card"
                style={styles.statCard}
              >
                <div style={styles.statTop}>
                  <span style={styles.statLabel}>{stat.label}</span>

                  <span
                    style={{
                      ...styles.statIcon,
                      color: stat.color,
                      background: stat.background,
                    }}
                  >
                    {stat.icon}
                  </span>
                </div>

                <h3 style={styles.statValue}>{stat.value}</h3>

                <p style={styles.statLabel}>Current records</p>
              </div>
            ))}
          </div>
        </section>

        {/* Edit Lead Form */}
{editingLead && (
  <section
    style={{
      ...styles.panel,
      padding: "24px",
      marginBottom: "25px",
    }}
  >
    <h2 style={styles.sectionTitle}>Edit Lead</h2>

    <form onSubmit={handleSaveEdit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >
        {["name", "email", "phone", "company"].map((field) => (
          <div key={field}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>

            <input
              required
              type={field === "email" ? "email" : "text"}
              value={editingLead[field]}
              onChange={(e) =>
                setEditingLead({
                  ...editingLead,
                  [field]: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "11px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
          </div>
        ))}

        <div>
          <label style={{ display: "block", marginBottom: "7px", fontSize: "13px", fontWeight: "600" }}>
            Source
          </label>

          <select
            required
            value={editingLead.source}
            onChange={(e) =>
              setEditingLead({
                ...editingLead,
                source: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "11px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "13px",
              background: "#fff",
            }}
          >
            <option value="Website">Website</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "7px", fontSize: "13px", fontWeight: "600" }}>
            Status
          </label>

          <select
            value={editingLead.status}
            onChange={(e) =>
              setEditingLead({
                ...editingLead,
                status: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "11px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "13px",
              background: "#fff",
            }}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
        <button
          type="submit"
          disabled={savingEdit}
          style={{
            padding: "11px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {savingEdit ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => setEditingLead(null)}
          style={{
            padding: "11px 20px",
            background: "#f1f5f9",
            color: "#475569",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  </section>
)}

        {/* Leads Table */}
        <section style={styles.panel}>
          <div className="ld-panel-header" style={styles.panelHeader}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: "750",
                  color: "#1e293b",
                }}
              >
                All Leads
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "#94a3b8",
                }}
              >
                View and manage your customer enquiries
              </p>
            </div>

            <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
            padding: "11px 13px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#334155",
            fontSize: "13px",
            outline: "none",
            cursor: "pointer",
            }}
           aria-label="Filter leads by status"
     >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
         <option value="Qualified">Qualified</option>
         <option value="Lost">Lost</option>
         </select>

         <select
  value={sortOrder}
  onChange={(e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  }}
  aria-label="Sort leads"
  style={{
    padding: "11px 13px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  }}
>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
</select>

            <div className="ld-search" style={styles.searchBox}>
              <span style={{ fontSize: "18px", color: "#94a3b8" }}>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search leads by name or email"
                style={styles.searchInput}
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Table information */}
          <div
            style={{
              padding: "13px 24px",
              background: "#ffffff",
              borderBottom: "1px solid #edf1f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Showing{" "}
              <strong style={{ color: "#334155" }}>
                {filteredLeads.length}
              </strong>{" "}
              of{" "}
              <strong style={{ color: "#334155" }}>{leads.length}</strong>{" "}
              leads
            </span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#047857",
                fontSize: "11px",
                fontWeight: "650",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                }}
              />
              Lead management
            </span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={{ minWidth: "1050px" }}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Source</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyState}>
                      <div style={{ fontSize: "15px", fontWeight: "600" }}>
                        Loading leads...
                      </div>
                      <p style={{ fontSize: "12px" }}>
                        Please wait while we retrieve your records.
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyState}>
                      <div
                        style={{
                          color: "#dc2626",
                          fontWeight: "600",
                          marginBottom: "12px",
                        }}
                      >
                        {error}
                      </div>

                      <button
                        onClick={() => {
                          setLoading(true);
                          fetchLeads();
                        }}
                        style={{
                          padding: "10px 15px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#2563eb",
                          color: "#ffffff",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Try Again
                      </button>
                    </td>
                  </tr>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id} className="ld-table-row">
                      {/* Customer */}
                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "11px",
                            minWidth: "170px",
                          }}
                        >
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              flexShrink: 0,
                              borderRadius: "11px",
                              background: "#eff6ff",
                              color: "#2563eb",
                              display: "grid",
                              placeItems: "center",
                              fontSize: "14px",
                              fontWeight: "750",
                            }}
                          >
                            {(lead.name || "?").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight: "700",
                                color: "#1e293b",
                                marginBottom: "5px",
                              }}
                            >
                              {lead.name || "Unnamed"}
                            </div>

                            <div
                              style={{
                                fontSize: "12px",
                                color: "#94a3b8",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {lead.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>

                     {/* Phone */}
<td style={styles.td}>
  <span style={{ whiteSpace: "nowrap", color: "#334155" }}>
    {lead.phone || "—"}
  </span>
</td>

{/* Company */}
<td style={styles.td}>
  <span style={{ color: "#334155", fontWeight: "600" }}>
    {lead.company || "—"}
  </span>
</td>

{/* Source */}
<td style={styles.td}>
  <span
    style={{
      background: "#f1f5f9",
      color: "#475569",
      padding: "6px 9px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "600",
      whiteSpace: "nowrap",
    }}
  >
    {lead.source || "—"}
  </span>
</td>
                      {/* Status */}
                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              ...getStatusStyle(lead.status),
                              borderRadius: "6px",
                              padding: "5px 9px",
                              fontSize: "10px",
                              fontWeight: "750",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {lead.status || "New"}
                          </span>

                          <select
                            className="ld-status"
                            value={lead.status || "New"}
                            disabled={updatingId === lead._id}
                            onChange={(e) =>
                              updateStatus(lead._id, e.target.value)
                            }
                            aria-label={`Update status for ${lead.name || "lead"}`}
                            style={styles.statusSelect}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                          </select>

                          {updatingId === lead._id && (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#64748b",
                              }}
                            >
                              Saving...
                            </span>
                          )}
                        </div>
                      </td>

                     {/* Actions */}
<td style={styles.td}>
  <div style={{ display: "flex", gap: "8px" }}>
    <button
      onClick={() => handleEdit(lead)}
      style={{
        border: "1px solid #dbeafe",
        borderRadius: "8px",
        padding: "8px 12px",
        background: "#eff6ff",
        color: "#2563eb",
        fontSize: "12px",
        fontWeight: "650",
        cursor: "pointer",
      }}
    >
      Edit
    </button>

    <button
      className="ld-delete"
      disabled={deletingId === lead._id}
      onClick={() => deleteLead(lead._id)}
      style={styles.deleteButton}
    >
      {deletingId === lead._id ? "Deleting..." : "Delete"}
    </button>
  </div>
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={styles.emptyState}>
                      <div
                        style={{
                          width: "55px",
                          height: "55px",
                          display: "grid",
                          placeItems: "center",
                          margin: "0 auto 15px",
                          borderRadius: "16px",
                          background: "#eff6ff",
                          color: "#2563eb",
                          fontSize: "25px",
                        }}
                      >
                        ⌕
                      </div>

                      <div
                        style={{
                          color: "#334155",
                          fontSize: "15px",
                          fontWeight: "700",
                        }}
                      >
                        {search ? "No matching leads" : "No leads yet"}
                      </div>

                      <p
                        style={{
                          fontSize: "12px",
                          lineHeight: "1.7",
                          maxWidth: "320px",
                          margin: "8px auto 0",
                        }}
                      >
                        {search
                          ? "Try searching with another name or email address."
                          : "New customer enquiries will appear here when submitted."}
                      </p>

                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          style={{
                            marginTop: "12px",
                            border: "none",
                            background: "transparent",
                            color: "#2563eb",
                            fontWeight: "650",
                            cursor: "pointer",
                          }}
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
                    </div>

          {/* Pagination Controls */}
          <div
            style={{
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              borderTop: "1px solid #edf1f7",
            }}
          >
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Showing {leads.length} of {totalLeads} leads
              {" · "}
              Page {currentPage} of {totalPages}
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((page) => page - 1)}
                style={{
                  padding: "9px 15px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: "#ffffff",
                  color: "#334155",
                  cursor: "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                Previous
              </button>

              <button
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((page) => page + 1)}
                style={{
                  padding: "9px 15px",
                  border: "1px solid #2563eb",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer",
                  opacity: currentPage >= totalPages ? 0.5 : 1,
                }}
              >
                Next
              </button>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #edf1f7",
              background: "#ffffff",
              color: "#94a3b8",
              fontSize: "11px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <span>LeadDesk Mini · Admin Workspace</span>
            <span>Lead management dashboard</span>
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "11px",
            padding: "25px 0 5px",
          }}
        >
          LeadDesk Mini · Lead Management System
        </footer>
      </main>
    </div>
  );
};

export default Admin;