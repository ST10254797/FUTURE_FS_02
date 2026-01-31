import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Improved debounce for better React integration
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
  const [isSaving, setIsSaving] = useState(null); // Track which ID is saving

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

  const updateLead = async (id, status, notes) => {
    setIsSaving(id);
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, { status, notes });
      // Minor UX: local update to avoid a full table flicker
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status, notes } : l))
      );
    } catch (err) {
      console.error("❌ ERROR UPDATING LEAD:", err);
    } finally {
      setTimeout(() => setIsSaving(null), 1000); // Visual feedback
    }
  };

  const debouncedUpdate = useCallback(debounce(updateLead, 1000), []);

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "new": return { bg: "#E3F2FD", color: "#1976D2" };
      case "contacted": return { bg: "#FFF3E0", color: "#F57C00" };
      case "converted": return { bg: "#E8F5E9", color: "#388E3C" };
      default: return { bg: "#F5F5F5", color: "#616161" };
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Leads Dashboard</h1>
            <p style={styles.subtitle}>Manage and track your customer pipeline</p>
          </div>
          <div style={styles.statsCard}>
            <span style={styles.statsLabel}>Total Leads</span>
            <span style={styles.statsValue}>{leads.length}</span>
          </div>
        </header>

        {/* Quick Add Form */}
        <section style={styles.formSection}>
          <form onSubmit={addLead} style={styles.form}>
            <input
              style={styles.input}
              type="text"
              placeholder="Full Name"
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              required
            />
            <input
              style={styles.input}
              type="email"
              placeholder="Email Address"
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Source (e.g. LinkedIn)"
              value={newLead.source}
              onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
            />
            <button type="submit" style={styles.addBtn}>Add Lead</button>
          </form>
        </section>

        {/* Table Container */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name & Contact</th>
                <th style={styles.th}>Source</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.leadName}>{lead.name}</div>
                    <div style={styles.leadEmail}>{lead.email}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.sourceTag}>{lead.source || "Organic"}</span>
                  </td>
                  <td style={styles.td}>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLead(lead.id, e.target.value, lead.notes)}
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
                  <td style={styles.td}>
                    <div style={{ position: "relative" }}>
                      <textarea
                        defaultValue={lead.notes || ""}
                        onChange={(e) => debouncedUpdate(lead.id, lead.status, e.target.value)}
                        style={styles.textarea}
                        placeholder="Click to add notes..."
                      />
                      {isSaving === lead.id && <span style={styles.savingTag}>Saving...</span>}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => deleteLead(lead.id)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: "100vh", backgroundColor: "#F8F9FA", padding: "40px 20px" },
  container: { maxWidth: "1100px", margin: "0 auto", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" },
  title: { fontSize: "28px", fontWeight: "800", color: "#1A202C", margin: 0 },
  subtitle: { color: "#718096", marginTop: "4px" },
  statsCard: { backgroundColor: "#FFF", padding: "12px 24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", textAlign: "right" },
  statsLabel: { display: "block", fontSize: "12px", color: "#A0AEC0", textTransform: "uppercase", fontWeight: "600" },
  statsValue: { fontSize: "24px", fontWeight: "700", color: "#4A5568" },
  formSection: { backgroundColor: "#FFF", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", marginBottom: "24px" },
  form: { display: "flex", gap: "12px", flexWrap: "wrap" },
  input: { flex: 1, minWidth: "200px", padding: "12px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", fontSize: "14px" },
  addBtn: { backgroundColor: "#2D3748", color: "#FFF", padding: "12px 24px", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer" },
  tableWrapper: { backgroundColor: "#FFF", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "16px 24px", backgroundColor: "#F7FAFC", color: "#718096", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", borderBottom: "1px solid #EDF2F7" },
  tr: { borderBottom: "1px solid #F7FAFC", transition: "background 0.2s" },
  td: { padding: "16px 24px", verticalAlign: "middle" },
  leadName: { fontWeight: "600", color: "#2D3748" },
  leadEmail: { fontSize: "13px", color: "#718096" },
  sourceTag: { padding: "4px 8px", backgroundColor: "#EDF2F7", borderRadius: "4px", fontSize: "12px", color: "#4A5568" },
  statusBadge: { padding: "6px 12px", borderRadius: "99px", border: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", appearance: "none" },
  textarea: { width: "100%", border: "1px solid #EDF2F7", borderRadius: "8px", padding: "8px", fontSize: "13px", resize: "none", outline: "none", backgroundColor: "#FAFBFC" },
  savingTag: { position: "absolute", right: "8px", bottom: "-15px", fontSize: "10px", color: "#388E3C", fontWeight: "600" },
  deleteBtn: { color: "#E53E3E", background: "none", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "13px" }
};

export default LeadsDashboard;