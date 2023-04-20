import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  ButtonGroup,
} from "@mui/material";
import { Link,useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
  const [TextFieldRoomCode, setTextFieldRoomCode] = useState();
  const [TextFieldErrorState, setErrorState] = useState(false);
  const [TextFieldHelperTextState, setTextFieldHelperTextState] = useState("");
  const navigate = useNavigate();
  function _handleTextFieldChange(e) {
    setTextFieldRoomCode(e.target.value);
  }
  function _enterRoomButtonPressed(e) {
    // console.log(TextFieldRoomCode)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomCode: TextFieldRoomCode,
      }),
    };
    fetch("/api/join-room/", requestOptions).then((response) => {
      if (response.ok) {
        console.log("ok :)");
        navigate(`/room/${TextFieldRoomCode}`)
      } else {
        console.log("not ok :(");
        setErrorState(true);
        setTextFieldHelperTextState("Room not found.");
      }
    });
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={TextFieldErrorState}
          label="Code"
          // value={""}
          helperText={TextFieldHelperTextState}
          variant="outlined"
          onChange={_handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={_enterRoomButtonPressed}
        >
          Enter
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}
