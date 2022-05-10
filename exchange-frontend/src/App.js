import "./App.css";
import { useState } from "react";
import { Box, Icon, IconButton, List, ListItem, Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { AppBar } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { getUserToken, saveUserToken, clearUserToken } from "./localStorage";
import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import LoginDialog from "./UserCredentialsDialog/LoginDialog";
import RegisterDialog from "./UserCredentialsDialog/RegisterDialog";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import Profile from "./Pages/Profile";
import NavbarComponent from "./navbarComponent";
import AdminHome from "./Pages/AdminHome";
import Shop from "./Pages/Shop";

var SERVER_URL = "http://127.0.0.1:5000";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
