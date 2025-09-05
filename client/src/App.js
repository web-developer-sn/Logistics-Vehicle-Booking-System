import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddVehicle from "./pages/AddVehicle";
import SearchBook from "./pages/SearchBook";
import "./App.css";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h1 className="logo">FleetLink</h1>
        <div className="nav-links">
          <Link to="/add-vehicle">Add Vehicle</Link>
          <Link to="/search-book">Search & Book</Link>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/search-book" element={<SearchBook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
