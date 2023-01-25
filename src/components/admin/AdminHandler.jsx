import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddProduct from "../addProduct/AddProduct";
import SignUpPage from "../login/SignUpPage";
import './AdminHandler.css'
import { useSelector } from "react-redux";
import BottomNavbar from "../BottomNavbar";

function AdminHandler() {
    const [value, setValue] = useState(0);
    const user = useSelector((state)=> state.user.name);
    const [activeTab, setActiveTab] = useState("addProduct")
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const handleTab = (name) =>{
        setActiveTab(name);
    }
  return (
    <div className="admin-tab-page-main-component">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Add Product" onClick={() => handleTab("addProduct")}/>
          <Tab label="Add User" onClick={() => handleTab("addUser")} />
        </Tabs>
      </Box>
      <div className="admin-handler-components-tab">
        {activeTab === "addProduct" && <AddProduct/>}
        {activeTab === "addUser" && <SignUpPage/>}
      </div>
      {user && <div className="bottom-navbar-component">
          <BottomNavbar/>
        </div>}
    </div>
  );
}

export default AdminHandler;
