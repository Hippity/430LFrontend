import "./App.css";
import { useState } from "react";
import { Box, Icon, IconButton, List, ListItem, Slide, Toolbar } from "@mui/material";
import { AppBar } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { getUserToken, saveUserToken, clearUserToken } from "./localStorage";
import React from "react";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LoginDialog from "./UserCredentialsDialog/LoginDialog";
import RegisterDialog from "./UserCredentialsDialog/RegisterDialog";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid"
var SERVER_URL = "http://127.0.0.1:5000";



function NavbarComponent(){

    const navigate = useNavigate();

    function Gotoprofile() {
      if (userToken != null){
        if (authState == States.USER_ADMIN){
          navigate("/admin", { replace: true });
        }
      navigate("/profile", { replace: true });
      }
      else{
        setAuthState(States.USER_LOG_IN)
      }
    }
  
    function Gotohome() {
      navigate("/", { replace: true });
    }

    function Gotoshop(){
      if (userToken != null){
        navigate("/shop", { replace: true });
      }
      else{
        setAuthState(States.USER_LOG_IN)
      }
    }

    const States = {
        PENDING: "PENDING",
        USER_CREATION: "USER_CREATION",
        USER_LOG_IN: "USER_LOG_IN",
        USER_AUTHENTICATED: "USER_AUTHENTICATED",
        USER_ADMIN: "USER_ADMIN",
      };
    
      let [userToken, setUserToken] = useState(getUserToken());
      let [authState, setAuthState] = useState(States.PENDING);

    
      function login(username, password) {
        return fetch(`${SERVER_URL}/authentication`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: username,
            password: password,
          }),
        })
          .then((response) => response.json())
          .then((body) => {
            if (body.isAdmin){
              setAuthState(States.USER_ADMIN)
            }
            else{
              setAuthState(States.USER_AUTHENTICATED);
            }
            setUserToken(body.token);
            saveUserToken(body.token);
          });
      }
    
      function createUser(username, password) {
        return fetch(`${SERVER_URL}/signUp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: username,
            password: password,
          }),
        }).then((response) => login(username, password));
      }
    
      function logout() {
        navigate("/", { replace: true });
        setUserToken(null);
        clearUserToken();
      }


    return (

      

      <AppBar sx={{height: "100vh", width:"5rem", backgroundColor: "#336799"}} elevation={0} position="sticky">

      <LoginDialog
        open={States.USER_LOG_IN === authState}
        title={"LOGIN"}
        onClose={() => setAuthState(States.PENDING)}
        submitText={"Login"}
        onCreateNew={() => setAuthState(States.USER_CREATION)}
        onSubmit={login}
      />

      <RegisterDialog
        open={States.USER_CREATION === authState}
        title={"REGISTER"}
        onClose={() => setAuthState(States.PENDING)}
        submitText={"Register"}
        onSubmit={createUser}
      />

      <Snackbar
        elevation={6}
        variant="filled"
        open={authState === States.USER_AUTHENTICATED}
        autoHideDuration={2000}
        onClose={() => setAuthState(States.PENDING)}
      >
        <Alert severity="success">Success</Alert>
      </Snackbar>
        <List className="navbar-li">
          <ListItem>
            <IconButton onClick={Gotoprofile}>
              <Icon className="logo-image" style={{ width: 40, height: 40 }}>
              <img className="logoIm" src={require("./logo.png")} />
                <img className="logoIm" src={require("./logo2.png")}/>
              </Icon>
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton onClick={Gotohome} >
              <CurrencyExchangeIcon
                className="navbar-icon"
                sx={{ color: "#C8D6E3", fontSize: 40 }}
                disabled = {States.USER_ADMIN == authState}
              />
            </IconButton>
          </ListItem>
          <ListItem>
            <IconButton onClick={Gotoshop}>
              <CreditCardIcon
                className="navbar-icon"
                sx={{ color: "#C8D6E3", fontSize: 40 }}
                disabled = {States.USER_ADMIN == authState}

              />
            </IconButton>
          </ListItem>
          <ListItem className="last">
            {userToken !== null ? (
              <IconButton onClick={logout}>
                <LogoutIcon
                  className="navbar-icon"
                  sx={{ color: "#C8D6E3", fontSize: 40 }}
                />
              </IconButton>
            ) : (
              <IconButton onClick={() => setAuthState(States.USER_LOG_IN)}>
                <LoginIcon
                  className="navbar-icon"
                  sx={{ color: "#C8D6E3", fontSize: 40 }}
                />
              </IconButton>
            )}
          </ListItem>
        </List>
        </AppBar>


    


    );
}

export default NavbarComponent