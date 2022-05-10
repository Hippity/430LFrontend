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
  Paper,
} from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { getUserToken } from "../localStorage";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import React, { useCallback } from "react";
import NavbarComponent from "../navbarComponent";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  Title,
  LineSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";

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

function Home() {
  let [buyUsdRate, setBuyUsdRate] = useState(null);
  let [err, setErr] = useState(null);
  let [sellUsdRate, setSellUsdRate] = useState(null);
  let [lbpInput, setLbpInput] = useState(0);
  let [usdInput, setUsdInput] = useState(0);
  let [transactionType, setTransactionType] = useState("usd-to-lbp");
  let [userToken, setUserToken] = useState(getUserToken());
  let [lbpCalc, setLbpCalc] = useState(0);
  let [usdCalc, setUsdCalc] = useState(0);
  let [sellCount, setSellCount] = useState([]);
  let [buyCount, setBuyCount] = useState([]);
  let [sellAvg, setSellAvg] = useState([]);
  let [BuyAvg, setBuyAvg] = useState([]);

  let [calcType, setCalcType] = useState("usd-to-lbp");
  let [calcDir, setCalcDir] = useState(true);

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

  function fetchRates() {
    fetch(SERVER_URL + "/exchangeRate")
      .then((response) => response.json())
      .then((data) => {
        setSellUsdRate(data.usd_to_lbp);
        setBuyUsdRate(data.lbp_to_usd);
      });
  }

  useEffect(fetchRates, []);

  function fetchStats() {
    fetch(SERVER_URL + "/stats")
      .then((response) => response.json())
      .then((data) => {
        setSellCount(data.sell_count);
        setBuyCount(data.buy_count);
        setBuyAvg(data.avg_buy);
        setSellAvg(data.avg_sell);
      });
  }
  useEffect(fetchStats, []);

  function checkZero() {
    if (
      lbpInput == 0 ||
      usdInput == 0 ||
      lbpInput == null ||
      usdInput == null
    ) {
      setErr("LBP or USD input is zero/null");
    } else {
      addItem();
    }
  }

  function addItem() {
    // usd/lbp
    let isUSDtoLBP = true;
    let type = transactionType;

    let data = {
      usd_amount: usdInput,
      lbp_amount: lbpInput,
      usd_to_lbp: isUSDtoLBP,
    };

    if (type === "lbp-to-usd") {
      //buy usd
      setUsdInput(0);
      setLbpInput(0);
      isUSDtoLBP = false;
    }
    if (type === "usd-to-lbp") {
      //sell usd
      setUsdInput(0);
      setLbpInput(0);
      isUSDtoLBP = true;
    }

    data.usd_to_lbp = isUSDtoLBP;

    fetch(SERVER_URL + "/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token: " + userToken,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchRates();
      });
  }

  function showCalc() {
    if (calcType == "usd-to-lbp") {
      //i have lbp check usd
      if (calcDir == true) {
        setUsdCalc(lbpCalc / sellUsdRate);
      } else {
        setLbpCalc(usdCalc * sellUsdRate);
      }
    } else {
      // lbp-to-usd
      if (calcDir == true) {
        setUsdCalc(lbpCalc * buyUsdRate);
      } else {
        setLbpCalc(usdCalc / buyUsdRate);
      }
    }
  }

  function giveCount1() {
    let data = [];
    let c = 0;
    for (let i = sellCount.length; i > 0; i--) {
      data.push({ x2: c++, y2: sellCount[i] });
    }
    return data;
  }

  function giveCount2() {
    let data = [];
    let c = 0;
    for (let i = buyCount.length; i > 0; i--) {
      data.push({ x2: c++, y2: buyCount[i] });
    }
    return data;
  }

  function giveAvg1() {
    let data = [];
    let c = 0;
    for (let i = BuyAvg.length; i > 0; i--) {
      data.push({ x2: c++, y2: BuyAvg[i] });
    }
    return data;
  }
  function giveAvg2() {
    let data = [];
    let c = 0;
    for (let i = sellAvg.length; i > 0; i--) {
      data.push({ x2: c++, y2: sellAvg[i] });
    }
    return data;
  }

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
              EXHANGE TODAY
            </Typography>
          </Box>

          <div className="wrapper">
            <Typography sx={{ color: "red" }} className="error">
              {err}
            </Typography>

            <Typography variant="h5">Today's Exchange Rate</Typography>

            <Typography variant="body2">LBP to USD Exchange Rate </Typography>

            <Typography variant="h6">
              Sell USD: <span id="sellRate">{sellUsdRate}</span>
            </Typography>

            <Typography variant="h6">
              {" "}
              Buy USD: <span id="buyRate">{buyUsdRate}</span>{" "}
            </Typography>

            <Divider></Divider>

            <Typography variant="h5">Record a recent transaction</Typography>
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
              value={transactionType}
              id="transaction-type"
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
              <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
            </Select>

            <Button
              id="add-button"
              sx={sx_button}
              variant="containted"
              onClick={checkZero}
            >
              Add
            </Button>
          </div>

          <div className="wrapper">
            <Typography variant="h5">Rate Calculator</Typography>

            <div className="box">
              <TextField
                type={"number"}
                sx={sx_textField}
                label={"LBP Amount"}
                value={lbpCalc}
                InputProps={{
                  inputProps: { min: 1 },
                }}
                onChange={(e) => {
                  setLbpCalc(e.target.value);
                  showCalc();
                }}
                disabled={calcDir === false}
              ></TextField>
              <IconButton
                color={"primary"}
                onClick={() => setCalcDir(!calcDir)}
              >
                <CompareArrowsIcon></CompareArrowsIcon>
              </IconButton>
              <TextField
                type={"number"}
                sx={sx_textField}
                value={usdCalc}
                InputProps={{
                  inputProps: { min: 1 },
                }}
                onChange={(e) => {
                  setUsdCalc(e.target.value);
                  showCalc();
                }}
                label={"USD Amount"}
                disabled={calcDir === true}
              ></TextField>
            </div>

            <Select
              label={"Calc Type"}
              value={calcType}
              onChange={(e) => setCalcType(e.target.value)}
            >
              <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
              <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
            </Select>
          </div>

          <div className="wrapper">
            <Paper>
              <Chart data={giveAvg1()}>
                <ArgumentAxis />
                <ValueAxis />
                <LineSeries valueField="y2" argumentField="x2" />

                <Title text="Sell USD rate in the Last 20 Days" />
                <Animation />
              </Chart>
            </Paper>

            <Paper>
              <Chart data={giveCount2()}>
                <ArgumentAxis />
                <ValueAxis />
                <LineSeries valueField="y2" argumentField="x2" />

                <Title text="Number of sell USD transactions in the Last 20 Days" />
                <Animation />
              </Chart>
            </Paper>

            <Paper>
              <Chart data={giveAvg2()}>
                <ArgumentAxis />
                <ValueAxis />
                <LineSeries valueField="y2" argumentField="x2" />

                <Title text="Buy USD rate in the Last 20 Days" />
                <Animation />
              </Chart>
            </Paper>

            <Paper>
              <Chart data={giveCount1()}>
                <ArgumentAxis />
                <ValueAxis />
                <LineSeries valueField="y2" argumentField="x2" />

                <Title text="Number of buy USD transactions in the Last 20 Days" />
                <Animation />
              </Chart>
            </Paper>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default Home;
