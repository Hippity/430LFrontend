import { createTheme, Slide, ThemeProvider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import "./UserCredentialsDialog.css";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LoginDialog({
  open,
  onSubmit,
  onClose,
  title,
  onCreateNew,
  submitText,
}) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let sx_textField = {
    marginTop: "1rem",
    input: { color: "black", ":focus": { color: "#336799" } },
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} 
      TransitionComponent={Transition}
      maxWidth="xs" fullWidth>
        <div className="dialog-container">
          <DialogTitle>
            <Typography variant="h4">{title}</Typography>
          </DialogTitle>
          <div className="form-item">
            <TextField
              fullWidth
              color="secondary"
              label="Username"
              type="text"
              sx={ sx_textField}
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
            />
          </div>
          <div className="form-item">
            <TextField
              fullWidth
              color="secondary"
              label="Password"
              type="password"
              sx={ sx_textField}
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
            />
          </div>
          <p>
            Do not have an account,
            <Button onClick={() => onCreateNew()}>click here</Button>
          </p>
          <br></br>
          <Button
            sx={{
              backgroundColor: "#C8D6E3",
              ":hover": { backgroundColor: "#336799" },
            }}
            variant="contained"
            onClick={() => onSubmit(username, password)}
          >
            {submitText}
          </Button>
        </div>
      </Dialog>
    </ThemeProvider>
  );
}
