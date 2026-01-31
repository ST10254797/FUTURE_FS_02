import React, { useState } from "react";
import LeadsDashboard from "./components/LeadsDashboard";
import AdminLogin from "./components/AdminLogin";


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {!loggedIn ? (
        <AdminLogin onLogin={() => setLoggedIn(true)} />
      ) : (
        <LeadsDashboard />
      )}
    </div>
  );
};

export default App;
