import "../App.css";
import { useEffect, useState } from "react";
import {
  createTheme,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Box,
  ThemeProvider,
} from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { getUserToken } from "../localStorage";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import React, { useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import { color } from "@mui/system";
import NavbarComponent from "../navbarComponent";
var SERVER_URL = "http://127.0.0.1:5000";

let theme = createTheme({
  palette: {
    primary: {
      main: "#336799",
    },
    secondary: {
      main: "#336799",
    },
  },
});

function Profile() {
  let [userToken, setUserToken] = useState(getUserToken());
  let [userTransactions, setUserTransactions] = useState([]);

  const columns: GridColDef[] = [
    { field: "added_date", headerName: "Added Time", width: 150 },
    { field: "lbp_amount", headerName: "LBP Amount", width: 150 },
    { field: "usd_amount", headerName: "USD Amount", width: 150 },
    { field: "usd_to_lbp", headerName: "USD to LBP", width: 100 },
  ];

  const fetchUserTransactions = useCallback(() => {
    fetch(`${SERVER_URL}/transaction`, {
      headers: {
        Authorization: `bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((transactions) => setUserTransactions(transactions));
  }, [userToken]);
  useEffect(() => {
    if (userToken) {
      fetchUserTransactions();
    }
  }, [fetchUserTransactions, userToken]);

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="row">
        <Box flexGrow={0}>
          <NavbarComponent />
        </Box>

        <Box className="mainContent" flexGrow={1}>
          <Box
            display="flex"
            flexDirection="row"
            sx={{ alignItems: "cetner", justifyContent: "center" }}
          >
            <Typography
              sx={{ color: "#336899", fontWeight: "bolder", margin: "2rem" }}
              variant="h4"
            >
              PROFILE
            </Typography>
          </Box>

          <div className="wrapper">
            <Typography variant="h5" marginBottom={"2rem"}>
              Your Information
            </Typography>

            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant="body">Username: </Typography>
              <Typography variant="body">Balance: </Typography>
            </Box>

            
          </div>

          <div className="wrapper">
            <Typography variant="h5" marginBottom={"2rem"}>
              Your Transactions
            </Typography>
            <DataGrid
              className="data"
              columns={columns}
              rows={userTransactions}
              autoHeight
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default Profile;
