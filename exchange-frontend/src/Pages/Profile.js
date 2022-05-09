import "../App.css";
import { useEffect, useState } from "react";
import {
  createTheme,
  Box,
  ThemeProvider,
} from "@mui/material";
import { Typography } from "@mui/material";
import { getUserToken } from "../localStorage";
import React, { useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
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
  let [username, setUsername ] = useState("");
  let [lbpBalance, setLbpBalance ] = useState("");
  let [usdBalance, setUsdBalance ] = useState("");

  const columns: GridColDef[] = [
    { field: "added_date", headerName: "Added Time", width: 200 },
    { field: "lbp_amount", headerName: "LBP Amount", width: 150 },
    { field: "usd_amount", headerName: "USD Amount", width: 150 },
    { field: "usd_to_lbp", headerName: "USD to LBP", width: 100 },
  ];

  const columns2: GridColDef[] = [
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

  const fetchInfo = useCallback(() => {
    fetch(`${SERVER_URL}/userInfo`, {
      headers: {
        Authorization: `bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) =>{ setUsername(data.user_name); setLbpBalance(data.balance_lbp) ; setUsdBalance(data.balance_usd) });
  }, [userToken]);
  useEffect(() => {
    if (userToken) {
      fetchInfo();
    }
  }, [fetchInfo, userToken]);



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
              <Typography variant="body"> <b>Username:</b> {username} </Typography>
              <Typography variant="body"><b>LBP Balance:</b> {lbpBalance} LBP </Typography>
              <Typography variant="body"><b>USD Balance:</b> ${usdBalance} </Typography>
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
