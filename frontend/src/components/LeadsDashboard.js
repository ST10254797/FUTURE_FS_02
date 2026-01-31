import React, { useEffect, useState } from "react";
import axios from "axios";

// Simple debounce function
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);

  // Fetch leads from backend
  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("❌ ERROR FETCHING LEADS:", err);
    }
  };

  // Load leads on page load
  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead status or notes
  const updateLead = async (id, status, notes) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, {
        status,
        notes,
      });
      fetchLeads(); // refresh table
    } catch (err) {
      console.error("❌ ERROR UPDATING LEAD:", err);
    }
  };

  // Debounced version for notes (wait 1 second after typing)
  const debouncedUpdate = debounce(updateLead, 1000);

  // Delete lead
  const deleteLead = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error("❌ ERROR DELETING LEAD:", err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Mini CRM Dashboard</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Source</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.source}</td>

              {/* Status dropdown */}
              <td>
                <select
                  value={lead.status}
                  onChange={(e) =>
                    updateLead(lead.id, e.target.value, lead.notes)
                  }
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </td>

              {/* Notes textarea */}
              <td>
                <textarea
                  defaultValue={lead.notes || ""}
                  onChange={(e) =>
                    debouncedUpdate(lead.id, lead.status, e.target.value)
                  }
                  rows={2}
                  cols={20}
                />
              </td>

              {/* Delete button */}
              <td>
                <button onClick={() => deleteLead(lead.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsDashboard;
