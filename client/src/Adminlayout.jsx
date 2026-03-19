import React from "react";
import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      
      <div style={{
        width: "230px",
        background: "#ff7a00",
        color: "#fff",
        padding: "20px"
      }}>

        <h2>Welcome Admin</h2>

        <p><Link to="/admin/dashboard">Dashboard</Link></p>
        <p><Link to="/admin/foods">Manage Foods</Link></p>
        <p><Link to="/admin/users">Manage Users</Link></p>
        <p><Link to="/admin/orders">Orders</Link></p>
        <p><Link to="/admin/addfood">Add Food</Link></p>
        <p><Link to="/login">Logout</Link></p>

      </div>

      
      <div style={{ flex: 1, padding: "30px" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;
