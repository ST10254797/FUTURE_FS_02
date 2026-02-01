import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

/* Improved debounce */
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({ name: "", email: "", source: "" });

  const [isSaving, setIsSaving] = useState(null);

  /* ✅ BONUS: Search + Filter */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* Fetch leads */
  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("❌ ERROR FETCHING LEADS:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* Add lead */
  const addLead = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/leads", newLead);
      setNewLead({ name: "", email: "", source: "" });
      fetchLeads();
    } catch (err) {
      console.error("❌ ERROR ADDING LEAD:", err);
    }
  };

  /* Update lead */
  const updateLead = async (id, status, notes) => {
    setIsSaving(id);

    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, {
        status,
        notes,
      });

      /* Local update */
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status, notes } : l))
      );
    } catch (err) {
      console.error("❌ ERROR UPDATING LEAD:", err);
    } finally {
      setTimeout(() => setIsSaving(null), 800);
    }
  };

  const debouncedUpdate = useCallback(debounce(updateLead, 1000), []);

  /* Delete lead */
  const deleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        fetchLeads();
      } catch (err) {
        console.error("❌ ERROR DELETING LEAD:", err);
      }
    }
  };

  /* Status Colors */
  const getStatusStyle = (status) => {
    switch (status) {
      case "new":
        return { bg: "#E3F2FD", color: "#1976D2" };
      case "contacted":
        return { bg: "#FFF3E0", color: "#F57C00" };
      case "converted":
        return { bg: "#E8F5E9", color: "#388E3C" };
      default:
        return { bg: "#F5F5F5", color: "#616161" };
    }
  };

  /* ✅ BONUS: Analytics */
  const totalLeads = leads.length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;

  /* ✅ BONUS: Search + Filter Logic */
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Leads Dashboard</h1>
            <p style={styles.subtitle}>
              Manage and track your customer pipeline
            </p>
          </div>
        </header>

        {/* ✅ BONUS: Analytics Cards */}
        <div style={styles.analyticsRow}>
          <div style={styles.analyticsCard}>
            <h3>Total Leads</h3>
            <p>{totalLeads}</p>
          </div>

          <div style={styles.analyticsCard}>
            <h3>Contacted</h3>
            <p>{contactedLeads}</p>
          </div>

          <div style={styles.analyticsCard}>
            <h3>Converted</h3>
            <p>{convertedLeads}</p>
          </div>
        </div>

        {/* Quick Add Form */}
        <section style={styles.formSection}>
          <form onSubmit={addLead} style={styles.form}>
            <input
              style={styles.input}
              type="text"
              placeholder="Full Name"
              value={newLead.name}
              onChange={(e) =>
                setNewLead({ ...newLead, name: e.target.value })
              }
              required
            />

            <input
              style={styles.input}
              type="email"
              placeholder="Email Address"
              value={newLead.email}
              onChange={(e) =>
                setNewLead({ ...newLead, email: e.target.value })
              }
              required
            />

            <input
              style={styles.input}
              type="text"
              placeholder="Source (e.g. LinkedIn)"
              value={newLead.source}
              onChange={(e) =>
                setNewLead({ ...newLead, source: e.target.value })
              }
            />

            <button type="submit" style={styles.addBtn}>
              Add Lead
            </button>
          </form>
        </section>

        {/* ✅ BONUS: Search + Filter */}
        <section style={styles.filterBar}>
          <input
            style={styles.searchInput}
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </section>

        {/* Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name & Contact</th>
                <th style={styles.th}>Source</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}></th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.leadName}>{lead.name}</div>
                    <div style={styles.leadEmail}>{lead.email}</div>
                  </td>

                  <td style={styles.td}>
                    <span style={styles.sourceTag}>
                      {lead.source || "Organic"}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateLead(lead.id, e.target.value, lead.notes)
                      }
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusStyle(lead.status).bg,
                        color: getStatusStyle(lead.status).color,
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>

                  {/* ✅ BONUS: Timestamp */}
                  <td style={styles.td}>
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td style={styles.td}>
                    <div style={{ position: "relative" }}>
                      <textarea
                        defaultValue={lead.notes || ""}
                        onChange={(e) =>
                          debouncedUpdate(
                            lead.id,
                            lead.status,
                            e.target.value
                          )
                        }
                        style={styles.textarea}
                        placeholder="Click to add notes..."
                      />
                      {isSaving === lead.id && (
                        <span style={styles.savingTag}>Saving...</span>
                      )}
                    </div>
                  </td>

                  <td style={styles.td}>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="6" style={styles.emptyRow}>
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* Styles */
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F8F9FA",
    padding: "40px 20px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1A202C",
    margin: 0,
  },
  subtitle: {
    color: "#718096",
    marginTop: "4px",
  },

  analyticsRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  formSection: {
    backgroundColor: "#FFF",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "200px",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
  },
  addBtn: {
    backgroundColor: "#2D3748",
    color: "#FFF",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 2,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
  },
  filterSelect: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
  },

  tableWrapper: {
    backgroundColor: "#FFF",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "16px",
    backgroundColor: "#F7FAFC",
    fontSize: "12px",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  tr: {
    borderBottom: "1px solid #EDF2F7",
  },
  td: {
    padding: "16px",
  },
  leadName: {
    fontWeight: "600",
  },
  leadEmail: {
    fontSize: "13px",
    color: "#718096",
  },
  sourceTag: {
    padding: "4px 8px",
    backgroundColor: "#EDF2F7",
    borderRadius: "6px",
    fontSize: "12px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "99px",
    border: "none",
    fontWeight: "700",
  },
  textarea: {
    width: "100%",
    borderRadius: "8px",
    padding: "8px",
    border: "1px solid #EDF2F7",
    resize: "none",
  },
  savingTag: {
    fontSize: "10px",
    color: "#388E3C",
  },
  deleteBtn: {
    color: "#E53E3E",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  emptyRow: {
    padding: "20px",
    textAlign: "center",
    color: "#718096",
  },
};

export default LeadsDashboard;
