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
import { useNavigate } from "react-router-dom";
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

function AdminHome() {
  let [buyUsdRate, setBuyUsdRate] = useState(null);
  let [err, setErr] = useState(null);
  let [sellUsdRate, setSellUsdRate] = useState(null);
  let [lbpInput, setLbpInput] = useState("");
  let [usdInput, setUsdInput] = useState("");
  let [userInput, setUserInpt] = useState("");
  let [userToken, setUserToken] = useState(getUserToken());
  let [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  function fetchRates() {
    fetch(SERVER_URL + "/exchangeRate")
      .then((response) => response.json())
      .then((data) => {
        setSellUsdRate(data.usd_to_lbp);
        setBuyUsdRate(data.lbp_to_usd);
      });
  }

  function addMoney() {
    if (userInput == "") {
      setErr("Invalid username");
      return;
    }
    if (usdInput <= 0 && lbpInput <= 0) {
      setErr("Add an amount");
      return;
    }

    let data = {
      amount_usd: usdInput,
      amount_lbp: lbpInput,
      username: userInput,
    };

    setLbpInput(0);
    setUserInpt("");
    setUsdInput(0);

    fetch(SERVER_URL + "/addMoney", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token: " + userToken,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setErr(data.Error);
      });
  }

  useEffect(fetchRates, []);

  let sx_button = {
    backgroundColor: "#C8D6E3",
    color: "white",
    ":hover": { backgroundColor: "#336799" },
    marginLeft: "1rem",
    fontWeight: "600",
  };
  let sx_textField = {
    marginTop: "1rem",
    input: { color: "black", ":focus": { color: "#336799" } },
  };

  const fetchAdmin = useCallback(() => {
    fetch(`${SERVER_URL}/userInfo`, {
      headers: {
        Authorization: `bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.is_admin) {
          navigate("/", { replace: true });
        }
      });
  }, [userToken]);
  useEffect(() => {
    if (userToken) {
      fetchAdmin();
    } else {
      navigate("/", { replace: true });
    }
  }, [fetchAdmin, userToken]);

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="row">
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
              EXHANGE ADMIN
            </Typography>
          </Box>

          <div className="wrapper">
            <Typography variant="h5">Today's Exchange Rate</Typography>

            <Typography variant="body2">LBP to USD Exchange Rate </Typography>

            <Typography variant="h6">
              Sell USD: <span id="sellRate">{sellUsdRate}</span>
            </Typography>

            <Typography variant="h6">
              {" "}
              Buy USD: <span id="buyRate">{buyUsdRate}</span>{" "}
            </Typography>
          </div>

          <div className="wrapper">
            <Typography sx={{ color: "red" }} className="error">
              {err}
            </Typography>

            <Typography variant="h5">Add Money for a User</Typography>

            <form name="transaction-entry">
              <div className="amount-input">
                <TextField
                  id="username"
                  sx={sx_textField}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  type="text"
                  value={userInput}
                  label="Username"
                  onChange={(e) => setUserInpt(e.target.value)}
                />

                <TextField
                  id="lbp-amount"
                  sx={sx_textField}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  type="number"
                  value={lbpInput}
                  label="LBP Amount"
                  onChange={(e) => setLbpInput(e.target.value)}
                />

                <TextField
                  label="USD Amount"
                  sx={sx_textField}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  id="usd-amount"
                  type="number"
                  value={usdInput}
                  onChange={(e) => setUsdInput(e.target.value)}
                />
              </div>
            </form>

            <Button
              id="add-button"
              sx={sx_button}
              variant="containted"
              onClick={addMoney}
            >
              Add
            </Button>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default AdminHome;
