import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { PageAdminDashboard } from "./pages/PageAdminDashboard";
import { PageRhDashboard } from "./pages/pageRhDashboard";
import { PageEmployeeDashboard } from "./pages/pageEmployedashboard";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<PageAdminDashboard />} />
      

        <Route path="/rh" element={<PageRhDashboard />} />
        <Route path="/employee" element={<PageEmployeeDashboard />} />
      </Routes>
    </Router>
  );
}
