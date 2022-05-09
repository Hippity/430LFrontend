import { Box, createTheme, ThemeProvider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import React, { useState } from "react";
import { getUserToken } from "../localStorage";
import "./ItemComponent.css";
var SERVER_URL = "http://127.0.0.1:5000";


let theme = createTheme({
  palette: {
    primary: {
      main: "#191D24",
    },
    secondary: {
      main: "#336799",
    },
  },
});

export default function ItemComponent({
  lbpAmount,
  usdAmount,
  buyUsd,
  sellerName,
  itemID

}) {

  let [userToken, setUserToken] = useState(getUserToken());


  function ImageSrc(){
    if (buyUsd){
      return <img width={100} height={100} src={require("../buyLogo.png")}/>
    }
    else {
      return <img width={100} height={100} src={require("../sellLogo.png")}/> 
    }
  }

  function buyItem(){
    let data = {
      itemId : itemID
    };
    fetch(SERVER_URL + "/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "token: " + userToken,
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())


  }
 

  return (
    <ThemeProvider theme={theme}>
      <Box className="ItemBox" display={"flex"} flexDirection="row">

      <ImageSrc/>

      <Box sx={{ marginLeft: "1rem",  marginRight:"1rem"}} display={"flex"} flexDirection="column">


        <Typography
          sx={{
            fontSize: 12,
            fontFamily: "Arial",
            fontWeight: "bolder",
            color: "#336899",
          }}
        >
          Seller: {sellerName}
        </Typography>
        
        <Typography
          sx={{
            fontSize: 12,
            fontFamily: "Arial",
            fontWeight: "bolder",
            color: "white",
          }}
        >
          LBP Amount: {lbpAmount}LBP
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            fontFamily: "Arial",
            fontWeight: "bolder",
            color: "white",
          }}
        >
          USD Amount: ${usdAmount} 
        </Typography>


    
        <Button
          sx={{
            backgroundColor: "#1a8926",
            color: "white",
            height: "2rem",
          }}
          onClick={() => buyItem()}
        >
          Trade
        </Button>
      </Box>
    </Box>
    </ThemeProvider>

  );
}
