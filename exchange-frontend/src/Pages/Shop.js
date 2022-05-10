import "../App.css";
import { useEffect, useState } from "react";
import {
  createTheme,
  TextField,
  Box,
  ThemeProvider,
  ListItem,
  List,
  Select,
  MenuItem,
} from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { getUserToken } from "../localStorage";
import React, { useCallback } from "react";
import NavbarComponent from "../navbarComponent";
import ItemComponent from "../ItemComponent/ItemComponent";
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

function Shop() {
  let [buyUsdRate, setBuyUsdRate] = useState(null);
  let [err, setErr] = useState(null);
  let [sellUsdRate, setSellUsdRate] = useState(null);
  let [lbpInput, setLbpInput] = useState(0);
  let [usdInput, setUsdInput] = useState(0);
  let [userToken, setUserToken] = useState(getUserToken());
  let [transactionType, setTransactionType] = useState("usd-to-lbp");

  let [lbpBalance, setLbpBalance] = useState("");
  let [usdBalance, setUsdBalance] = useState("");
  let [Items, setItems] = useState([]);

  function fetchRates() {
    fetch(SERVER_URL + "/exchangeRate")
      .then((response) => response.json())
      .then((data) => {
        setSellUsdRate(data.usd_to_lbp);
        setBuyUsdRate(data.lbp_to_usd);
      });
  }

  useEffect(fetchRates, []);

  function addItem() {
    // usd/lbp
    let type = transactionType;

    let data = {
      usdAmount: usdInput,
      lbpAmount: lbpInput,
      usd_to_lbp: false,
    };

    if (lbpInput === 0 || usdInput === 0) {
      setErr("Input is zero or null");
      return;
    }

    if (type == "lbp-to-usd") {
      //buy usd
      setUsdInput(0);
      setLbpInput(0);
      data.usd_to_lbp = false;
    }
    if (type == "usd-to-lbp") {
      //sell usd
      setUsdInput(0);
      setLbpInput(0);
      data.usd_to_lbp = true;
    }

    fetch(SERVER_URL + "/addItem", {
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

  function getItems() {
    fetch(SERVER_URL + "/getItems")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      });
  }

  const fetchInfo = useCallback(() => {
    fetch(`${SERVER_URL}/userInfo`, {
      headers: {
        Authorization: `bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLbpBalance(data.balance_lbp);
        setUsdBalance(data.balance_usd);
      });
  }, [userToken]);
  useEffect(() => {
    if (userToken) {
      fetchInfo();
    }
  }, [fetchInfo, userToken]);

  useEffect(getItems, []);

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
              Exchange Money
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

            <Typography variant="body">
              <b>LBP Balance:</b> {lbpBalance} LBP{" "}
            </Typography>
            <br />
            <Typography variant="body">
              <b>USD Balance:</b> ${usdBalance}{" "}
            </Typography>
          </div>

          <div className="wrapper">
            <Typography sx={{ color: "red" }} className="error">
              {err}
            </Typography>

            <Typography variant="h5">Add An Item</Typography>

            <form name="transaction-entry">
              <div className="amount-input">
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

            <Select
              label={"Transaction Type"}
              id="transaction-type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
              <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
            </Select>

            <Button
              id="add-button"
              sx={sx_button}
              variant="containted"
              onClick={addItem}
            >
              Add
            </Button>
          </div>

          <div className="wrapper">
            <Typography variant="h5">Trade with someone else</Typography>

            <List>
              {Items.map((item) => (
                <ListItem>
                  <ItemComponent
                    buyUsd={item.sell}
                    sellerName={item.user_id}
                    lbpAmount={item.lbpAmount}
                    usdAmount={item.usdAmount}
                    itemID={item.id}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default Shop;
